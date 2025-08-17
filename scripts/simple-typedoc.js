#!/usr/bin/env node

/**
 * Simple TypeScript documentation generator
 * Alternative to TypeDoc for older Node.js versions
 */

const fs = require('fs');
const path = require('path');

// Configuration
const sourceDir = 'src/typescript';
const outputDir = 'docs/api/typescript';

/**
 * Extract documentation comments from TypeScript files
 */
function extractDocumentation(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const docs = [];
  let currentDoc = null;
  let inComment = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Start of JSDoc comment
    if (trimmed.startsWith('/**')) {
      inComment = true;
      currentDoc = {
        comment: [],
        line: i + 1,
        code: ''
      };
      currentDoc.comment.push(trimmed.replace('/**', '').trim());
      continue;
    }

    // End of JSDoc comment
    if (trimmed.endsWith('*/')) {
      inComment = false;
      if (currentDoc) {
        currentDoc.comment.push(trimmed.replace('*/', '').trim());
        // Get the next few lines as code
        let codeLines = [];
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          const codeLine = lines[j].trim();
          if (codeLine && !codeLine.startsWith('//')) {
            codeLines.push(lines[j]);
            if (codeLine.includes('{') || codeLine.includes(';')) {
              break;
            }
          }
        }
        currentDoc.code = codeLines.join('\n');
        docs.push(currentDoc);
        currentDoc = null;
      }
      continue;
    }

    // Inside comment
    if (inComment && currentDoc) {
      currentDoc.comment.push(trimmed.replace(/^\*\s?/, ''));
    }
  }

  return docs;
}

/**
 * Generate HTML documentation
 */
