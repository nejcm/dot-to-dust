import { execFileSync } from 'node:child_process';

function runValidation(message: string): void {
  execFileSync(
    process.execPath,
    [
      '-e',
      'const validate = require("./scripts/i18next-syntax-validation"); validate(process.argv[1]);',
      message,
    ],
    { stdio: 'pipe' },
  );
}

describe('i18next syntax validation', () => {
  it('accepts ICU plurals', () => {
    expect(() => runValidation('{count, plural, one {# week} other {# weeks}}')).not.toThrow();
  });

  it('accepts ICU selectordinal count rules', () => {
    expect(() => runValidation('{count, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}')).not.toThrow();
  });

  it('accepts count plurals inside select branches', () => {
    expect(() => runValidation('{gender, select, male {{count, plural, one {# week} other {# weeks}}} other {ok}}')).not.toThrow();
  });

  it('rejects ICU plurals without an other branch', () => {
    expect(() => runValidation('{count, plural, one {# week}}')).toThrow();
  });

  it('rejects count interpolation outside ICU plural rules', () => {
    expect(() => runValidation('{count} weeks remaining')).toThrow();
  });

  it('rejects count interpolation inside select branches', () => {
    expect(() => runValidation('{gender, select, male {{count} weeks} other {ok}}')).toThrow();
  });

  it('rejects count select rules', () => {
    expect(() => runValidation('{count, select, one {one} other {other}}')).toThrow();
  });

  it('rejects invalid nesting even when another nesting call is valid', () => {
    expect(() => runValidation('$t(bad) and $t(common:placeholder)')).toThrow();
  });
});
