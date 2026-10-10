#!/usr/bin/env node
/**
 * 🏭 Fábrica de Robôs — Severino Agent Factory
 *
 * Uso:
 *   npx tsx create-robot.ts --role backend --id robot-backend-003 --name "API Specialist"
 *   npx tsx create-robot.ts --from-template backend --id robot-backend-004
 */

import { promises as fs } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATE_DIR = join(__dirname, "room-template");
const ROOMS_DIR = process.env.ROOMS_DIR || join(__dirname, "..", "..", "..", "..", "rooms"); // _consolidado/rooms/

interface RobotConfig {
  id: string;
  role: string;
  name: string;
  description?: string;
  model?: string;
  capabilities?: string[];
  allowedDomains?: string[];
  skillKits?: string[];
  primaryLanguage?: string;
  framework?: string;
}

const ROLE_DEFAULTS: Record<string, Partial<RobotConfig>> = {
  backend: {
    model: "openrouter/anthropic/claude-3.5-sonnet",
    capabilities: ["github-cli", "npm-scripts", "database-migrate", "stripe-cli", "docker-compose"],
    allowedDomains: ["backend", "devops"],
    skillKits: ["01-engenharia/backend-dev-kit"],
    primaryLanguage: "typescript",
    framework: "fastify",
  },
  frontend: {
    model: "openrouter/anthropic/claude-3.5-sonnet",
    capabilities: ["github-cli", "npm-scripts", "browser", "storybook", "playwright"],
    allowedDomains: ["frontend", "qa"],
    skillKits: ["01-engenharia/frontend-ux-kit"],
    primaryLanguage: "typescript",
    framework: "react",
  },
  qa: {
    model: "openrouter/anthropic/claude-3.5-sonnet",
    capabilities: ["playwright", "vitest", "k6", "github-cli", "npm-scripts"],
    allowedDomains: ["qa", "backend", "frontend"],
    skillKits: ["01-engenharia/qa-engineer-kit"],
    primaryLanguage: "typescript",
    framework: "vitest+playwright",
  },
  devops: {
    model: "openrouter/anthropic/claude-3.5-sonnet",
    capabilities: ["kubectl", "helm", "terraform", "docker", "github-cli", "aws-cli"],
    allowedDomains: ["devops", "backend"],
    skillKits: ["01-engenharia/devops-platform-kit"],
    primaryLanguage: "yaml",
    framework: "kubernetes",
  },
  security: {
    model: "openrouter/anthropic/claude-3.5-sonnet",
    capabilities: ["semgrep", "snyk", "owasp-zap", "github-cli", "npm-scripts"],
    allowedDomains: ["security", "backend", "devops"],
    skillKits: ["02-seguranca-governanca/security-appsec-kit"],
    primaryLanguage: "typescript",
    framework: "security-tools",
  },
  sales: {
    model: "openrouter/anthropic/claude-3.5-sonnet",
    capabilities: ["hubspot", "linkedin", "email-sender", "notion", "github-cli"],
    allowedDomains: ["sales", "product"],
    skillKits: ["03-negocios-produto/sales-b2b-kit"],
    primaryLanguage: "markdown",
    framework: "crm",
  },
  product: {
    model: "openrouter/anthropic/claude-3.5-sonnet",
    capabilities: ["linear", "notion", "figma", "github-cli", "amplitude"],
    allowedDomains: ["product", "sales", "data"],
    skillKits: ["03-negocios-produto/product-manager-kit"],
    primaryLanguage: "markdown",
    framework: "product-ops",
  },
  research: {
    model: "openrouter/anthropic/claude-3.5-sonnet",
    capabilities: ["arxiv", "web-search", "pdf-extractor", "github-cli", "notion"],
    allowedDomains: ["research", "data"],
    skillKits: ["04-pesquisa-dados/deep-researcher-kit"],
    primaryLanguage: "markdown",
    framework: "research",
  },
  data: {
    model: "openrouter/anthropic/claude-3.5-sonnet",
    capabilities: ["python", "jupyter", "duckdb", "polars", "github-cli", "mlflow"],
    allowedDomains: ["data", "research"],
    skillKits: ["04-pesquisa-dados/data-ai-kit"],
    primaryLanguage: "python",
    framework: "pandas+polars",
  },
  "tech-lead": {
    model: "openrouter/anthropic/claude-3.5-sonnet",
    capabilities: ["github-cli", "npm-scripts", "linear", "notion", "architecture-review"],
    allowedDomains: ["backend", "frontend", "devops", "security"],
    skillKits: ["01-engenharia/tech-lead-kit"],
    primaryLanguage: "typescript",
    framework: "multi",
  },
};

