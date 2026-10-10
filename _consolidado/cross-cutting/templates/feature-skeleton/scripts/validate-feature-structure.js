#!/usr/bin/env node
/**
 * validate-feature-structure.js — V2 (ADR-026)
 * Validador de estrutura do feature-skeleton incorporando learnings do Full Pilot.
 * 
 * Uso: node scripts/validate-feature-structure.js [caminho-da-feature] [--strict] [--json]
 * Exemplo: node scripts/validate-feature-structure.js src/features/user-management --strict
 * 
 * Exit codes:
 *  0 = sucesso (estrutura completa)
 *  1 = erro (pastas/arquivos obrigatórios ausentes)
 *  2 = erro de uso
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUIRED_STRUCTURE = {
  directories: [
    'src/domain',
    'src/domain/entities',
    'src/domain/value-objects',
    'src/domain/services',
    'src/domain/events',
    'src/application',
    'src/application/commands',
    'src/application/queries',
    'src/application/handlers',
    'src/infrastructure',
    'src/infrastructure/persistence',
    'src/infrastructure/messaging',
    'src/infrastructure/external',
    'src/infrastructure/logging',
    'src/infrastructure/observability', // ADR-030
    'src/interfaces',
    'src/interfaces/http',
    'src/interfaces/grpc',
    'src/interfaces/cli',
    'contracts',
    'tests',
    'tests/unit',
    'tests/integration',
    'tests/contract',
  ],
  files: [
    'feature.template.yml',
    'CHANGELOG.md',
    'README.md',
    'src/index.ts',
    'package.json',
    'tsconfig.json',
    'docker-compose.yml',
    'Dockerfile',
    'vitest.config.ts',           // V2
    'eslint.config.js',           // V2
  ],
  contractFiles: [
    'contracts/openapi.yaml',
    'contracts/asyncapi.yaml',
    'contracts/sample.schema.json',
    'contracts/mcp-manifest.json',
  ],
  // Barrel exports (index.ts) em cada layer — ADR-026
  barrelExports: [
    'src/domain/index.ts',
    'src/application/index.ts',
    'src/infrastructure/index.ts',
    'src/interfaces/index.ts',
    'src/infrastructure/observability/index.ts',
  ],
  placeholderPatterns: [
    /\.gitkeep$/,
    /^index\.ts$/,
    /^README\.md$/,
  ],
};

function checkPathExists(fullPath: string, type: 'directory' | 'file'): boolean {
  try {
    const stat = fs.statSync(fullPath);
    if (type === 'directory') return stat.isDirectory();
    if (type === 'file') return stat.isFile();
    return true;
  } catch {
    return false;
  }
}

function isPlaceholder(fileName: string): boolean {
  return REQUIRED_STRUCTURE.placeholderPatterns.some(pattern => pattern.test(fileName));
}

function validateDirectory(dirPath: string, errors: string[], warnings: string[]): void {
  try {
    const items = fs.readdirSync(dirPath);
    if (items.length === 0) {
      warnings.push(`⚠️  Pasta vazia (deve conter .gitkeep ou index.ts): ${dirPath}`);
    } else {
      const hasPlaceholder = items.some(item => isPlaceholder(item));
      if (!hasPlaceholder) {
        warnings.push(`⚠️  Pasta sem placeholder óbvio: ${dirPath}`);
      }
    }
  } catch (err: any) {
    errors.push(`❌ Erro ao ler pasta: ${dirPath} (${err.message})`);
  }
}

function validateFile(filePath: string, errors: string[], warnings: string[]): void {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.trim().length === 0) {
      warnings.push(`⚠️  Arquivo vazio: ${filePath}`);
    }
    if (filePath.endsWith('feature.template.yml')) {
      if (!content.includes('name:') || !content.includes('version:')) {
        warnings.push(`⚠️  feature.template.yml deve conter 'name' e 'version'`);
      }
    }
    if (filePath.endsWith('package.json')) {
      try {
        const pkg = JSON.parse(content);
        if (!pkg.name || !pkg.version) {
          errors.push(`❌ package.json deve ter 'name' e 'version'`);
        }
        // V2: check for required scripts
        const requiredScripts = ['validate', 'typecheck', 'test:coverage'];
        for (const script of requiredScripts) {
          if (!pkg.scripts?.[script]) {
            warnings.push(`⚠️  package.json missing recommended script: ${script}`);
          }
        }
      } catch {
        errors.push(`❌ package.json inválido (JSON malformado)`);
      }
    }
    if (filePath.endsWith('tsconfig.json')) {
      try {
        const tsconfig = JSON.parse(content);
        // V2: check for pilot-validated settings
        const requiredOptions = {
          moduleResolution: 'Bundler',
          allowImportingTsExtensions: true,
          exactOptionalPropertyTypes: false,
          noEmit: true,
          isolatedModules: false,
        };
        for (const [key, expected] of Object.entries(requiredOptions)) {
          const actual = tsconfig.compilerOptions?.[key];
          if (actual !== expected) {
            warnings.push(`⚠️  tsconfig.json compilerOptions.${key} = ${actual} (recommended: ${expected} for V2)`);
          }
        }
      } catch {
        errors.push(`❌ tsconfig.json inválido (JSON malformado)`);
      }
    }
    if (filePath.endsWith('vitest.config.ts')) {
      if (!content.includes('include:') || !content.includes('exclude:')) {
        warnings.push(`⚠️  vitest.config.ts should define include/exclude for coverage targeting`);
      }
    }
    if (filePath.endsWith('eslint.config.js')) {
      if (!content.includes('no-console') || !content.includes('logging')) {
        warnings.push(`⚠️  eslint.config.js should have no-console override for logging`);
      }
    }
  } catch (err: any) {
    errors.push(`❌ Erro ao ler arquivo: ${filePath} (${err.message})`);
  }
}

function printBanner(jsonOutput: boolean, absolutePath: string): void {
  if (!jsonOutput) {
    console.log(`🔍 Validando feature-skeleton V2 (ADR-026) em: ${absolutePath}\n`);
  }
}

function printSummary(jsonOutput: boolean, errors: string[], warnings: string[]): void {
  if (jsonOutput) {
    console.log(JSON.stringify({
      valid: errors.length === 0,
      featurePath: absolutePath,
      errors,
      warnings,
      summary: {
        requiredDirectories: REQUIRED_STRUCTURE.directories.length,
        requiredFiles: REQUIRED_STRUCTURE.files.length,
        requiredContracts: REQUIRED_STRUCTURE.contractFiles.length,
        requiredBarrelExports: REQUIRED_STRUCTURE.barrelExports.length,
        errorsCount: errors.length,
        warningsCount: warnings.length,
      }
    }, null, 2));
  } else {
    console.log(`\n📊 Resumo V2:`);
    console.log(`   Pastas obrigatórias: ${REQUIRED_STRUCTURE.directories.length}`);
    console.log(`   Arquivos obrigatórios: ${REQUIRED_STRUCTURE.files.length}`);
    console.log(`   Contratos obrigatórios: ${REQUIRED_STRUCTURE.contractFiles.length}`);
    console.log(`   Barrel exports: ${REQUIRED_STRUCTURE.barrelExports.length}`);
    console.log(`   Erros: ${errors.length}`);
    console.log(`   Warnings: ${warnings.length}\n`);

    if (warnings.length > 0) {
      console.log(`⚠️  Warnings:`);
      warnings.forEach(w => console.log(`   ${w}`));
      console.log('');
    }

    if (errors.length > 0) {
      console.log(`❌ Erros:`);
      errors.forEach(e => console.log(`   ${e}`));
      console.log('');
      console.log(`💡 Corrija os erros acima e rode novamente.`);
    } else {
      console.log(`✅ Estrutura feature-skeleton V2 válida!`);
      if (warnings.length > 0) {
        console.log(`   (com ${warnings.length} warnings — revise se necessário)`);
      }
    }
  }
}

function main(): void {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Validador de Estrutura feature-skeleton V2 (ADR-026)

Uso:
  node scripts/validate-feature-structure.js [caminho-da-feature]

Exemplos:
  node scripts/validate-feature-structure.js src/features/user-management
  node scripts/validate-feature-structure.js .

Opções:
  --help, -h    Mostra esta ajuda
  --strict      Falha também em warnings (exit code 1)
  --json        Saída em JSON para CI parsing

Exit codes:
  0 = sucesso
  1 = erro (estrutura incompleta)
  2 = erro de uso
`);
    process.exit(0);
  }

  const strictMode = args.includes('--strict');
  const jsonOutput = args.includes('--json');
  const featurePath = args.find(arg => !arg.startsWith('--')) || '.';
  const absolutePath = path.resolve(featurePath);

  printBanner(jsonOutput, absolutePath);

  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Valida diretórios obrigatórios
  for (const dir of REQUIRED_STRUCTURE.directories) {
    const fullPath = path.join(absolutePath, dir);
    if (!checkPathExists(fullPath, 'directory')) {
      errors.push(`❌ Pasta obrigatória ausente: ${dir}`);
    } else {
      validateDirectory(fullPath, errors, warnings);
    }
  }

  // 2. Valida arquivos obrigatórios
  for (const file of REQUIRED_STRUCTURE.files) {
    const fullPath = path.join(absolutePath, file);
    if (!checkPathExists(fullPath, 'file')) {
      errors.push(`❌ Arquivo obrigatório ausente: ${file}`);
    } else {
      validateFile(fullPath, errors, warnings);
    }
  }

  // 3. Valida barrel exports (V2)
  for (const file of REQUIRED_STRUCTURE.barrelExports) {
    const fullPath = path.join(absolutePath, file);
    if (!checkPathExists(fullPath, 'file')) {
      errors.push(`❌ Barrel export obrigatório ausente: ${file}`);
    }
  }

  // 4. Valida arquivos de contrato
  for (const file of REQUIRED_STRUCTURE.contractFiles) {
    const fullPath = path.join(absolutePath, file);
    if (!checkPathExists(fullPath, 'file')) {
      errors.push(`❌ Arquivo de contrato obrigatório ausente: ${file}`);
    } else {
      validateFile(fullPath, errors, warnings);
    }
  }

  // 5. Validações extras
  const openapiPath = path.join(absolutePath, 'contracts/openapi.yaml');
  if (checkPathExists(openapiPath, 'file')) {
    const content = fs.readFileSync(openapiPath, 'utf8');
    if (!content.includes('openapi:') && !content.includes('swagger:')) {
      warnings.push(`⚠️  openapi.yaml não parece ter header OpenAPI/Swagger válido`);
    }
  }

  printSummary(jsonOutput, errors, warnings);

  const shouldFail = strictMode ? (errors.length > 0 || warnings.length > 0) : (errors.length > 0);
  process.exit(shouldFail ? 1 : 0);
}

// Helper functions
function checkPathExists(fullPath: string, type: 'directory' | 'file'): boolean {
  try {
    const stat = fs.statSync(fullPath);
    if (type === 'directory') return stat.isDirectory();
    if (type === 'file') return stat.isFile();
    return true;
  } catch {
    return false;
  }
}

main();