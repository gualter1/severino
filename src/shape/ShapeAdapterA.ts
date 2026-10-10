/**
 * ShapeAdapterA — translates CLI hooks (shell-hook shape) into core input.
 * Used by: Claude Code (hooks via stdin JSON).
 */

import type { AdapterA, ShapeAContext, ShapeAResult } from './types';
import type { SkillInput, SkillOutput } from '../core/SkillCore';

export class ShapeAdapterA<In = unknown, Out = unknown>
  implements AdapterA<SkillInput<In>, SkillOutput<Out>>
{
  readonly requiredFeatures = ['shellHook', 'toolUse'] as const;

  toCore(ctx: ShapeAContext): SkillInput<In> {
    if (!ctx.event) {
      throw new Error('ShapeA: event is required');
    }
    let payload: In;
    try {
      payload =
        typeof ctx.payload === 'string'
          ? (JSON.parse(ctx.payload) as In)
          : (ctx.payload as In);
    } catch {
      throw new Error('ShapeA: payload is not valid JSON');
    }
    return { payload, correlationId: `${ctx.event}:${ctx.cwd}` };
  }

  fromCore(out: SkillOutput<Out>): ShapeAResult {
    if (!out.ok) {
      return {
        exitCode: 1,
        stdout: JSON.stringify({ ok: false, error: out.error }),
      };
    }
    return {
      exitCode: 0,
      stdout: JSON.stringify({ ok: true, data: out.data }),
      data: out.data,
    };
  }
}