/**
 * Cria a estrutura completa do quarto do robô.
 */
export async function createRobot(config: RobotConfig): Promise<string> {
  const roleDefaults = ROLE_DEFAULTS[config.role] || {};
  const now = new Date().toISOString();
  const robotId = config.id.startsWith("robot-") ? config.id : `robot-${config.role}-${randomUUID().slice(0, 8)}`;

  // Merge configs
  const finalConfig = {
    id: robotId,
    role: config.role,
    version: "1.0.0",
    name: config.name,
    description: config.description || `${config.role} specialist`,
    ...roleDefaults,
    ...config,
    capabilities: [...new Set([...(roleDefaults.capabilities || []), ...(config.capabilities || [])])],
    allowedDomains: [...new Set([...(roleDefaults.allowedDomains || []), ...(config.allowedDomains || [])])],
    skillKits: [...new Set([...(roleDefaults.skillKits || []), ...(config.skillKits || [])])],
    metadata: {
      createdBy: "severino-factory",
      createdAt: now,
      skillKits: roleDefaults.skillKits || config.skillKits || [],
      primaryLanguage: roleDefaults.primaryLanguage || config.primaryLanguage || "typescript",
      framework: roleDefaults.framework || config.framework || "none",
    },
  };

  // Cria diretório do quarto
  const roomDir = join(ROOMS_DIR, robotId);
  await fs.mkdir(roomDir, { recursive: true });
  await fs.mkdir(join(roomDir, "workspace"), { recursive: true });
  await fs.mkdir(join(roomDir, "learning", "memory"), { recursive: true });
  await fs.mkdir(join(roomDir, "learning", "skills", "generated"), { recursive: true });
  await fs.mkdir(join(roomDir, "learning", "skills", "evolved"), { recursive: true });
  await fs.mkdir(join(roomDir, "learning", "nudges"), { recursive: true });
  await fs.mkdir(join(roomDir, "learning", "evolution"), { recursive: true });

  // 1. agent.json (manifesto)
  const agentJson = {
    id: finalConfig.id,
    role: finalConfig.role,
    version: finalConfig.version,
    name: finalConfig.name,
    description: finalConfig.description,
    model: finalConfig.model,
    capabilities: finalConfig.capabilities,
    allowedDomains: finalConfig.allowedDomains,
    reportTemplate: "execution-report-v1",
    learning: { enabled: false, mode: "report-only" },
    resourceLimits: { maxDurationMs: 1800000, maxTokens: 100000, maxToolCalls: 50 },
    metadata: finalConfig.metadata,
  };
  await fs.writeFile(join(roomDir, "agent.json"), JSON.stringify(agentJson, null, 2), "utf-8");

  // 2. instructions.md (copia template)
  const instructionsTemplate = await fs.readFile(join(TEMPLATE_DIR, "instructions.md"), "utf-8");
  await fs.writeFile(join(roomDir, "instructions.md"), instructionsTemplate, "utf-8");

  // 3. learning/room-metadata.json (estado do learning loop do quarto)
  const roomMeta = {
    robotId: finalConfig.id,
    createdAt: now,
    totalTasks: 0,
    totalReportsAbsorbed: 0,
    skillCandidatesGenerated: 0,
    skillsPromoted: 0,
    lastTaskAt: null as string | null,
  };
  await fs.writeFile(join(roomDir, "learning", "room-metadata.json"), JSON.stringify(roomMeta, null, 2), "utf-8");

  // 4. learning/memory/sessions.db placeholder (SQLite será criado no primeiro uso)
  await fs.writeFile(join(roomDir, "learning", "memory", ".gitkeep"), "", "utf-8");

  // 5. learning/skills/registry.json (catálogo local de skills geradas)
  await fs.writeFile(join(roomDir, "learning", "skills", "registry.json"), JSON.stringify({}, null, 2), "utf-8");

  // 6. learning/nudges/schedule.json (cron vazio inicial)
  await fs.writeFile(join(roomDir, "learning", "nudges", "schedule.json"), JSON.stringify({}, null, 2), "utf-8");

  // 7. learning/evolution/promote-policy.json (política de promoção)
  const promotePolicy = {
    minReportsForCandidate: 1,
    minReportsForValidated: 2,
    minReportsForOfficial: 3,
    requireHumanApproval: true,
    autoPromoteAfterDays: 30,
    testRequirements: {
      lint: true,
      typecheck: true,
      unitTests: true,
      minCoverage: 80,
    },
  };
  await fs.writeFile(join(roomDir, "learning", "evolution", "promote-policy.json"), JSON.stringify(promotePolicy, null, 2), "utf-8");

  console.log(`✅ Robô criado: ${robotId}`);
  console.log(`📁 Quarto: ${roomDir}`);
  console.log(`🎭 Papel: ${finalConfig.role}`);
  console.log(`🧠 Learning: DESLIGADO (mode: report-only)`);
  console.log(`🔧 Capabilities: ${finalConfig.capabilities.join(", ")}`);
  console.log(`📦 Skill Kits: ${finalConfig.skillKits.join(", ")}`);

  return roomDir;
}