function generateHTML(docs, fileName) {
  const title = `${fileName} API Documentation`;
  
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
        }
        .header {
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #0969da;
            margin: 0;
        }
        .doc-item {
            background: #f8f9fa;
            border-left: 4px solid #0969da;
            margin: 20px 0;
            padding: 20px;
            border-radius: 0 4px 4px 0;
        }
        .comment {
            background: white;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 15px;
            border: 1px solid #e1e4e8;
        }
        .code {
            background: #f6f8fa;
            border: 1px solid #e1e4e8;
            border-radius: 4px;
            padding: 15px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 14px;
            overflow-x: auto;
        }
        .nav {
            background: #f6f8fa;
            padding: 10px 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .nav a {
            color: #0969da;
            text-decoration: none;
            margin-right: 15px;
        }
        .nav a:hover {
            text-decoration: underline;
        }
        .toc {
            background: #f8f9fa;
            border: 1px solid #e1e4e8;
            border-radius: 4px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .toc h3 {
            margin-top: 0;
            color: #0969da;
        }
        .toc ul {
            list-style: none;
            padding-left: 0;
        }
        .toc li {
            margin: 8px 0;
        }
        .toc a {
            color: #0969da;
            text-decoration: none;
        }
        .toc a:hover {
            text-decoration: underline;
        }
        .example {
            background: #e8f4f8;
            border: 1px solid #b8e6f0;
            border-radius: 4px;
            padding: 15px;
            margin: 10px 0;
        }
        .example-title {
            font-weight: bold;
            color: #0969da;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <p>Auto-generated TypeScript API documentation</p>
    </div>
    
    <div class="nav">
        <a href="../../../index.html">← Back to Main Documentation</a>
        <a href="index.html">API Home</a>
    </div>
`;

  if (docs.length > 0) {
    // Generate table of contents
    html += `
    <div class="toc">
        <h3>Table of Contents</h3>
        <ul>`;
    
    docs.forEach((doc, index) => {
      const firstLine = doc.code.split('\n')[0] || `Item ${index + 1}`;
      const anchor = `item-${index}`;
      html += `<li><a href="#${anchor}">${firstLine.substring(0, 60)}...</a></li>`;
    });
    
    html += `
        </ul>
    </div>`;

    // Generate documentation items
    docs.forEach((doc, index) => {
      const anchor = `item-${index}`;
      html += `
    <div class="doc-item" id="${anchor}">
        <div class="comment">
            <h3>Documentation</h3>`;
      
      doc.comment.forEach(line => {
        if (line.trim()) {
          if (line.includes('@example')) {
            html += `<div class="example"><div class="example-title">Example:</div>`;
          } else if (line.includes('@param')) {
            html += `<p><strong>Parameter:</strong> ${line.replace('@param', '').trim()}</p>`;
          } else if (line.includes('@returns')) {
            html += `<p><strong>Returns:</strong> ${line.replace('@returns', '').trim()}</p>`;
          } else {
            html += `<p>${line}</p>`;
          }
        }
      });
      
      html += `
        </div>
        <div class="code">
            <h4>Code:</h4>
            <pre>${doc.code}</pre>
        </div>
    </div>`;
    });
  } else {
    html += `
    <div class="doc-item">
        <p>No documentation comments found in this file.</p>
        <p>Add JSDoc comments (/** ... */) to your TypeScript code to generate documentation.</p>
    </div>`;
  }

  html += `
</body>
</html>`;

  return html;
}

/**
 * Main function
 */
function main() {
  console.log('🔧 Generating TypeScript documentation...');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Find TypeScript files
  const tsFiles = [];
  
  function findTSFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findTSFiles(filePath);
      } else if (file.endsWith('.ts')) {
        tsFiles.push(filePath);
      }
    });
  }

  if (fs.existsSync(sourceDir)) {
    findTSFiles(sourceDir);
  }

  if (tsFiles.length === 0) {
    console.log('⚠️ No TypeScript files found');
    
    // Create a placeholder index.html
    const placeholderHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>TypeScript API Documentation</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .placeholder { background: #f5f5f5; padding: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>TypeScript API Documentation</h1>
    <div class="placeholder">
        <p>TypeScript API documentation will be available here once TypeScript source files are added to the <code>src/typescript/</code> directory.</p>
        <p>This is a placeholder page generated during the build process.</p>
    </div>
    <p><a href="../../../index.html">← Back to Main Documentation</a></p>
</body>
</html>`;
    
    fs.writeFileSync(path.join(outputDir, 'index.html'), placeholderHTML);
    console.log('📄 Created placeholder documentation');
    return;
  }

  // Generate documentation for each file
  let indexLinks = [];
  
  tsFiles.forEach(filePath => {
    const docs = extractDocumentation(filePath);
    const fileName = path.basename(filePath, '.ts');
    const html = generateHTML(docs, fileName);
    const outputFile = path.join(outputDir, `${fileName}.html`);
    
    fs.writeFileSync(outputFile, html);
    indexLinks.push({
      file: fileName,
      path: `${fileName}.html`,
      count: docs.length
    });
    
    console.log(`📄 Generated ${fileName}.html (${docs.length} items)`);
  });

  // Generate index.html
  let indexHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>TypeScript API Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        .header {
            text-align: center;
            border-bottom: 1px solid #eee;
            padding-bottom: 30px;
            margin-bottom: 30px;
        }
        .file-list {
            display: grid;
            gap: 20px;
        }
        .file-item {
            background: #f8f9fa;
            border: 1px solid #e1e4e8;
            border-radius: 8px;
            padding: 20px;
            text-decoration: none;
            color: inherit;
            transition: all 0.2s ease;
        }
        .file-item:hover {
            background: #e8f4f8;
            border-color: #0969da;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .file-name {
            font-size: 1.2em;
            font-weight: bold;
            color: #0969da;
            margin-bottom: 8px;
        }
        .file-info {
            color: #666;
            font-size: 0.9em;
        }
        .nav {
            text-align: center;
            margin-bottom: 30px;
        }
        .nav a {
            color: #0969da;
            text-decoration: none;
            font-weight: 500;
        }
        .nav a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>TypeScript API Documentation</h1>
        <p>Auto-generated from TypeScript source files</p>
    </div>
    
    <div class="nav">
        <a href="../../../index.html">← Back to Main Documentation</a>
    </div>
    
    <div class="file-list">`;

  indexLinks.forEach(link => {
    indexHTML += `
        <a href="${link.path}" class="file-item">
            <div class="file-name">${link.file}</div>
            <div class="file-info">${link.count} documented items</div>
        </a>`;
  });

  indexHTML += `
    </div>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, 'index.html'), indexHTML);
  
  console.log(`✅ TypeScript documentation generated successfully!`);
  console.log(`📁 Output: ${outputDir}/`);
  console.log(`📄 Files: ${tsFiles.length} processed`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, extractDocumentation, generateHTML };
