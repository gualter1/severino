/**
 * 🏘️ Casas — Vila Severino (porte fiel, sem vendor lock).
 *
 * Por que existe: o Carteiro entrega na CASA do domínio, não em micro-times.
 * Cada casa tem MORADORES (robôs) separados por QUARTOS (roles).
 * Fonte original: severino-core/src/micro-agents/houses.ts
 */

export interface HouseDef {
  houseId: string;
  name: string;
  street: string;
  domains: string[];
  rooms: string[];
  techLeadRoom: string;
  description: string;
}

export const HOUSES: Record<string, HouseDef> = {
  "casa-dev": {
    houseId: "casa-dev",
    name: "Casa dos Desenvolvedores",
    street: "rua-do-desenvolvimento",
    domains: ["backend", "frontend", "qa", "devops", "security", "tech-lead"],
    rooms: [
      "tech-lead",
      "backend-developer",
      "frontend-developer",
      "qa-engineer",
      "devops-engineer",
      "security-engineer",
    ],
    techLeadRoom: "tech-lead",
    description: "Todo mundo que constrói software mora aqui, cada um no seu quarto.",
  },
  "casa-negocios": {
    houseId: "casa-negocios",
    name: "Casa de Negócios",
    street: "rua-do-negocio",
    domains: ["sales", "product"],
    rooms: ["tech-lead", "sales-specialist", "product-manager", "generalist"],
    techLeadRoom: "tech-lead",
    description: "Vendas e produto: quem vende e quem desenha o que vender.",
  },
  "casa-dados": {
    houseId: "casa-dados",
    name: "Casa de Dados & Pesquisa",
    street: "rua-do-conhecimento",
    domains: ["data", "research"],
    rooms: ["tech-lead", "data-engineer", "researcher", "generalist"],
    techLeadRoom: "tech-lead",
    description: "Dados e pesquisa: quem mede e quem investiga.",
  },
};

export function houseForDomain(domain: string): HouseDef {
  const d = (domain || "backend").toLowerCase();
  for (const h of Object.values(HOUSES)) {
    if (h.domains.includes(d)) return h;
  }
  return HOUSES["casa-dev"];
}

export function isHouseId(teamId: string): boolean {
  return teamId in HOUSES;
}

/** Nome curto pra compor robotId: casa-dev -> dev */
export function shortHouse(houseId: string): string {
  return houseId.replace(/^casa-/, "").slice(0, 12) || "casa";
}

/**
 * Nome do robô iniciado pela especialidade:
 * robot-{role}-{houseShort}-{nn}  ex: robot-backend-developer-dev-01
 */
export function robotIdForRoom(role: string, houseId: string, counter: number): string {
  const cleanRole =
    role.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "generalist";
  const nn = String(counter).padStart(2, "0");
  return `robot-${cleanRole}-${shortHouse(houseId)}-${nn}`;
}

/** Título humano do quarto: backend-developer -> Backend Developer */
export function roomTitle(role: string): string {
  return role
    .split(/[-_]/g)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}
