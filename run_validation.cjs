// CommonJS for Node execution
const { execSync } = require('child_process');

const projects = [
  'Repositorios/nodebestpractices/src/features/error-handling-audit',
  'Repositorios/AionUi/packages/desktop/src/renderer/features/workflow-viewer',
  'Repositorios/ECC/src/features/agent-harness-exec',
];

for (const proj of projects) {
  console.log(`\n=== Validating ${proj} ===`);
  try {
    execSync(`node validate-feature-structure.js "${proj}" --strict`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Validation failed for ${proj}`);
  }
}