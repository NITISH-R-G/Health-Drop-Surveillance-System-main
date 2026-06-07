const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function runAIAgent() {
  console.log('AI Documentation Agent analyzing repository state...');

  const outputDir = path.join(process.cwd(), '.automation');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Load context from previously generated files
  let analysis = {};
  try {
    analysis = JSON.parse(fs.readFileSync(path.join(outputDir, 'analysis.json'), 'utf8'));
  } catch (e) {
    console.warn('Could not read analysis.json');
  }

  // Determine what happened
  // In a real scenario, this agent would look at `git diff` or PR contexts.
  // We'll simulate its output.
  const isCI = process.env.CI === 'true';
  const apiKey = process.env.GEMINI_API_KEY;

  let summary = '';

  if (apiKey) {
    console.log('Using Gemini API to generate insights...');
    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const prompt = `Analyze this project tech stack: ${JSON.stringify(analysis.techStack)}. Generate a short 2 sentence architecture summary for the README.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      summary = response.text;
    } catch (err) {
      console.error('Error with Gemini API:', err.message);
      summary = generateFallbackSummary(analysis);
    }
  } else {
    console.log('No GEMINI_API_KEY found. Generating fallback architecture summary.');
    summary = generateFallbackSummary(analysis);
  }

  fs.writeFileSync(path.join(outputDir, 'ai-summary.md'), summary);
  console.log('AI Agent completed its task.');
}

function generateFallbackSummary(analysis) {
  const frameworks = analysis.techStack?.frameworks?.join(', ') || 'Unknown Frameworks';
  return `This project leverages ${frameworks} for a robust mobile application architecture. It integrates with maps and Supabase for a complete end-to-end health tracking solution.`;
}

runAIAgent().catch(console.error);
