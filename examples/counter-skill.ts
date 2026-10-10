/**
 * Example 1: Simple Counter Skill (v1 and v2 portable)
 * Demonstrates: Core agnóstico, CapabilityDetector, degraded fallback when persist missing.
 */

import { CapabilityDetector } from '../src/capability';
import { SkillCore, type SkillInput, type SkillOutput } from '../src/core';
import { ShapeAdapterA, ShapeAdapterB, ShapeAdapterC } from '../src/shape';

export interface CounterInput {
  action: 'increment' | 'decrement' | 'get';
  amount?: number;
}

export interface CounterOutput {
  count: number;
  persisted: boolean;
}

export function createCounterSkill(detector: CapabilityDetector) {
  let memoryCount = 0;

  return new SkillCore<CounterInput, CounterOutput>(
    { name: 'counter-skill', version: '1.0.0' },
    async (input, ports) => {
      const { action, amount = 1 } = input.payload;

      if (action === 'increment') memoryCount += amount;
      if (action === 'decrement') memoryCount -= amount;

      // Try workspaceEdit if available, else fallback to memory-only
      const persisted = ports.detector.when(
        'workspaceEdit',
        () => {
          // would write to state file using ports.files
          return true;
        },
        () => false,
      );

      return {
        ok: true,
        data: { count: memoryCount, persisted },
      };
    },
    { detector }
  );
}
