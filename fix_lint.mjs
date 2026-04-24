import fs from 'fs';

const removeDuplicateAria = (filePath) => {
    let lines = fs.readFileSync(filePath, 'utf8').split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('aria-label="Close modal"')) {
            // Check if surrounding 2 lines already have an aria-label
            let hasDuplicate = false;
            if (i > 0 && lines[i-1].includes('aria-label')) hasDuplicate = true;
            if (i > 1 && lines[i-2].includes('aria-label')) hasDuplicate = true;
            if (i < lines.length - 1 && lines[i+1].includes('aria-label')) hasDuplicate = true;

            if (hasDuplicate) {
               lines[i] = lines[i].replace('aria-label="Close modal"', '');
            }
        }
    }
    fs.writeFileSync(filePath, lines.join('\n'));
}

removeDuplicateAria('src/App.tsx');
fs.readdirSync('src/components/modals').forEach(file => {
  if (file.endsWith('.tsx')) {
      removeDuplicateAria(`src/components/modals/${file}`);
  }
});
