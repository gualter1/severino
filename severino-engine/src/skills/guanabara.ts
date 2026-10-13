/**
 * 🎓 Guanabara — paciência pedagógica: junta relatórios, consolida
 * aprendizado em skill versionada e roda mini-teste interno.
 */

import { SkillResumo } from "./skill-types.js";
import { SkillStore } from "./skill-store.js";

export interface GuanabaraAnalise {
  uteis: string[];
  lixo: string[];
  consolidado: string; // markdown
}

export class Guanabara {
  constructor(private store: SkillStore = new SkillStore()) {}

  /**
   * Heurísticas:
   * - `acertos` + `oQueMelhorar` (ou `learned`/`melhorias`) → úteis
   * - `erros` genéricos vazios / sem detalhe → lixo
   * - gera markdown consolidado com seções
   */
  analisar(relatorios: Record<string, any>[]): GuanabaraAnalise {
    const uteis: string[] = [];
    const lixo: string[] = [];

    for (const [i, rel] of relatorios.entries()) {
      const prefix = `rel#${i + 1}`;
      const pick = (keys: string[]): any => {
        for (const k of keys) {
          if (rel[k] !== undefined && rel[k] !== null && rel[k] !== "") return rel[k];
        }
        return undefined;
      };

      const acertos = pick(["acertos", "successes", "wins", "aprendidos"]);
      const melhorias = pick(["oQueMelhorar", "melhorias", "improvements", "learned", "licoes"]);
      const erros = pick(["erros", "errors", "falhas", "failures"]);

      const pushAll = (v: any) => {
        if (v === undefined) return;
        const arr = Array.isArray(v) ? v : [v];
        for (const item of arr) {
          if (typeof item === "string" && item.trim().length > 0) uteis.push(item.trim());
          else if (typeof item === "object") uteis.push(JSON.stringify(item));
        }
      };

      pushAll(acertos);
      pushAll(melhorias);

      // erros: se forem strings vazias/genéricas → lixo; se detalhados → úteis
      if (erros !== undefined) {
        const arr = Array.isArray(erros) ? erros : [erros];
        for (const e of arr) {
          if (typeof e !== "string" || e.trim().length === 0) {
            lixo.push(`${prefix}: erro vazio`);
          } else if (e.trim().length < 8 || /^(erro|falha|bug)$/i.test(e.trim())) {
            lixo.push(`${prefix}: "${e.trim()}" (genérico demais)`);
          } else {
            // erro detalhado também ensina — vai para úteis com contexto
            uteis.push(`[${prefix} erro] ${e.trim()}`);
          }
        }
      }
    }

    const lines: string[] = [];
    lines.push(`# 📚 Consolidado Guanabara`);
    lines.push(``);
    lines.push(`_Gerado a partir de ${relatorios.length} relatório(s)._`);
    lines.push(``);
    lines.push(`## ✅ Úteis (${uteis.length})`);
    if (uteis.length === 0) lines.push(`- (nenhum aprendizado extraído)`);
    else for (const u of uteis) lines.push(`- ${u}`);
    lines.push(``);
    lines.push(`## 🗑️ Lixo (${lixo.length})`);
    if (lixo.length === 0) lines.push(`- (nenhum ruído descartado)`);
    else for (const l of lixo) lines.push(`- ${l}`);
    lines.push(``);

    console.log(`🎓 Guanabara analisou ${relatorios.length} relatório(s): ${uteis.length} úteis, ${lixo.length} lixo`);

    return { uteis, lixo, consolidado: lines.join("\n") };
  }

  /**
   * Publica ou versiona skill na casa:
   * - skill existe (alugar encontra) → versionar com bump patch (x.y.z+1)
   * - senão → publicar nova skill `v1.0`
   * @returns nova versão publicada
   */
  async consolidarParaCasa(
    houseId: string,
    consolidado: string,
    skillBase: SkillResumo
  ): Promise<string> {
    const existente = await this.store.alugar(skillBase.skill_id);
    if (existente) {
      const novaVersao = bumpPatch(existente.versao_estavel);
      // prompt consolidado = prompt antigo + aprendizado novo
      const novoPrompt = `${existente.prompt}\n\n<!-- aprendizado (${novaVersao}) -->\n${consolidado}`;
      await this.store.versionar(existente.skill_id, novaVersao, "Consolidado Guanabara", novoPrompt);
      console.log(`🎓 Guanabara versionou ${existente.skill_id} → ${novaVersao} na ${houseId}`);
      return novaVersao;
    }
    await this.store.publicar(
      {
        skill_id: skillBase.skill_id,
        tags: skillBase.tags,
        resumo: skillBase.resumo,
        dependencias: skillBase.dependencias,
        versao_estavel: "1.0.0",
        prompt: consolidado,
        tools: [],
        historicoVersoes: [
          { versao: "1.0.0", motivo: "Consolidado inicial Guanabara", em: new Date().toISOString() },
        ],
      },
      houseId
    );
    console.log(`🎓 Guanabara publicou ${skillBase.skill_id}@1.0.0 na ${houseId}`);
    return "1.0.0";
  }

  /**
   * Mini-teste interno (stub determinístico):
   * - lê a skill
   * - passou se prompt não-vazio E (sem avaliações OU taxaSucesso >= 0.5)
   *
   * ⚠️ Placeholder: suite real deve executar a skill num sandbox contra
   * casos de teste versionados e medir pass-rate.
   */
  async testeInterno(skill_id: string): Promise<{ passou: boolean; detalhe: string }> {
    const skill = await this.store.alugar(skill_id);
    if (!skill) {
      return { passou: false, detalhe: `skill ${skill_id} não encontrada` };
    }
    const promptOk = skill.prompt.trim().length > 0;
    const taxaOk = skill.taxaSucesso === undefined || skill.taxaSucesso >= 0.5;
    const passou = promptOk && taxaOk;
    const detalhe = passou
      ? `prompt ok (${skill.prompt.length} chars), taxaSucesso=${skill.taxaSucesso ?? "sem avaliações"}`
      : `promptOk=${promptOk}, taxaOk=${taxaOk} (taxaSucesso=${skill.taxaSucesso ?? "sem avaliações"})`;
    console.log(`🎓 testeInterno ${skill_id}: ${passou ? "PASSOU" : "FALHOU"} — ${detalhe}`);
    return { passou, detalhe };
  }
}

function bumpPatch(version: string): string {
  const m = version.trim().match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!m) return "1.0.1";
  return `${m[1]}.${m[2]}.${Number(m[3]) + 1}`;
}