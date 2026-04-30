import fs from 'fs';

const file = 'src/components/TextComponents.tsx';
let content = fs.readFileSync(file, 'utf8');

const regexDef = "const SEMANTIC_KEYWORD_REGEX = /(\\bBlood\\b|\\bSeptims\\b|\\bGold\\b|\\bPain\\b|\\bDeath\\b|\\bWillpower\\b|\\bLust\\b|\\bCorruption\\b|\\bParasite\\b|\\bDream\\b)/gi;";

content = content.replace(
  /export const SemanticText = \(\{ text, className \}: \{ text: string, className\?: string \}\) => \{\n  \/\/ Regex auto-colors keywords\n  const parts = text\.split\(\/\(\\bBlood\\b\|\\bSeptims\\b\|\\bGold\\b\|\\bPain\\b\|\\bDeath\\b\|\\bWillpower\\b\|\\bLust\\b\|\\bCorruption\\b\|\\bParasite\\b\|\\bDream\\b\)\/gi\);\n  return \(\n    <span className=\{className\}>\n      \{parts\.map\(\(part, i\) => \{\n        if \(part\.match\(\/\(\\bBlood\\b\|\\bSeptims\\b\|\\bGold\\b\|\\bPain\\b\|\\bDeath\\b\|\\bWillpower\\b\|\\bLust\\b\|\\bCorruption\\b\|\\bParasite\\b\|\\bDream\\b\)\/gi\)\) \{\n          return <span key=\{i\} className="text-rose-400 font-bold">\{part\}<\/span>;\n        \}\n        return part;\n      \}\)\}\n    <\/span>\n  \);\n\};/,
  `export const SemanticText = ({ text, className }: { text: string, className?: string }) => {\n  // Regex auto-colors keywords\n  const parts = text.split(SEMANTIC_KEYWORD_REGEX);\n  return (\n    <span className={className}>\n      {parts.map((part, i) => {\n        if (part.match(SEMANTIC_KEYWORD_REGEX)) {\n          return <span key={i} className="text-rose-400 font-bold">{part}</span>;\n        }\n        return part;\n      })}\n    </span>\n  );\n};`
);

if (!content.includes('SEMANTIC_KEYWORD_REGEX')) {
    console.error("Replacement failed!");
} else {
    // Inject the constant above the component
    content = content.replace('export const SemanticText', `${regexDef}\n\nexport const SemanticText`);
}

fs.writeFileSync(file, content, 'utf8');
