const { execSync } = require('child_process');
const args = process.argv.slice(2);
console.log('Running portability verification with args:', args);

try {
  console.log('1. Typechecking...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });

  console.log('2. Running portability test suite...');
  execSync('node --test tests/portability/*.test.js', { stdio: 'inherit' });

  console.log('✅ Portability validation passed successfully!');
} catch (err) {
  console.error('❌ Validation failed:', err.message);
  process.exit(1);
}
