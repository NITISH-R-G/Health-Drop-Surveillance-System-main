const fs = require('fs');
const path = require('path');
const glob = require('glob');

async function analyze() {
  console.log('Starting repository analysis...');

  const packageJsonPath = path.join(process.cwd(), 'package.json');
  let techStack = {};
  let dependencies = {};
  let devDependencies = {};

  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    dependencies = pkg.dependencies || {};
    devDependencies = pkg.devDependencies || {};

    techStack = {
      frameworks: [],
      libraries: [],
      tools: [],
    };

    if (dependencies['react-native']) techStack.frameworks.push('React Native');
    if (dependencies['expo']) techStack.frameworks.push('Expo');
    if (dependencies['react']) techStack.libraries.push('React');
    if (dependencies['@supabase/supabase-js']) techStack.libraries.push('Supabase');
    if (dependencies['react-native-maps'] || dependencies['react-leaflet'])
      techStack.libraries.push('Maps (Leaflet/Google)');
    if (devDependencies['typescript']) techStack.tools.push('TypeScript');
    if (devDependencies['jest']) techStack.tools.push('Jest');
    if (devDependencies['eslint']) techStack.tools.push('ESLint');
  }

  // Detect environment variables from .env.example or code
  const envVars = new Set();
  const files = await glob.glob('**/*.{js,ts,tsx,jsx}', { ignore: 'node_modules/**' });

  const envRegex = /process\.env\.([A-Z0-9_]+)/g;
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = envRegex.exec(content)) !== null) {
      envVars.add(match[1]);
    }
  }

  const analysisResult = {
    timestamp: new Date().toISOString(),
    techStack,
    dependenciesCount: Object.keys(dependencies).length,
    devDependenciesCount: Object.keys(devDependencies).length,
    environmentVariables: Array.from(envVars),
    fileCount: files.length,
  };

  const outputDir = path.join(process.cwd(), '.automation');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  fs.writeFileSync(path.join(outputDir, 'analysis.json'), JSON.stringify(analysisResult, null, 2));

  console.log('Analysis complete. Results saved to .automation/analysis.json');
}

analyze().catch(console.error);
