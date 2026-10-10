/**
 * ShapeAdapterB — in-process TS adapter (OpenCode native).
 * Passes through without serialization. Lowest overhead.
 */

import type { AdapterB, ShapeBContext, ShapeBResult } from './types';
import type { SkillInput, SkillOutput } from '../core/SkillCore';

export class ShapeAdapterB<In = unknown, Out = unknown>
  implements AdapterB<SkillInput<In>, SkillOutput<Out>>
{
  readonly requiredFeatures = ['inProcess', 'toolUse'] as const;

  toCore(ctx: ShapeBContext): SkillInput<In> {
    if (ctx.input === undefined) {
      throw new Error('ShapeB: input is required');
    }
    return { payload: ctx.input as In };
  }

  fromCore(out: SkillOutput<Out>): ShapeBResult {
    return { value: out.ok ? out.data : { error: out.error } };
  }
}