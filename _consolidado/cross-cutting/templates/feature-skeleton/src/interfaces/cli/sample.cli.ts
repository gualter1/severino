/**
 * CLI adapter — thin wrapper over application layer.
 * Parses argv, delegates to handlers. No business logic.
 */
import { CreateSampleCommand } from '../../application/commands';
import type { CreateSampleHandler } from '../../application/handlers/create-sample.handler';

export interface CliContext {
  handler: CreateSampleHandler;
  output: (line: string) => void;
}

export async function runCreateSampleCli(argv: string[], ctx: CliContext): Promise<number> {
  const nameFlag = argv.find((a) => a.startsWith('--name='));
  const name = nameFlag?.split('=')[1]?.trim();

  if (!name) {
    ctx.output('Usage: sample create --name=<name>');
    return 1;
  }

  try {
    const id = await ctx.handler.execute(new CreateSampleCommand({ name }));
    ctx.output(`Created sample entity: ${id}`);
    return 0;
  } catch (error) {
    ctx.output(`Error: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }
}
