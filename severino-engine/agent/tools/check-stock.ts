/**
 * 📦 check-stock — tool de estoque (convenção Eve: o nome deriva do arquivo).
 *
 * Consulta os moradores (robôs) direto do filesystem via
 * `queryStock`/`checkStock` do core. Sem cache, sem rede, sem telemetria.
 */

import { z } from "zod";
import { queryStock, checkStock, type StockItem } from "../../src/core/stock.js";

// ---------------------------------------------------------------------------
// Helper mínimo estilo Eve (tipado simples, sem deps externas)
// ---------------------------------------------------------------------------
export interface ToolDef<S extends z.ZodTypeAny, R> {
  name: string;
  description: string;
  inputSchema: S;
  execute: (input: z.infer<S>) => Promise<R>;
}

export function defineTool<S extends z.ZodTypeAny, R>(def: ToolDef<S, R>): ToolDef<S, R> {
  return def;
}

// ---------------------------------------------------------------------------
// check-stock: role + houseId → quarto exato; parcial → filtro; vazio → tudo
// ---------------------------------------------------------------------------
const inputSchema = z.object({
  role: z.string().optional().describe("Quarto desejado (ex: backend-developer)"),
  houseId: z.string().optional().describe("Casa (ex: casa-dev, casa-negocios, casa-dados)"),
});

type CheckStockInput = z.infer<typeof inputSchema>;

export const checkStockTool = defineTool({
  name: "check-stock",
  description:
    "Consulta moradores ociosos no estoque (rooms/). Com role + houseId tenta o quarto exato, com filtro parcial lista, sem filtro retorna tudo.",
  inputSchema,
  execute: async (input: CheckStockInput): Promise<StockItem[]> => {
    if (input.role && input.houseId) {
      const found = await checkStock(input.role, input.houseId);
      return found ? [found] : [];
    }
    const all = await queryStock();
    return all.filter((s) => {
      if (input.houseId && s.houseId !== input.houseId) return false;
      if (input.role && s.role.toLowerCase() !== input.role.toLowerCase()) return false;
      return true;
    });
  },
});

export default checkStockTool;
