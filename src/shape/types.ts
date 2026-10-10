/**
 * Shape types — canonical interface shapes for the three harness families.
 * A = shell-hook (CLI invoked per event)
 * B = in-process TS (direct import, OpenCode native)
 * C = instructions-file (markdown prompt consumed by LLM)
 */

export interface ShapeAContext {
  /** Event name emitted by harness (e.g. 'on_user_message'). */
  event: string;
  /** Raw stdin JSON payload. */
  payload: unknown;
  /** Working directory the hook was invoked from. */
  cwd: string;
  /** Optional env passthrough for secrets/config. */
  env?: Record<string, string>;
}

export interface ShapeAResult {
  /** Stdout response expected by harness. */
  stdout?: string;
  /** Non-zero exitCode = failure. */
  exitCode?: number;
  /** Optional structured result for harness to consume. */
  data?: unknown;
}

export interface ShapeBContext {
  /** OpenCode native context object (opencode.Context). */
  opencodeContext: unknown;
  /** Input passed by the skill invocation. */
  input: unknown;
}

export interface ShapeBResult {
  /** Structured return value. */
  value: unknown;
  /** Optional streaming chunks if streaming supported. */
  stream?: AsyncIterable<unknown>;
}

export interface ShapeCContext {
  /** Path to the instructions markdown file. */
  instructionsPath: string;
  /** Variables available for template substitution. */
  variables: Record<string, string>;
  /** Working directory. */
  cwd: string;
}

export interface ShapeCResult {
  /** Path to the output file produced (markdown or json). */
  outputPath: string;
  /** Whether execution succeeded. */
  ok: boolean;
  /** Error message if ok=false. */
  error?: string;
}

/** Generic adapter interface — each harness implements toCore / fromCore. */
export interface ShapeAdapter<
  ShapeContext,
  ShapeResult,
  CoreInput,
  CoreOutput,
> {
  /** Translate harness context into core SkillInput. */
  toCore(ctx: ShapeContext): CoreInput;
  /** Translate core SkillOutput into harness result. */
  fromCore(out: CoreOutput): ShapeResult;
  /** Optional: capability requirements this shape needs at minimum. */
  requiredFeatures?: ReadonlyArray<string>;
}

/** Type aliases for the three shapes. */
export type AdapterA<In, Out> = ShapeAdapter<ShapeAContext, ShapeAResult, In, Out>;
export type AdapterB<In, Out> = ShapeAdapter<ShapeBContext, ShapeBResult, In, Out>;
export type AdapterC<In, Out> = ShapeAdapter<ShapeCContext, ShapeCResult, In, Out>;