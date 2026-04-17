import fs from 'fs';

const file = 'src/components/TextComponents.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /export const SemanticText = \(\{ text, className \}: \{ text: string, className\?: string \}\) => \{\n  \/\/ Regex auto-colors keywords\n  const parts = text\.split\(SEMANTIC_KEYWORD_REGEX\);/,
  `export const SemanticText = ({ text, className }: { text: string, className?: string }) => {\n  // Regex auto-colors keywords\n  const parts = React.useMemo(() => text.split(SEMANTIC_KEYWORD_REGEX), [text]);`
);

fs.writeFileSync(file, content, 'utf8');
