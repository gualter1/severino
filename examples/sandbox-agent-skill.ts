/**
 * Example 3: Complex Sandbox Agent Skill
 * Demonstrates: Advanced cross-harness agent with sandbox capability detection and fallback.
 */

import { CapabilityDetector } from '../src/capability';
import { SkillCore } from '../src/core';

export interface AgentInput {
  task: string;
  code: string;
}

export interface AgentOutput {
  result: string;
  sandboxUsed: boolean;
  executionTimeMs: number;
}

export function createSandboxAgentSkill(detector: CapabilityDetector) {
  return new SkillCore<AgentInput, AgentOutput>(
    { name: 'sandbox-agent-skill', version: '1.0.0' },
    async (input, ports) => {
      const start = Date.now();
      const hasSandbox = ports.detector.hasFeature('sandbox');

      let resText = '';
      if (hasSandbox) {
        // simulate secure sandbox execution
        resText = \`[SANDBOX] executed: \${input.payload.task}\`;
      } else {
        // fallback: inline execution with strict timeout
        resText = \`[INLINE-FALLBACK] executed: \${input.payload.task}\`;
      }

      return {
        ok: true,
        data: {
          result: resText,
          sandboxUsed: hasSandbox,
          executionTimeMs: Date.now() - start,
        },
      };
    },
    { detector }
  );
}
