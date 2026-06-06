const fs = require('fs');
const path = require('path');
const madge = require('madge');

async function buildKnowledgeGraph() {
  console.log('Building repository knowledge graph...');

  const outputDir = path.join(process.cwd(), '.automation');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  try {
    const res = await madge(['App.tsx', 'components', 'pages', 'lib'], {
      tsConfig: path.join(process.cwd(), 'tsconfig.json'),
      fileExtensions: ['ts', 'tsx', 'js', 'jsx'],
      excludeRegExp: [/node_modules/],
    });

    const dependencies = res.obj();
    const knowledgeGraph = {
      nodes: [],
      edges: [],
    };

    const addedNodes = new Set();

    Object.keys(dependencies).forEach((module) => {
      if (!addedNodes.has(module)) {
        knowledgeGraph.nodes.push({
          id: module,
          label: path.basename(module),
          type: getModuleType(module),
        });
        addedNodes.add(module);
      }

      dependencies[module].forEach((dep) => {
        if (!addedNodes.has(dep)) {
          knowledgeGraph.nodes.push({
            id: dep,
            label: path.basename(dep),
            type: getModuleType(dep),
          });
          addedNodes.add(dep);
        }

        knowledgeGraph.edges.push({
          source: module,
          target: dep,
          type: 'depends_on',
        });
      });
    });

    fs.writeFileSync(
      path.join(outputDir, 'knowledge-graph.json'),
      JSON.stringify(knowledgeGraph, null, 2)
    );

    console.log('Knowledge graph built successfully.');
  } catch (error) {
    console.error('Error building knowledge graph:', error);
  }
}

function getModuleType(modulePath) {
  if (modulePath.includes('components/')) return 'component';
  if (modulePath.includes('pages/')) return 'page';
  if (modulePath.includes('lib/')) return 'utility';
  if (modulePath.includes('App.tsx')) return 'entry';
  return 'unknown';
}

buildKnowledgeGraph().catch(console.error);
