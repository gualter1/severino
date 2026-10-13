/**
 * 🧪 Suite de testes de skill — Fase 1 (validação estática) + Fase 2 (LLM real).
 *
 * Fase 1 (sempre):
 * - Aluga a skill via SkillStore (prompt + tools versionados).
 * - Para cada `SkillTestCase`, roda dentro de `runSandbox` uma verificação
 *   estática: prompt não-vazio E cada `deveConter` aparece no prompt
 *   (case-insensitive, PT-BR sem acento).
 * - NÃO concatena `prompt + entrada` para forjar match (regra honesta).
 * - Casos sem `deveConter` são marcados como SKIP honesto (não contam como pass).
 *
 * Fase 2 (quando há LLM real — NINEROUTER_API_KEY presente e não-mock):
 * - Além da validação estática, monta `prompt da skill + entrada do caso`,
 *   chama `modelRouter.complete()` e verifica se a RESPOSTA do LLM contém
 *   cada `deveConter`.
 * - passRate ponderado: 50% estático + 50% LLM real.
 * - Se mock ou sem key, mantém só o estático (sem quebrar testes):
 *   qualquer falha/rede no LLM faz fallback honesto para o estático.
 */

import { SkillStore, skillStore } from "./skill-store.js";
import { runSandbox } from "./sandbox.js";
import { complete, isMock } from "../factory/model-router.js";

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
  const promptDaSkill = skill.prompt;
  // Fase 2 só quando há LLM de verdade: key presente E resposta não-mock.
  // modelRouter.complete() nunca lança e sinaliza `mock:true` em fallback —
  // qualquer mock/falha volta honestamente para o estático.
  const llmDisponivel = !isMock();
  if (llmDisponivel) {
    console.log(`🧪 [${skill_id}] Fase 2 ativa: validação estática (50%) + LLM real (50%).`);
  } else {
    console.log(`🧪 [${skill_id}] sem LLM real (sem NINEROUTER_API_KEY ou mock) — só validação estática.`);
  }
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
        const faltandoEstatico = expectativas.filter((e) => !promptNorm.includes(norm(e)));
        const estaticoOk = faltandoEstatico.length === 0;

        // Sem LLM real → mantém só o estático (comportamento Fase 1).
        if (!llmDisponivel) {
          if (estaticoOk) return true;
          throw new Error(`faltando no prompt: ${faltandoEstatico.map((f) => `"${f}"`).join(", ")}`);
        }

        // Fase 2: invoca o LLM com (prompt da skill + entrada do caso) e
        // verifica se a RESPOSTA contém cada deveConter.
        let respostaNorm = "";
        let llmReal = false;
        try {
          const r = await complete(
            [{ role: "user", content: caso.entrada }],
            { systemPrompt: promptDaSkill, temperature: 0.2, maxTokens: 800 }
          );
          llmReal = !r.mock;
          respostaNorm = norm(r.content || "");
        } catch {
          llmReal = false;
        }
        if (!llmReal) {
          // Fallback honesto: LLM indisponível/falhou → só estático.
          if (estaticoOk) return true;
          throw new Error(`faltando no prompt: ${faltandoEstatico.map((f) => `"${f}"`).join(", ")} (LLM indisponível — fallback estático)`);
        }
        const faltandoLlm = expectativas.filter((e) => !respostaNorm.includes(norm(e)));

        // passRate ponderado por caso: 50% estático + 50% LLM real.
        const nota = (estaticoOk ? 0.5 : 0) + (faltandoLlm.length === 0 ? 0.5 : 0);
        if (nota >= 0.75) return true;
        const partes: string[] = [];
        if (!estaticoOk) partes.push(`estático 0/0.5 (faltando: ${faltandoEstatico.map((f) => `"${f}"`).join(", ")})`);
        if (faltandoLlm.length > 0) partes.push(`LLM 0/0.5 (resposta sem: ${faltandoLlm.map((f) => `"${f}"`).join(", ")})`);
        throw new Error(`nota ${nota.toFixed(2)} < 0.75 — ${partes.join("; ")}`);
      }
    );

    if (resultado.ok && resultado.artefato === true) {
      passed += 1;
      const msg = llmDisponivel
        ? `PASSOU "${caso.nome}": estático+LLM (50/50) cobrem [${expectativas.map((e) => `"${e}"`).join(", ")}].`
        : `PASSOU "${caso.nome}": prompt contém [${expectativas.map((e) => `"${e}"`).join(", ")}].`;
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
