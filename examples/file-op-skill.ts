/**
 * Example 2: Intermediate File Operations Skill
 * Demonstrates: Shape Adapters A, B, C with Feature Detection for file system operations.
 */

import { CapabilityDetector } from '../src/capability';
import { SkillCore } from '../src/core';
import { ShapeAdapterA, ShapeAdapterB, ShapeAdapterC } from '../src/shape';

export interface FileOpInput {
  path: string;
  content?: string;
  mode: 'read' | 'write';
}

export function createFileOpSkill(detector: CapabilityDetector) {
  const store = new Map<string, string>();

  return new SkillCore<FileOpInput, { content?: string; written: boolean }>(
    { name: 'file-op-skill', version: '1.0.0' },
    async (input, ports) => {
      const { path, content, mode } = input.payload;

      if (mode === 'write') {
        const canEdit = ports.detector.supports('workspaceEdit');
        if (canEdit && ports.files) {
          await ports.files.writeFile(path, content ?? '');
        } else {
          store.set(path, content ?? '');
        }
        return { ok: true, data: { written: true } };
      } else {
        const canRead = ports.detector.supports('fileSystem');
        let text: string | undefined;
        if (canRead && ports.files) {
          try {
            text = await ports.files.readFile(path);
          } catch {
            text = store.get(path);
          }
        } else {
          text = store.get(path);
        }
        return { ok: true, data: { content: text, written: false } };
      }
    },
    {
      detector,
      files: {
        readFile: async (p) => store.get(p) ?? '',
        writeFile: async (p, c) => { store.set(p, c); },
      },
    }
  );
}
