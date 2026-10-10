#!/usr/bin/env node
/**
 * DX Telemetry Collector (ADR-028)
 * Collects anonymous, opt-in metrics about feature-skeleton usage.
 * 
 * Usage:
 *   node dx-telemetry.js init           # Called in postinstall
 *   node dx-telemetry.js ci --lint-fixes=5 --typecheck-errors=0 --coverage-lines=85 --coverage-branches=72
 *   node dx-telemetry.js report         # Generate local report
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { randomUUID } from 'crypto';

const TELEMETRY_DIR = resolve(process.cwd(), '.dx-telemetry');
const TELEMETRY_FILE = resolve(TELEMETRY_DIR, 'metrics.jsonl');
const CONFIG_FILE = resolve(process.cwd(), '.dx-telemetry-config.json');

interface TelemetryConfig {
  enabled: boolean;
  projectHash: string;
  firstInit: string;
}

interface InitMetric {
  type: 'init';
  timestamp: string;
  projectHash: string;
  durationMs: number;
  nodeVersion: string;
  npmVersion: string;
}

interface CiMetric {
  type: 'ci';
  timestamp: string;
  projectHash: string;
  prNumber?: number;
  lintFixes: number;
  typecheckErrors: number;
  coverageLines: number;
  coverageBranches: number;
  validationPassed: boolean;
}

interface FirstTestMetric {
  type: 'first_test';
  timestamp: string;
  projectHash: string;
  durationMs: number;
  passed: boolean;
}

type Metric = InitMetric | CiMetric | FirstTestMetric;

function hashProject(cwd: string): string {
  // Hash project path to 8-char prefix for anonymity
  let hash = 0;
  for (let i = 0; i < cwd.length; i++) {
    hash = ((hash << 5) - hash) + cwd.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

function loadConfig(): TelemetryConfig {
  if (existsSync(CONFIG_FILE)) {
    return JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
  }
  const config: TelemetryConfig = {
    enabled: process.env.DX_TELEMETRY_ENABLED === 'true',
    projectHash: hashProject(process.cwd()),
    firstInit: new Date().toISOString(),
  };
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  return config;
}

function ensureDir(): void {
  if (!existsSync(TELEMETRY_DIR)) {
    mkdirSync(TELEMETRY_DIR, { recursive: true });
  }
}

function appendMetric(metric: Metric): void {
  ensureDir();
  writeFileSync(TELEMETRY_FILE, JSON.stringify(metric) + '\n', { flag: 'a' });
}

function cmdInit(): void {
  const config = loadConfig();
  if (!config.enabled) {
    console.log('[DX Telemetry] Disabled (set DX_TELEMETRY_ENABLED=true to enable)');
    return;
  }

  const start = Date.now();
  // Simulate init work
  setTimeout(() => {
    const metric: InitMetric = {
      type: 'init',
      timestamp: new Date().toISOString(),
      projectHash: config.projectHash,
      durationMs: Date.now() - start,
      nodeVersion: process.version,
      npmVersion: 'unknown', // Could parse from `npm -v`
    };
    appendMetric(metric);
    console.log(`[DX Telemetry] Init recorded for project ${config.projectHash}`);
  }, 10);
}

function cmdCi(args: string[]): void {
  const config = loadConfig();
  if (!config.enabled) {
    console.log('[DX Telemetry] Disabled');
    return;
  }

  const parsed: Record<string, string> = {};
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      parsed[key] = value;
    }
  }

  const metric: CiMetric = {
    type: 'ci',
    timestamp: new Date().toISOString(),
    projectHash: config.projectHash,
    prNumber: parsed.pr ? parseInt(parsed.pr, 10) : undefined,
    lintFixes: parseInt(parsed['lint-fixes'] || '0', 10),
    typecheckErrors: parseInt(parsed['typecheck-errors'] || '0', 10),
    coverageLines: parseInt(parsed['coverage-lines'] || '0', 10),
    coverageBranches: parseInt(parsed['coverage-branches'] || '0', 10),
    validationPassed: parsed['validation-passed'] === 'true',
  };
  appendMetric(metric);
  console.log(`[DX Telemetry] CI metrics recorded for project ${config.projectHash}`);
}

function cmdFirstTest(args: string[]): void {
  const config = loadConfig();
  if (!config.enabled) {
    console.log('[DX Telemetry] Disabled');
    return;
  }

  const parsed: Record<string, string> = {};
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      parsed[key] = value;
    }
  }

  const metric: FirstTestMetric = {
    type: 'first_test',
    timestamp: new Date().toISOString(),
    projectHash: config.projectHash,
    durationMs: parseInt(parsed.duration || '0', 10),
    passed: parsed.passed === 'true',
  };
  appendMetric(metric);
  console.log(`[DX Telemetry] First test recorded for project ${config.projectHash}`);
}

function cmdReport(): void {
  if (!existsSync(TELEMETRY_FILE)) {
    console.log('[DX Telemetry] No metrics collected yet');
    return;
  }

  const lines = readFileSync(TELEMETRY_FILE, 'utf-8').trim().split('\n').filter(Boolean);
  const metrics = lines.map(l => JSON.parse(l));

  const inits = metrics.filter(m => m.type === 'init');
  const ciRuns = metrics.filter(m => m.type === 'ci');
  const firstTests = metrics.filter(m => m.type === 'first_test');

  console.log('\n=== DX Telemetry Report ===');
  console.log(`Project: ${loadConfig().projectHash}`);
  console.log(`Enabled: ${loadConfig().enabled}`);
  console.log(`Total events: ${metrics.length}`);
  console.log(`\nInit events: ${inits.length}`);
  if (inits.length > 0) {
    const avgInit = inits.reduce((a, b) => a + b.durationMs, 0) / inits.length;
    console.log(`  Avg init duration: ${avgInit.toFixed(0)}ms`);
  }

  console.log(`\nCI runs: ${ciRuns.length}`);
  if (ciRuns.length > 0) {
    const avgLintFixes = ciRuns.reduce((a, b) => a + b.lintFixes, 0) / ciRuns.length;
    const avgTypecheckErrors = ciRuns.reduce((a, b) => a + b.typecheckErrors, 0) / ciRuns.length;
    const avgCoverageLines = ciRuns.reduce((a, b) => a + b.coverageLines, 0) / ciRuns.length;
    const avgCoverageBranches = ciRuns.reduce((a, b) => a + b.coverageBranches, 0) / ciRuns.length;
    const validationPassRate = ciRuns.filter(b => b.validationPassed).length / ciRuns.length * 100;
    console.log(`  Avg lint fixes: ${avgLintFixes.toFixed(1)}`);
    console.log(`  Avg typecheck errors: ${avgTypecheckErrors.toFixed(1)}`);
    console.log(`  Avg coverage (lines): ${avgCoverageLines.toFixed(1)}%`);
    console.log(`  Avg coverage (branches): ${avgCoverageBranches.toFixed(1)}%`);
    console.log(`  Validation pass rate: ${validationPassRate.toFixed(1)}%`);
  }

  console.log(`\nFirst test events: ${firstTests.length}`);
  if (firstTests.length > 0) {
    const avgDuration = firstTests.reduce((a, b) => a + b.durationMs, 0) / firstTests.length;
    const passRate = firstTests.filter(b => b.passed).length / firstTests.length * 100;
    console.log(`  Avg duration: ${avgDuration.toFixed(0)}ms`);
    console.log(`  Pass rate: ${passRate.toFixed(1)}%`);
  }
}

function main(): void {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'init':
      cmdInit();
      break;
    case 'ci':
      cmdCi(args.slice(1));
      break;
    case 'first-test':
      cmdFirstTest(args.slice(1));
      break;
    case 'report':
      cmdReport();
      break;
    default:
      console.error('Usage: dx-telemetry.js <init|ci|first-test|report> [args]');
      process.exit(1);
  }
}

main();