/**
 * 🔥 Grill-me opt-in (ADR-002 §8) — rodada opcional de alinhamento/consenso.
 *
 * Usar quando: decisão irreversível (schema, auth, custo), divergência entre
 * reviews (ex: tranquilao aprova, kaspersky nega), ou pipeline >5 etapas.
 * Evitar como default: custo em latência/tokens + risco de influência
 * (âncora do primeiro a falar, bandwagon).
 *
 * Mitigação obrigatória quando usar:
 * - votos cegos e simultâneos (Promise.all, cada papel sem ver o outro)
 * - líder (tech-lead) resume por último
 * - limite de 1 rodada (empate/divergência → decide tech-lead, registra dissenso)
 */

import { complete, isMock } from "../factory/model-router.js";

export interface GrillResult {
  consenso: string;
  votantes: number;
  dissentimento: boolean;
}

/** Timeout por voto LLM (default 120s, ENV SEVERINO_GRILL_TIMEOUT_MS). */
function grillTimeoutMs(): number {
  return Number(process.env.SEVERINO_GRILL_TIMEOUT_MS || 120000);
}

const PAPEIS_VOTANTES = [
  {
    id: "turing",
    system:
      "Você é turing (html/css, pragmático). Vote de forma cega e independente: responda com VEREDITO: APROVAR ou VEREDITO: NEGAR + motivo curto (1-2 frases). Não mencione outros votantes.",
  },
  {
    id: "towards",
    system:
      "Você é towards (js, lógica). Vote de forma cega e independente: responda com VEREDITO: APROVAR ou VEREDITO: NEGAR + motivo curto (1-2 frases). Não mencione outros votantes.",
  },
  {
    id: "tranquilao",
    system:
      "Você é tranquilao (review, qualidade). Vote de forma cega e independente: responda com VEREDITO: APROVAR ou VEREDITO: NEGAR + motivo curto (1-2 frases). Não mencione outros votantes.",
  },
] as const;

const TECH_LEAD_SYSTEM =
  "Você é o tech-lead da casa. Resuma por último os votos cegos abaixo em 2-4 frases (consenso operacional). Se houver divergência (ex: um aprova e outro nega), registre DISSENSO: sim e decida você (a decisão do tech-lead prevalece). Termine com DECISÃO: <texto>.";

