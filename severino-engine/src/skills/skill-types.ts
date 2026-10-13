/**
 * 📚 Tipos da Skill Store — contratos entre Guanabara, SkillStore e Sandbox.
 */

export interface SkillResumo {
  /** Identificador único da skill (slug) ex: "backend-sem-erros" */
  skill_id: string;
  /** Tags de busca (ex: ["backend", "validacao", "zod"]) */
  tags: string[];
  /** Resumo curto (≤ 160 chars) para exibição em listas */
  resumo: string;
  /** IDs de outras skills que esta depende (opcional) */
  dependencias: string[];
  /** Versão estável atual (semver) ex: "1.0.0" */
  versao_estavel: string;
}

/** Versão completa — carregada apenas quando alugada (lazy) */
export interface SkillCompleta extends SkillResumo {
  /** Prompt completo que será injetado no agente */
  prompt: string;
  /** Ferramentas permitidas (ex: ["fs","net","shell"]) */
  tools: string[];
  /** Histórico de versões para auditoria */
  historicoVersoes: {
    versao: string;
    motivo: string;
    em: string; // ISO timestamp
  }[];
  /** Taxa de sucesso (0-1) calculada a partir de devoluções; undefined = sem avaliações */
  taxaSucesso?: number;
}