import { execSync } from 'child_process';
import { resolve } from 'path';

const featureDir = resolve('Repositorios/nodebestpractices/src/features/error-handling-audit');

console.log('=== Building & Testing error-handling-audit ===');
execSync('npm install', { cwd: featureDir, stdio: 'inherit' });
execSync('npm run typecheck', { cwd: featureDir, stdio: 'inherit' });
execSync('npm run lint', { cwd: featureDir, stdio: 'inherit' });
execSync('npm run test -- --coverage', { cwd: featureDir, stdio: 'inherit' });

console.log('=== Validating Feature Structure ===');
execSync('node ../../../_consolidado/cross-cutting/templates/feature-skeleton/scripts/validate-feature-structure.js . --strict', { cwd: featureDir, stdio: 'inherit' });
