/**
 * 📚 SkillStore — persistência em filesystem + índice em memória.
 *
 * Estrutura no disco:
 *   <repoRoot>/store/skills/<houseId>/<skill_id>.json   (SkillCompleta)
 *
 * Índice em memória (SkillResumo) reconstruído sob demanda.
 */

import { promises as fs } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { SkillResumo, SkillCompleta } from "./skill-types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// repoRoot = severino-engine (two levels up from src/skills)
const REPO_ROOT = resolve(__dirname, "../../");
const STORE_ROOT = join(REPO_ROOT, "store", "skills");

function log(...args: any[]) {
  console.log("📚", ...args);
}

export class SkillStore {
  private _index: Map<string, SkillResumo[]> | null = null; // houseId -> resumos[]

  // ---------------------------------------------------------------------------
  // Helpers de caminho
  // ---------------------------------------------------------------------------
  private skillPath(houseId: string, skill_id: string): string {
    return join(STORE_ROOT, houseId, `${skill_id}.json`);
  }

  private houseDir(houseId: string): string {
    return join(STORE_ROOT, houseId);
  }

  // ---------------------------------------------------------------------------
  // Índice em memória (lazy)
  // ---------------------------------------------------------------------------
  private async ensureIndex(): Promise<Map<string, SkillResumo[]>> {
    if (this._index) return this._index;
    const index = new Map<string, SkillResumo[]>();
    try {
      const houseIds = await fs.readdir(STORE_ROOT);
      for (const houseId of houseIds) {
        const housePath = join(STORE_ROOT, houseId);
        const stat = await fs.stat(housePath);
        if (!stat.isDirectory()) continue;
        const files = await fs.readdir(housePath);
        const resumos: SkillResumo[] = [];
        for (const file of files) {
          if (!file.endsWith(".json")) continue;
          const full = join(housePath, file);
          try {
            const raw = await fs.readFile(full, "utf-8");
            const skill = JSON.parse(raw) as SkillCompleta;
            // monta resumo
            const resumo: SkillResumo = {
              skill_id: skill.skill_id,
              tags: skill.tags,
              resumo: skill.resumo,
              dependencias: skill.dependencias,
              versao_estavel: skill.versao_estavel,
            };
            resumos.push(resumo);
          } catch {
            // ignora arquivos corrompidos
          }
        }
        index.set(houseId, resumos);
      }
    } catch {
      // store root não existe ainda — índice vazio
    }
    this._index = index;
    return index;
  }

  private invalidateIndex(): void {
    this._index = null;
  }

  // ---------------------------------------------------------------------------
  // Busca por overlap de tags + resumo (case-insensitive)
  // ---------------------------------------------------------------------------
  async buscar(query: string, houseId?: string): Promise<SkillResumo[]> {
    const index = await this.ensureIndex();
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: { skill: SkillResumo; score: number }[] = [];

    const houses = houseId ? [houseId] : Array.from(index.keys());
    for (const h of houses) {
      const list = index.get(h) || [];
      for (const skill of list) {
        let score = 0;
        const tagsJoined = skill.tags.join(" ").toLowerCase();
        const resumoLow = skill.resumo.toLowerCase();
        // cada tag que aparece na query
        for (const tag of skill.tags) {
          if (q.includes(tag.toLowerCase())) score += 3;
        }
        // palavras do resumo
        const words = q.split(/\s+/);
        for (const w of words) {
          if (tagsJoined.includes(w)) score += 2;
          if (resumoLow.includes(w)) score += 1;
        }
        if (score > 0) results.push({ skill, score });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.map((r) => r.skill);
  }

  // ---------------------------------------------------------------------------
  // Alugar — carrega SkillCompleta do disco
  // ---------------------------------------------------------------------------
  async alugar(skill_id: string): Promise<SkillCompleta | null> {
    const index = await this.ensureIndex();
    for (const [houseId, list] of index.entries()) {
      const found = list.find((s) => s.skill_id === skill_id);
      if (found) {
        const fullPath = this.skillPath(houseId, skill_id);
        const raw = await fs.readFile(fullPath, "utf-8");
        const skill = JSON.parse(raw) as SkillCompleta;
        log(`aluguel → ${skill_id} (casa ${houseId})`);
        return skill;
      }
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // Devolver — atualiza taxaSucesso
  // ---------------------------------------------------------------------------
  async devolver(
    skill_id: string,
    aval: { foiBoa: boolean; comentario: string }
  ): Promise<void> {
    const index = await this.ensureIndex();
    for (const [houseId, list] of index.entries()) {
      const found = list.find((s) => s.skill_id === skill_id);
      if (found) {
        const fullPath = this.skillPath(houseId, skill_id);
        const raw = await fs.readFile(fullPath, "utf-8");
        const skill = JSON.parse(raw) as SkillCompleta;
        const prev = skill.taxaSucesso ?? 0;
        const n = skill.taxaSucesso !== undefined ? 2 : 1; // simplificação
        const novo = (prev * (n - 1) + (aval.foiBoa ? 1 : 0)) / n;
        skill.taxaSucesso = Number(novo.toFixed(2));
        await fs.writeFile(fullPath, JSON.stringify(skill, null, 2), "utf-8");
        this.invalidateIndex();
        log(`devolução → ${skill_id} taxaSucesso=${skill.taxaSucesso} (${aval.comentario})`);
        return;
      }
    }
    throw new Error(`Skill ${skill_id} não encontrada para devolução`);
  }

  // ---------------------------------------------------------------------------
  // Publicar nova skill
  // ---------------------------------------------------------------------------
  async publicar(skill: SkillCompleta, houseId: string): Promise<void> {
    const dir = this.houseDir(houseId);
    await fs.mkdir(dir, { recursive: true });
    const fullPath = this.skillPath(houseId, skill.skill_id);
    await fs.writeFile(fullPath, JSON.stringify(skill, null, 2), "utf-8");
    this.invalidateIndex();
    log(`publicada → ${skill.skill_id}@${skill.versao_estavel} na ${houseId}`);
  }

  // ---------------------------------------------------------------------------
  // Versionar skill existente (bump + histórico)
  // ---------------------------------------------------------------------------
  async versionar(
    skill_id: string,
    novaVersao: string,
    motivo: string,
    novoPrompt?: string
  ): Promise<void> {
    const index = await this.ensureIndex();
    for (const [houseId, list] of index.entries()) {
      const found = list.find((s) => s.skill_id === skill_id);
      if (found) {
        const fullPath = this.skillPath(houseId, skill_id);
        const raw = await fs.readFile(fullPath, "utf-8");
        const skill = JSON.parse(raw) as SkillCompleta;
        skill.historicoVersoes.push({
          versao: novaVersao,
          motivo,
          em: new Date().toISOString(),
        });
        skill.versao_estavel = novaVersao;
        if (novoPrompt) skill.prompt = novoPrompt;
        await fs.writeFile(fullPath, JSON.stringify(skill, null, 2), "utf-8");
        this.invalidateIndex();
        log(`versionada → ${skill_id} → ${novaVersao} (${motivo})`);
        return;
      }
    }
    throw new Error(`Skill ${skill_id} não encontrada para versionar`);
  }
}

// Instância singleton para uso direto
export const skillStore = new SkillStore();