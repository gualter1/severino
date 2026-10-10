# Guia de Portabilidade de Skills (ADR-025)

> Escreva uma vez. Rode em qualquer harness.

## 1. Mentalidade: Core agnóstico

Todo comportamento de negócio vive em **SkillCore** (`src/core/SkillCore.ts`). Ele:

- Recebe `SkillInput`/`SkillOutput` puros (sem refs ao harness).
- Depende só de **ports injetadas** (logger, files, shell, `CapabilityDetector`).
- **Nunca** importa `opencode`, `globalThis.__CLAUDE_CODE__`, etc.

```ts
import { SkillCore } from './src/core';
import { CapabilityDetector } from './src/capability';

const detector = new CapabilityDetector(); // lê env/harness automaticamente
const core = new SkillCore(
  { name: 'my-skill', version: '1.0.0' },
  async (input, ports) => {
    if (ports.detector.hasFeature('workspaceEdit')) {
      await ports.files?.writeFile('out.txt', JSON.stringify(input.payload));
      return { ok: true, data: 'edited' };
    }
    // fallback degradado
    return { ok: true, data: 'fallback: no edit', usedFallback: true };
  },
  { detector, files: myFilePort, shell: myShellPort }
);

core.initialize();
const result = await core.run({ payload: { hello: 'world' } });
core.shutdown();
```

### Por que `CapabilityDetector` e não `if (harness === 'opencode')`

- Harness coupling vira matriz O(harnesses × shapes × features) impossível de testar.
- Feature detection é **extensível** — novo harness só declara suas features via env.

## 2. Quando usar cada Shape

| Shape | Harness típico | Transporte | Custo | Exemplo |
|-------|----------------|------------|-------|---------|
| **A** | Claude Code | CLI hook por evento, stdin JSON | alto (fork por evento) | `opencode run --hook on_user_message` |
| **B** | OpenCode | in-process TS import direto | baixo | `import { skill } from './skills/my-skill'` |
| **C** | Genérico / LLM | instructions-file markdown | médio | prompt template → LLM consome |

Escolha **B** quando puder. Use **A** para compatibilidade com Claude Code. Use **C** para harnesses sem API.

## 3. Feature Detection patterns

```ts
import { CapabilityDetector } from './src/capability';

// O(1) e <1ms — é um Set lookup.
const det = new CapabilityDetector();

// (a) branch simples
if (det.hasFeature('workspaceEdit')) {
  await tryEdit();
} else {
  await degradedReadonly();
}

// (b) helper `when` (recomendado para fallback único)
const out = det.when(
  'sandbox',
  () => runInSandbox(),
  () => runInlineWithTimeout(),
);

// (c) alias `supports` (mesma semântica de `hasFeature`, nome orientado a capability)
if (!det.supports('network')) return cachedResult;

// (d) introspecção
console.log(det.getAvailableFeatures()); // ['fileSystem','toolUse']
console.log(det.detectRuntime()); // 'v2' | 'v1' | 'unknown'
console.log(det.getLevel()); // 'min' | 'full'

// (e) injeção para teste/CI
const detMin = new CapabilityDetector({ level: 'min' });
const detFull = new CapabilityDetector({ level: 'full' });
const detCustom = new CapabilityDetector({ features: ['toolUse','fileSystem'] });
```

### Env overrides (usados pela matriz CI)

```
SKILL_CAPS=min|full          # define nível
SKILL_FEATURES=a,b,c         # lista explícita (filtra por lista válida)
OPENCODE_RUNTIME=v1|v2       # hint de runtime para detectRuntime()
OPENCODE_CAP_* = 1|true      # por-feature flag
```

## 4. Exemplos de fallback degradado

```ts
// workspaceEdit ausente → responde em memória
if (det.hasFeature('workspaceEdit')) await ports.files!.writeFile(path, content);
else return { ok: true, data: content, usedFallback: true };

// sandbox ausente → usa timeout local
const result = det.when('sandbox',
  () => invokeInSandbox(code),
  () => invokeWithTimeout(code, 2000),
);

// shellHook ausente em Shape A → usa streaming
if (!det.supports('shellHook')) streamChunks(chunks);
```

## 5. Matriz de compatibilidade

| Feature | Claude (A) | OpenCode (B) | Generic (C) |
|---------|-----------|-------------|-------------|
| workspaceEdit | ✓ | ✓ | — |
| shellHook | ✓ | — | — |
| inProcess | — | ✓ | — |
| instructionsFile | — | — | ✓ |
| sandbox | ✓ | ✓ | — |
| network | ✓ | ✓ | — |
| fileSystem | ✓ | ✓ | ✓ (limitado) |
| toolUse | ✓ | ✓ | ✓ |
| streaming | — | ✓ | — |
| cancellation | — | ✓ | — |

## 6. ShapeAdapters

```ts
import { ShapeAdapterA, ShapeAdapterB, ShapeAdapterC } from './src/shape';

// Claude hook → core
const a = new ShapeAdapterA();
core.run(a.toCore({ event: 'on_user_message', payload: '{"q":"hi"}', cwd: '.' }));

// OpenCode in-process
const b = new ShapeAdapterB();
core.run(b.toCore({ opencodeContext: ctx, input: { q: 'hi' } }));

// Instructions file
const c = new ShapeAdapterC();
core.run(c.toCore({ instructionsPath: 'skill.md', variables: {}, cwd: '.' }));
```

## 7. Matriz CI

Workflow `.github/workflows/skill-portability.yml`:

```yaml
matrix:
  harness: [claude-code, open-code, generic]
  shape: [A, B, C]
  capabilities: [min, full]
```

> Cada célula roda `tests/portability/*.test.js` com `SKILL_HARNESS/SKILL_SHAPE/SKILL_CAPS`.

## 8. Checklist antes do PR

- [ ] Núcleo não importa harness SDK.
- [ ] Cada feature está atrás de `hasFeature`/`when` com fallback.
- [ ] Adaptadores existem para A, B e C.
- [ ] `CapabilityDetector` instancia em <1ms em node --test.
- [ ] CI verde em `harness × shape × caps`.
