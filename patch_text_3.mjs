import fs from 'fs';

const file = 'src/components/TextComponents.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /export const SemanticText = \(\{ text, className \}: \{ text: string, className\?: string \}\) => \{/,
  `export const SemanticText = React.memo(({ text, className }: { text: string, className?: string }) => {`
);

content = content.replace(
  /        return part;\n      \}\)\}\n    <\/span>\n  \);\n\};/,
  `        return part;\n      })}\n    </span>\n  );\n});`
);

fs.writeFileSync(file, content, 'utf8');

const narrativeFile = 'src/components/NarrativeLog.tsx';
let narrativeContent = fs.readFileSync(narrativeFile, 'utf8');

narrativeContent = narrativeContent.replace(
  /export const NarrativeLog = \(\{ logs, trauma, accessibilityMode \}: NarrativeLogProps\) => \{/,
  `export const NarrativeLog = React.memo(({ logs, trauma, accessibilityMode }: NarrativeLogProps) => {`
);

narrativeContent = narrativeContent.replace(
  /    <\/div>\n  \);\n\};/,
  `    </div>\n  );\n});`
);

fs.writeFileSync(narrativeFile, narrativeContent, 'utf8');
