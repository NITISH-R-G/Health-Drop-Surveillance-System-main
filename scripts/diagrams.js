const madge = require('madge');
const path = require('path');
const fs = require('fs');

async function generateDiagrams() {
  console.log('Generating architecture diagrams...');

  const outputDir = path.join(process.cwd(), '.automation');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  try {
    // We analyze the main entry point and components
    const res = await madge(['App.tsx', 'components', 'pages', 'lib'], {
      tsConfig: path.join(process.cwd(), 'tsconfig.json'),
      fileExtensions: ['ts', 'tsx', 'js', 'jsx'],
      excludeRegExp: [/node_modules/],
    });

    // Generate SVG dependency graph
    await res.image(path.join(outputDir, 'dependency-graph.svg'));
    console.log('Successfully generated dependency-graph.svg');

    // Create a simplified Mermaid diagram for the README
    const deps = res.obj();
    let mermaid = '```mermaid\ngraph TD;\n';

    // We'll limit to top level to avoid huge diagrams
    const nodes = Object.keys(deps).filter((k) => k.endsWith('.tsx') || k.endsWith('.ts'));

    nodes.forEach((node) => {
      const nodeDeps = deps[node];
      if (nodeDeps && nodeDeps.length > 0) {
        nodeDeps.forEach((dep) => {
          if (dep.endsWith('.tsx') || dep.endsWith('.ts')) {
            const cleanNode = node.replace(/[^a-zA-Z0-9]/g, '_');
            const cleanDep = dep.replace(/[^a-zA-Z0-9]/g, '_');
            mermaid += `  ${cleanNode}["${path.basename(node)}"] --> ${cleanDep}["${path.basename(dep)}"];\n`;
          }
        });
      }
    });
    mermaid += '```\n';

    fs.writeFileSync(path.join(outputDir, 'architecture.mermaid'), mermaid);
    console.log('Successfully generated architecture.mermaid');
  } catch (error) {
    console.error('Error generating diagrams:', error);
  }
}

generateDiagrams().catch(console.error);
