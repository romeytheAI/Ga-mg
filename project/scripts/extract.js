import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8');
const match = content.match(/const compressionWorkerCode = `([\s\S]*?)`;/);
if (match) {
  let code = match[1];
  // We need to simulate how JS evaluates the template literal.
  // We can just evaluate it!
  // But we need to escape backticks and ${} to evaluate it as a template literal?
  // No, we can just use eval.
  const evaluated = eval('`' + code + '`');
  fs.writeFileSync('extracted_worker.js', evaluated);
  console.log("Extracted!");
} else {
  console.log("Not found");
}