/**
 * Lista robôs existentes.
 */
export async function listRobots(): Promise<string[]> {
  try {
    const entries = await fs.readdir(ROOMS_DIR, { withFileTypes: true });
    return entries.filter(e => e.isDirectory() && e.name.startsWith("robot-")).map(e => e.name);
  } catch {
    return [];
  }
}

/**
 * Deleta um robô (cuidado!).
 */
export async function deleteRobot(robotId: string): Promise<void> {
  const roomDir = join(ROOMS_DIR, robotId);
  await fs.rm(roomDir, { recursive: true, force: true });
  console.log(`🗑️ Robô removido: ${robotId}`);
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (cmd === "create" || !cmd) {
    const idIdx = args.indexOf("--id");
    const roleIdx = args.indexOf("--role");
    const nameIdx = args.indexOf("--name");
    const fromTemplateIdx = args.indexOf("--from-template");

    let config: RobotConfig;

    if (fromTemplateIdx >= 0) {
      const templateRole = args[fromTemplateIdx + 1];
      const id = idIdx >= 0 ? args[idIdx + 1] : `robot-${templateRole}-${randomUUID().slice(0, 8)}`;
      config = { id, role: templateRole, name: `${templateRole} Bot` };
    } else {
      if (roleIdx < 0) {
        console.error("❌ Use --role <backend|frontend|qa|devops|security|sales|product|research|data|tech-lead>");
        process.exit(1);
      }
      const role = args[roleIdx + 1];
      const id = idIdx >= 0 ? args[idIdx + 1] : `robot-${role}-${randomUUID().slice(0, 8)}`;
      const name = nameIdx >= 0 ? args[nameIdx + 1] : `${role} Bot`;
      config = { id, role, name };
    }

    await createRobot(config);
  } else if (cmd === "list") {
    const robots = await listRobots();
    if (robots.length === 0) {
      console.log("Nenhum robô encontrado.");
    } else {
      console.log("🤖 Robôs existentes:");
      for (const r of robots) console.log(`  - ${r}`);
    }
  } else if (cmd === "delete") {
    const idIdx = args.indexOf("--id");
    if (idIdx < 0) {
      console.error("❌ Use --id <robot-id>");
      process.exit(1);
    }
    await deleteRobot(args[idIdx + 1]);
  } else {
    console.log(`
🏭 Severino Agent Factory

Comandos:
  create --role <role> [--id <id>] [--name <name>]
  create --from-template <role> [--id <id>]
  list
  delete --id <robot-id>

Roles disponíveis: ${Object.keys(ROLE_DEFAULTS).join(", ")}

Exemplos:
  npx tsx create-robot.ts --role backend --id robot-backend-003 --name "Stripe Webhooks Specialist"
  npx tsx create-robot.ts --from-template frontend --id robot-frontend-002
`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}