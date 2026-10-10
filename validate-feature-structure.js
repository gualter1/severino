const fs = require('fs');
const path = require('path');

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
  ],
  contractFiles: [
    'contracts/openapi.yaml',
    'contracts/asyncapi.yaml',
    'contracts/sample.schema.json',
    'contracts/mcp-manifest.json',
  ],
  placeholderPatterns: [
    /\.gitkeep$/,
    /^index\.ts$/,
    /^README\.md$/,
  ],
};

function checkPathExists(fullPath, type) {
  try {
    const stat = fs.statSync(fullPath);
    if (type === 'directory') return stat.isDirectory();
    if (type === 'file') return stat.isFile();
    return true;
  } catch {
    return false;
  }
}

function isPlaceholder(fileName) {
  return REQUIRED_STRUCTURE.placeholderPatterns.some(pattern => pattern.test(fileName));
}

function validateDirectory(dirPath, errors, warnings) {
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
  } catch (err) {
    errors.push(`❌ Erro ao ler pasta: ${dirPath} (${err.message})`);
  }
}

function validateFile(filePath, errors, warnings) {
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
      } catch {
        errors.push(`❌ package.json inválido (JSON malformado)`);
      }
    }
    if (filePath.endsWith('tsconfig.json')) {
      try {
        JSON.parse(content);
      } catch {
        errors.push(`❌ tsconfig.json inválido (JSON malformado)`);
      }
    }
  } catch (err) {
    errors.push(`❌ Erro ao ler arquivo: ${filePath} (${err.message})`);
  }
}

function runValidation(featurePath) {
  const absolutePath = path.resolve(featurePath);
  console.log(`🔍 Validando feature-skeleton em: ${absolutePath}\n`);

  const errors = [];
  const warnings = [];

  for (const dir of REQUIRED_STRUCTURE.directories) {
    const fullPath = path.join(absolutePath, dir);
    if (!checkPathExists(fullPath, 'directory')) {
      errors.push(`❌ Pasta obrigatória ausente: ${dir}`);
    } else {
      validateDirectory(fullPath, errors, warnings);
    }
  }

  for (const file of REQUIRED_STRUCTURE.files) {
    const fullPath = path.join(absolutePath, file);
    if (!checkPathExists(fullPath, 'file')) {
      errors.push(`❌ Arquivo obrigatório ausente: ${file}`);
    } else {
      validateFile(fullPath, errors, warnings);
    }
  }

  for (const file of REQUIRED_STRUCTURE.contractFiles) {
    const fullPath = path.join(absolutePath, file);
    if (!checkPathExists(fullPath, 'file')) {
      errors.push(`❌ Arquivo de contrato obrigatório ausente: ${file}`);
    } else {
      validateFile(fullPath, errors, warnings);
    }
  }

  const openapiPath = path.join(absolutePath, 'contracts/openapi.yaml');
  if (checkPathExists(openapiPath, 'file')) {
    const content = fs.readFileSync(openapiPath, 'utf8');
    if (!content.includes('openapi:') && !content.includes('swagger:')) {
      warnings.push(`⚠️  openapi.yaml não parece ter header OpenAPI/Swagger válido`);
    }
  }

  console.log(`📊 Resumo:`);
  console.log(`   Pastas obrigatórias: ${REQUIRED_STRUCTURE.directories.length}`);
  console.log(`   Arquivos obrigatórios: ${REQUIRED_STRUCTURE.files.length}`);
  console.log(`   Contratos obrigatórios: ${REQUIRED_STRUCTURE.contractFiles.length}`);
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
    process.exit(1);
  }

  console.log(`✅ Estrutura feature-skeleton válida!`);
  if (warnings.length > 0) {
    console.log(`   (com ${warnings.length} warnings — revise se necessário)`);
  }
  process.exit(0);
}

const args = process.argv.slice(2);
const featurePath = args.find(arg => !arg.startsWith('--')) || '.';
runValidation(featurePath);