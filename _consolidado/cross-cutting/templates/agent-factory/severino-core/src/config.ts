import "dotenv/config";
import { resolve } from "path";

export interface SeverinoConfig {
  port: number;
  host: string;
  logLevel: string;
  nineRouterApiKey?: string;
  nineRouterBaseUrl: string;
  defaultModel: string;
  telegramBotToken?: string;
  whatsappSessionPath: string;
  roomsDir: string;
  templatesDir: string;
}

function resolveDir(value: string | undefined, fallback: string): string {
  const raw = value && value.trim() ? value.trim() : fallback;
  // Resolve relative paths against the process working directory
  // so .env values like ./rooms or ../templates work from anywhere.
  return resolve(process.cwd(), raw);
}

export function loadConfig(): SeverinoConfig {
  return {
    port: parseInt(process.env.PORT || "3000", 10),
    host: process.env.HOST || "0.0.0.0",
    logLevel: process.env.LOG_LEVEL || "info",
    nineRouterApiKey: process.env.NINEROUTER_API_KEY || undefined,
    nineRouterBaseUrl: process.env.NINEROUTER_BASE_URL || "http://localhost:20128/v1",
    defaultModel: process.env.DEFAULT_MODEL || "Tech",
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || undefined,
    whatsappSessionPath: process.env.WHATSAPP_SESSION_PATH || "./whatsapp-session",
    roomsDir: resolveDir(
      process.env.ROOMS_DIR,
      "/home/adison/Área de trabalho/severino capiroto/rooms"
    ),
    templatesDir: resolveDir(
      process.env.TEMPLATES_DIR,
      "/home/adison/Área de trabalho/severino capiroto/_consolidado/cross-cutting/templates"
    ),
  };
}