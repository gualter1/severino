# 🔌 connections/ — namespaces de tools externas

Convenção (estilo Eve): **cada `*.ts` aqui vira um namespace de tools**.

- `linear.ts` → tools `linear__*` (ex: `linear__create_issue`, `linear__list_issues`)
- `github.ts` → tools `github__*`
- O nome do arquivo (sem `.ts`, em snake_case) é o prefixo do namespace.

## Como declarar sem wrapper manual

NÃO escreva cliente HTTP na mão. Cada arquivo de conexão declara **só configuração**:

```ts
// agent/connections/linear.ts
export const connection = {
  kind: "mcp", // ou "openapi"
  command: "npx",
  args: ["-y", "mcp-remote", "https://mcp.linear.app/sse"],
  env: { LINEAR_API_KEY: process.env.LINEAR_API_KEY || "" },
  toolsPrefix: "linear", // gera linear__*
};
```

```ts
// agent/connections/tarefas.ts (exemplo OpenAPI)
export const connection = {
  kind: "openapi",
  spec: "https://api.exemplo.com/openapi.json",
  toolsPrefix: "tarefas", // gera tarefas__*
};
```

O loader do agente lê cada `*.ts`, abre o servidor MCP (ou a spec OpenAPI)
e registra as tools remotas com o prefixo — nenhum `fetch` manual, nenhum
wrapper por endpoint.

## Regras

1. Um arquivo = um namespace. Nada de dois serviços no mesmo arquivo.
2. Segredo sempre via ENV — nunca hardcode token no arquivo.
3. Sem telemetria: a conexão fala só com o serviço declarado, nada de phone-home.
4. Arquivo exemplo acima é **padrão documental** — não há cliente real
   implementado aqui; o loader resolve em runtime.
