import type { ColorTokens } from '../src/lib/theme/tokens';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { fileURLToPath } from 'node:url';
import { radius, spacing } from '../src/lib/theme/spacing';
import { darkTokens, lightTokens } from '../src/lib/theme/tokens';
import { fontFamily, typeScale } from '../src/lib/theme/typography';

function colorVars(tokens: ColorTokens, indent = '  '): string {
  const entries: [string, string][] = [
    ['--color-bg', tokens.bg],
    ['--color-surface', tokens.surface],
    ['--color-surface-alt', tokens.surfaceAlt],
    ['--color-ink', tokens.ink],
    ['--color-ink-soft', tokens.inkSoft],
    ['--color-muted', tokens.muted],
    ['--color-faint', tokens.faint],
    ['--color-hairline', tokens.hairline],
    ['--color-stage-0', tokens.stages[0]],
    ['--color-stage-1', tokens.stages[1]],
    ['--color-stage-2', tokens.stages[2]],
    ['--color-stage-3', tokens.stages[3]],
    ['--color-stage-4', tokens.stages[4]],
    ['--color-future', tokens.future],
    ['--color-ring', tokens.ring],
    ['--color-accent', tokens.accent],
  ];
  return entries.map(([k, v]) => `${indent}${k}: ${v};`).join('\n');
}

function staticVars(indent = '  '): string {
  const entries: [string, string][] = [
    ['--font-display', `'${fontFamily.displayLight}', 'Cormorant Garamond', Georgia, serif`],
    ['--font-display-medium', `'${fontFamily.displayMedium}', 'Cormorant Garamond', Georgia, serif`],
    ['--font-ui', `'${fontFamily.ui}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`],
    ['--font-ui-medium', `'${fontFamily.uiMedium}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`],
    ['--font-mono', `'${fontFamily.mono}', 'Geist Mono', ui-monospace, monospace`],
    ...Object.entries(typeScale).map(([k, v]) => [`--text-${toKebab(k)}`, `${v.fontSize}px`] as [string, string]),
    ...Object.entries(spacing).map(([k, v]) => [`--spacing-${k}`, `${v}px`] as [string, string]),
    ...Object.entries(radius).map(([k, v]) => [`--radius-${k}`, k === 'pill' ? '999px' : `${v}px`] as [string, string]),
  ];
  return entries.map(([k, v]) => `${indent}${k}: ${v};`).join('\n');
}

const UPPER_CASE = /([A-Z])/g;
function toKebab(camel: string): string {
  return camel.replace(UPPER_CASE, '-$1').toLowerCase();
}

const css = `/* AUTO-GENERATED — do not edit. Run \`pnpm theme:gen\` to regenerate. */
@import 'tailwindcss/theme.css';
@import 'uniwind';

/* ─── Static (fonts, scale, spacing) ─────────────────────── */
:root {
${staticVars()}
}

/* ─── Light mode (default) ──────────────────────────────── */
:root {
${colorVars(lightTokens)}
}

/* ─── Dark mode ──────────────────────────────────────────── */
@media (prefers-color-scheme: dark) {
  :root {
${colorVars(darkTokens, '    ')}
  }
}

/* ─── Forced themes ──────────────────────────────────────── */
.dark {
${colorVars(darkTokens)}
}

.light {
${colorVars(lightTokens)}
}
`;

const root = dirname(fileURLToPath(import.meta.url));
const outPath = join(root, '../src/global.css');
writeFileSync(outPath, css, 'utf-8');
console.log('✓ src/global.css generated');
