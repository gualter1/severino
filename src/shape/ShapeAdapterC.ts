/**
 * ShapeAdapterC — instructions-file markdown adapter.
 * Used by LLM harnesses that consume Markdown files with instructions and frontmatter.
 */

import type { AdapterC, ShapeCContext, ShapeCResult } from './types';
import type { SkillInput, SkillOutput } from '../core/SkillCore';

export class ShapeAdapterC<In = unknown, Out = unknown>
  implements AdapterC<SkillInput<In>, SkillOutput<Out>>
{
  readonly requiredFeatures = ['instructionsFile'] as const;

  toCore(ctx: ShapeCContext): SkillInput<In> {
    if (!ctx.instructionsPath) {
      throw new Error('ShapeC: instructionsPath is required');
    }
    return {
      payload: {
        path: ctx.instructionsPath,
        variables: ctx.variables,
      } as unknown as In,
      correlationId: ctx.instructionsPath,
    };
  }

  fromCore(out: SkillOutput<Out>): ShapeCResult {
    return {
      outputPath: out.ok ? 'success.json' : 'error.json',
      ok: out.ok,
      error: out.ok ? undefined : out.error?.message,
    };
  }
}