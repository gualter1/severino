/**
 * 📬 SeverinoEngine — Carteiro determinístico (sem LLM).
 *
 * Fluxo: inferDomain → houseForDomain → checkStock → decisão.
 * - tem morador → use-existing
 * - não tem → create-new (NÃO cria aqui; a factory faz)
 */

import { houseForDomain } from "../houses/houses.js";
import { checkStock } from "./stock.js";

export interface PostmanDecision {
  action: "use-existing" | "create-new";
  teamId: string; // = houseId
  robotId?: string;
  domain: string;
  houseId: string;
  houseName: string;
  room?: string;
  roles?: string[];
  reason: string;
}

export interface TaskHints {
  domain?: string;
  teamId?: string;
  room?: string;
}

export class SeverinoEngine {
  async handleTask(objective: string, hints: TaskHints = {}): Promise<PostmanDecision> {
    const clean = (objective || "").trim();
    if (clean.length < 3) {
      throw new Error("Objetivo vazio ou curto demais para roteamento.");
    }

    // 1) domínio via keyword (ou hint explícito)
    const domain = (hints.domain || this.inferDomain(clean)).toLowerCase();

    // 2) casa do domínio (override manual via hints.teamId respeitado)
    const house = houseForDomain(domain);
    const targetHouseId = hints.teamId || house.houseId;
    const targetHouseName = hints.teamId && hints.teamId !== house.houseId ? hints.teamId : house.name;

    // quarto desejado: hint > keyword > generalist
    const wantedRoom = (hints.room || this.inferRoom(clean, domain)).toLowerCase();

    console.log(`📬 Carteiro: '${clean.slice(0, 80)}' → domínio '${domain}' → casa '${targetHouseId}' (quarto '${wantedRoom}')`);

    // 3) estoque: quarto exato → qualquer idle da casa → null
    const found = await checkStock(wantedRoom, targetHouseId);

    // 4a) tem morador → reutiliza
    if (found) {
      const exact = found.role.toLowerCase() === wantedRoom;
      const via = exact ? `quarto '${wantedRoom}'` : `quarto '${found.role}' (cobertura)`;
      console.log(`📦 Estoque: reutilizando ${found.robotId}`);
      return {
        action: "use-existing",
        teamId: targetHouseId,
        robotId: found.robotId,
        domain,
        houseId: targetHouseId,
        houseName: targetHouseName,
        room: found.role,
        reason: `📬 Carteiro entregou na ${targetHouseName} — ${via}, morador ${found.robotId} atendeu.`,
      };
    }

    // 4b) sem morador → sinaliza criação (factory resolve)
    console.log(`🏭 Fábrica: nenhum morador ocioso — sinalizando create-new ('${wantedRoom}')`);
    return {
      action: "create-new",
      teamId: targetHouseId,
      domain,
      houseId: targetHouseId,
      houseName: targetHouseName,
      room: wantedRoom,
      roles: [wantedRoom],
      reason: `📬 Carteiro entregou na ${targetHouseName}, mas sem morador ocioso — fábrica deve abrir quarto '${wantedRoom}'.`,
    };
  }

  inferDomain(objective: string): string {
    const o = objective.toLowerCase();
    if (/frontend|react|vue|angular|svelte|css|html|tailwind|\bui\b|tela|componente/.test(o)) return "frontend";
    if (/\bqa\b|test|testing|jest|vitest|cypress|playwright|e2e|cobertura/.test(o)) return "qa";
    if (/devops|docker|kubernetes|\bk8s\b|ci\/cd|terraform|deploy|pipeline.*deploy|aws|azure|gcp/.test(o)) return "devops";
    if (/secur|auth|owasp|pentest|vulnerab|cripto|firewall|permission/.test(o)) return "security";
    if (/\bdata\b|analytics|\betl\b|spark|kafka|elasticsearch|dataset/.test(o)) return "data";
    if (/research|investigat|pesquis|survey|experiment|analis/.test(o)) return "research";
    if (/sales|venda|crm|lead|hubspot|salesforce/.test(o)) return "sales";
    if (/product|produto|roadmap|feature|backlog|spec/.test(o)) return "product";
    if (/tech-lead|arquitet|sindico|planejamento técnico/.test(o)) return "tech-lead";
    // backend é o fallback (api, endpoint, banco, sql...)
    return "backend";
  }

  inferRoom(objective: string, domain: string): string {
    const o = objective.toLowerCase();
    if (/react|vue|angular|css|html|tailwind|tela|componente|frontend|\bui\b/.test(o)) return "frontend-developer";
    if (/test|qa|cypress|playwright|jest|vitest|e2e|cobertura/.test(o)) return "qa-engineer";
    if (/docker|\bk8s\b|kubernetes|deploy|terraform|infra|ci\/cd/.test(o)) return "devops-engineer";
    if (/auth|secur|vulnerab|pentest|owasp|cripto|permission/.test(o)) return "security-engineer";
    if (/endpoint|api|backend|banco|\bsql\b|migration|webhook|fila|cache/.test(o)) return "backend-developer";
    if (/sale|venda|crm/.test(o)) return "sales-specialist";
    if (/product|produto|roadmap/.test(o)) return "product-manager";
    if (/data|etl|pipeline|dataset/.test(o)) return "data-engineer";
    if (/research|pesquis|investigat/.test(o)) return "researcher";
    const byDomain: Record<string, string> = {
      backend: "backend-developer",
      frontend: "frontend-developer",
      qa: "qa-engineer",
      devops: "devops-engineer",
      security: "security-engineer",
      "tech-lead": "tech-lead",
      sales: "sales-specialist",
      product: "product-manager",
      data: "data-engineer",
      research: "researcher",
    };
    return byDomain[domain] || "generalist";
  }
}

export const severinoEngine = new SeverinoEngine();
