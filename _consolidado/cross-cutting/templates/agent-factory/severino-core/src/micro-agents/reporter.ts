import { TaskResponse } from "../types.js";

export class ReporterAgent {
  formatTaskCompletion(response: TaskResponse): string {
    const lines = [
      `🎯 **Relatório de Execução Severino Master**`,
      `---`,
      `🆔 **Task ID**: \`${response.taskId}\``,
      `🤖 **Robot ID**: \`${response.robotId}\``,
      `🏢 **Team ID**: \`${response.teamId || "N/A"}\``,
      `⚡ **Status**: **${response.status.toUpperCase()}**`,
      `⏱️ **Duração**: ${(response.metrics.durationMs / 1000).toFixed(1)}s`,
      `🧠 **Contexto v${response.metrics.contextVersion}**`,
      ``,
      `### 📝 Resumo`,
      response.reportSummary,
      ``,
      `### 📦 Resultado`,
      "```json",
      JSON.stringify(response.result, null, 2),
      "```",
    ];
    return lines.join("\n");
  }

  formatTeamStatus(teamId: string, robots: any[]): string {
    const lines = [
      `🏢 **Status da Equipe: \`${teamId}\`**`,
      `---`,
      `🤖 **Robôs Ativos**: ${robots.length}`,
    ];

    for (const r of robots) {
      lines.push(`- \`${r.robotId}\` (${r.role}) — Status: **${r.status}**`);
    }

    return lines.join("\n");
  }
}

export const reporter = new ReporterAgent();