// eslint.config.cjs — ESLint flat config (CommonJS) for Ogma
// Run: npx eslint core/ data/ --ext .js
//
// Codebase var/const split (intentional, see docs/code-quality.md):
//   VAR-ONLY:   engine.js, ui.js, ui-board.js, ui-run.js, db.js, config.js, intro.js, data/*.js
//   CONST/LET:  ui-primitives.js, ui-renderers.js, ui-table.js, ui-modals.js, ui-landing.js

const js = require('@eslint/js');

const CDN = { React:'readonly', ReactDOM:'readonly', Dexie:'readonly', PartySocket:'readonly' };
const DATA = { CAMPAIGNS:'writable', GENERATORS:'readonly', GENERATOR_GROUPS:'readonly', HELP_CONTENT:'readonly', HELP_ENTRIES:'readonly', SKILL_LABEL:'readonly', ALL_SKILLS:'readonly', UNIVERSAL:'readonly' };
const PRIMITIVES = { h:'readonly', useState:'readonly', useCallback:'readonly', useEffect:'readonly', useRef:'readonly', Fragment:'readonly', RA_ICONS:'readonly', TIMING:'readonly', RaIcon:'readonly', ErrorBoundary:'readonly' };
const ENGINE = { pick:'readonly', pickN:'readonly', rand:'readonly', fillTemplate:'readonly', generate:'readonly', stressFromRating:'readonly', mergeUniversal:'readonly', filteredTables:'readonly', toMarkdown:'readonly', TABLE_META:'readonly', mulberry32:'readonly' };
const RUNTIME = { DB:'readonly', LS:'readonly', OGMA_CONFIG:'readonly' };
const UI = { renderResult:'readonly', renderCard:'readonly', PrepCanvas:'readonly', TpDicePanel:'readonly', TpPlayerRow:'readonly', tpCardFromResult:'readonly', BoardApp:'readonly', RunApp:'readonly', CampaignApp:'readonly', LandingApp:'readonly', Modal:'readonly', ShareDrawer:'readonly' };
const BROWSER = { window:'readonly', document:'readonly', navigator:'readonly', console:'readonly', setTimeout:'readonly', clearTimeout:'readonly', setInterval:'readonly', clearInterval:'readonly', Promise:'readonly', URL:'readonly', URLSearchParams:'readonly', location:'readonly', localStorage:'readonly', performance:'readonly', fetch:'readonly', FileReader:'readonly', Blob:'readonly', alert:'readonly', confirm:'readonly', prompt:'readonly' };

const ALL = { ...CDN, ...DATA, ...PRIMITIVES, ...ENGINE, ...RUNTIME, ...UI, ...BROWSER };

const BASE_RULES = {
  'no-undef': 'error',
  'no-redeclare': 'error',
  'no-unused-vars': ['warn', { vars: 'local', args: 'none' }],
  'eqeqeq': ['error', 'always', { null: 'ignore' }],
  'no-console': 'off',
  'max-len': 'off',
};

module.exports = [
  // Ignore vendored and built files
  { ignores: ['assets/js/partysocket.js', 'node_modules/**', '*.min.js'] },

  // var-only files (and mixed files — ui-renderers.js/ui-table.js have module-level var constants)
  {
    files: ['core/engine.js', 'core/ui.js', 'core/ui-board.js', 'core/ui-run.js', 'core/db.js', 'core/config.js', 'core/intro.js', 'core/ui-renderers.js', 'core/ui-table.js', 'data/**/*.js'],
    languageOptions: { ecmaVersion: 2019, sourceType: 'script', globals: ALL },
    rules: { ...js.configs.recommended.rules, ...BASE_RULES, 'no-var': 'off', 'prefer-const': 'off' },
  },

  // strict const/let files (no var permitted at any scope)
  {
    files: ['core/ui-primitives.js', 'core/ui-modals.js', 'core/ui-landing.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'script', globals: ALL },
    rules: { ...js.configs.recommended.rules, ...BASE_RULES, 'no-var': 'error', 'prefer-const': 'error' },
  },
];