function norm(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const SINAL_APROVA = ["aprova", "aprov", "sim", "libera", "seguro", "ok", "lgtm", "veredito: aprovar"];
const SINAL_NEGA = ["nega", "nao", "bloque", "risco", "inseguro", "veto", "contra", "veredito: negar"];

function polaridade(texto: string): "aprova" | "nega" | "neutro" {
  const n = norm(texto);
  const temNega = SINAL_NEGA.some((k) => n.includes(norm(k)));
  const temAprova = SINAL_APROVA.some((k) => n.includes(norm(k)));
  if (temNega && !temAprova) return "nega";
  if (temAprova && !temNega) return "aprova";
  return "neutro";
}

/** Divergência honesta: há pelo menos um voto "aprova" e outro "nega". */
function haDivergencia(textos: string[]): boolean {
  const pols = textos.map(polaridade);
  return pols.includes("aprova") && pols.includes("nega");
}

function consensoMock(cartaId: string, opinioes: string[]): GrillResult {
  const limpas = (opinioes || []).map((o) => (o || "").trim()).filter(Boolean);
  if (limpas.length === 0) {
    return {
      consenso: `tech-lead decide (mock): sem opiniões para a carta ${cartaId} — aguardar mais contexto antes do aceite final.`,
      votantes: 0,
      dissentimento: false,
    };
  }
  // Maioria simples por texto normalizado; empate → primeira opinião (tech-lead decide).
  const contagem = new Map<string, { texto: string; n: number }>();
  for (const o of limpas) {
    const k = norm(o);
    const atual = contagem.get(k);
    if (atual) atual.n += 1;
    else contagem.set(k, { texto: o, n: 1 });
  }
  const ranking = [...contagem.values()].sort((a, b) => b.n - a.n);
  const vencedora = ranking[0].texto;
  const divergiu = haDivergencia(limpas) || ranking.length > 1;
  const consenso = divergiu
    ? `tech-lead decide (mock): DISSENSO registrado entre ${limpas.length} opinião(ões) — prevalece: "${vencedora.slice(0, 280)}".`
    : `tech-lead resume (mock): consenso em "${vencedora.slice(0, 280)}".`;
  console.log(
    `🔥 grill-me (mock) carta ${cartaId}: ${limpas.length} votante(s), dissenso=${divergiu}`
  );
  return { consenso, votantes: limpas.length, dissentimento: divergiu };
}

/**
 * Roda o grill-me (1 rodada, opt-in).
 * @param cartaId id da carta em grill
 * @param opinioes opiniões/contextos iniciais (ex: [objective] ou votos prévios como kaspersky vs towards)
 * @param objective contexto extra opcional (objetivo da carta)
 */
export async function runGrillMe(
  cartaId: string,
  opinioes: string[] = [],
  objective?: string
): Promise<GrillResult> {
  const id = (cartaId || "").trim();
  if (!id) throw new Error("cartaId obrigatório para o grill-me.");
  const contexto = [...(opinioes || []).map((o) => (o || "").trim()).filter(Boolean)];
  if (objective && objective.trim() && !contexto.includes(objective.trim())) {
    contexto.unshift(objective.trim());
  }

  // Sem LLM (sem key ou mock) → consenso local determinístico, nunca quebra.
  if (isMock()) {
    return consensoMock(id, contexto);
  }

  const baseContexto =
    contexto.length > 0
      ? contexto.map((c, i) => `Contexto ${i + 1}: ${c}`).join("\n")
      : "(sem contexto adicional — vote pelo objetivo da carta)";

  try {
    // Votos cegos e simultâneos: cada papel vota sem ver os outros.
    const tmo = grillTimeoutMs();
    const votos = await Promise.all(
      PAPEIS_VOTANTES.map((papel) =>
        complete(
          [
            {
              role: "user",
              content:
                `Carta ${id} em grill-me (voto CEGO — não há outros votos visíveis).\n` +
                `${baseContexto}\n\n` +
                `Dê seu veredito independente (VEREDITO: APROVAR ou VEREDITO: NEGAR + motivo curto).`,
            },
          ],
          { systemPrompt: papel.system, temperature: 0.3, maxTokens: 400, timeoutMs: tmo }
        )
      )
    );

    // Se qualquer voto caiu em MOCK (rede/key), cai no consenso local honesto.
    if (votos.some((v) => v.mock)) {
      console.warn("🔥 grill-me: voto LLM caiu em MOCK — usando consenso local.");
      return consensoMock(id, contexto.length > 0 ? contexto : votos.map((v) => v.content));
    }

    const textosVotos = votos.map((v) => v.content || "");
    const divergiuVotos = haDivergencia(textosVotos);

    // Líder resume por último (único a ver todos os votos).
    const resumo = await complete(
      [
        {
          role: "user",
          content:
            `Carta ${id} — votos cegos (1 rodada, não há segunda rodada):\n` +
            textosVotos.map((t, i) => `Voto ${PAPEIS_VOTANTES[i].id}: ${t}`).join("\n\n") +
            `\n\nResuma e decida.`,
        },
      ],
      { systemPrompt: TECH_LEAD_SYSTEM, temperature: 0.2, maxTokens: 600, timeoutMs: grillTimeoutMs() }
    );

    if (resumo.mock) {
      console.warn("🔥 grill-me: resumo do tech-lead caiu em MOCK — usando consenso local.");
      return consensoMock(id, textosVotos);
    }

    const textoResumo = (resumo.content || "").trim();
    const dissentimento =
      divergiuVotos ||
      /dissenso\s*:\s*sim|diverg[eê]ncia/i.test(textoResumo) ||
      haDivergencia([textoResumo, ...textosVotos]);
    const consenso = textoResumo || consensoMock(id, textosVotos).consenso;
    console.log(
      `🔥 grill-me carta ${id}: ${votos.length} votantes cegos + tech-lead, dissenso=${dissentimento}`
    );
    return { consenso, votantes: votos.length, dissentimento };
  } catch (err: any) {
    console.warn(`🔥 grill-me falhou (${err?.message || err}) — caindo no consenso local.`);
    return consensoMock(id, contexto);
  }
}
