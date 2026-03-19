import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8');
const match = content.match(/const compressionWorkerCode = `([\s\S]*?)`;\n\nlet compressionWorker/);
if (match) {
  let code = match[1];
  const evaluated = eval('`' + code + '`');
  fs.writeFileSync('extracted_worker.js', evaluated);
  console.log("Extracted!");
} else {
  console.log("Not found");
}
