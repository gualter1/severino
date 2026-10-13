/**
 * 🧪 Suite de testes de skill — Fase 1 (validação estática honesta).
 *
 * O que faz hoje (Fase 1):
 * - Aluga a skill via SkillStore (prompt + tools versionados).
 * - Para cada `SkillTestCase`, roda dentro de `runSandbox` uma verificação
 *   estática: prompt não-vazio E cada `deveConter` aparece no prompt
 *   (case-insensitive).
 * - NÃO concatena `prompt + entrada` para forjar match (regra honesta).
 * - Casos sem `deveConter` são marcados como SKIP honesto (não contam como pass).
 *
 * Fase 2 (planejada — execução LLM real):
 * - Quando houver um model-router/LLM disponível, cada caso deverá montar
 *   `prompt + entrada`, chamar o LLM dentro do sandbox e verificar se a
 *   RESPOSTA contém cada `deveConter`. A assinatura `runSkillTests` já está
 *   pronta para essa troca: basta substituir o corpo da validação dentro do
 *   `runSandbox` por uma chamada real, mantendo `passRate = passed/total` e
 *   `passou = passRate >= 0.7`.
 */

import { SkillStore, skillStore } from "./skill-store.js";
import { runSandbox } from "./sandbox.js";

export interface SkillTestCase {
  /** Nome legível do caso (ex: "3 notas") */
  nome: string;
  /** Entrada simulada do usuário */
  entrada: string;
  /** Trechos que o prompt da skill deve conter (case-insensitive) */
  deveConter: string[];
}

export interface SkillTestResult {
  passou: boolean;
  passRate: number;
  detalhes: string[];
}

const LIMIAR_APROVACAO = 0.7;

/**
 * Normaliza para comparação PT-BR honesta: minúsculas + sem acentos,
 * de modo que "media" encontra "média" (e vice-versa).
 */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export async function runSkillTests(
  skill_id: string,
  casos: SkillTestCase[],
  store: SkillStore = skillStore
): Promise<SkillTestResult> {
  const total = casos.length;
  if (total === 0) {
    console.log(`🧪 [${skill_id}] nenhum caso de teste — nada a validar.`);
    return { passou: false, passRate: 0, detalhes: ["Nenhum caso de teste fornecido."] };
  }

  const skill = await store.alugar(skill_id);
  if (!skill) {
    console.log(`🧪 [${skill_id}] skill não encontrada — 0/${total} passaram.`);
    return {
      passou: false,
      passRate: 0,
      detalhes: casos.map((c) => `FALHOU "${c.nome}": skill ${skill_id} não encontrada.`),
    };
  }

  if (skill.prompt.trim().length === 0) {
    console.log(`🧪 [${skill_id}] prompt vazio — 0/${total} passaram.`);
    return {
      passou: false,
      passRate: 0,
      detalhes: casos.map((c) => `FALHOU "${c.nome}": prompt da skill está vazio.`),
    };
  }

  const promptNorm = norm(skill.prompt);
  const detalhes: string[] = [];
  let passed = 0;

  for (const caso of casos) {
    const expectativas = caso.deveConter ?? [];
    if (expectativas.length === 0) {
      const msg = `SKIP "${caso.nome}": sem expectativas (deveConter vazio) — honestamente ignorado.`;
      detalhes.push(msg);
      console.log(`🧪 [${skill_id}] ${msg}`);
      continue;
    }

    const resultado = await runSandbox<boolean>(
      `skill-test-${skill_id}`,
      "skill-test",
      async (_wsDir) => {
        // Fase 1: validação estática do prompt (sem LLM), PT-BR sem acento.
        // Fase 2: trocar por execução real (prompt + entrada → LLM → resposta).
        const faltando = expectativas.filter((e) => !promptNorm.includes(norm(e)));
        if (faltando.length === 0) return true;
        throw new Error(`faltando no prompt: ${faltando.map((f) => `"${f}"`).join(", ")}`);
      }
    );

    if (resultado.ok && resultado.artefato === true) {
      passed += 1;
      const msg = `PASSOU "${caso.nome}": prompt contém [${expectativas.map((e) => `"${e}"`).join(", ")}].`;
      detalhes.push(msg);
      console.log(`🧪 [${skill_id}] ${msg}`);
    } else {
      const motivo = resultado.erro ?? "falha desconhecida no sandbox";
      const msg = `FALHOU "${caso.nome}": ${motivo}.`;
      detalhes.push(msg);
      console.log(`🧪 [${skill_id}] ${msg}`);
    }
  }

  const passRate = Number((passed / total).toFixed(2));
  const passou = passRate >= LIMIAR_APROVACAO;
  console.log(
    `🧪 [${skill_id}] suite concluída: ${passed}/${total} passaram (passRate=${passRate}) → ${passou ? "PASSOU" : "FALHOU"} (limiar ${LIMIAR_APROVACAO}).`
  );
  return { passou, passRate, detalhes };
}
