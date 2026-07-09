import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    'coverage/**',
    '.worktrees/**',
    // CommonJS Node CLI scripts (E2E/audit tooling), not app source.
    // Never linted before they lived at yumkitchen-web/scripts/ either.
    'scripts/a11y_audit.js',
    'scripts/link_audit.js',
    'scripts/smoke_ui.js',
    'scripts/validate_content.js',
  ]),
]);

export default eslintConfig;
