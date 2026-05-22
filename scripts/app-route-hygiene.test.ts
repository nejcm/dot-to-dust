import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const APP_DIR = join(process.cwd(), 'src', 'app');
const TEST_ROUTE_RE = /(?:^|[/\\])(?:__tests__|__mocks__)(?:[/\\]|$)|\.(?:test|spec)\.[jt]sx?$/;

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listFiles(path);
    return path;
  });
}

describe('expo router app directory hygiene', () => {
  it('does not contain test-only route candidates', () => {
    const offenders = listFiles(APP_DIR)
      .map((path) => relative(process.cwd(), path))
      .filter((path) => TEST_ROUTE_RE.test(path));

    expect(offenders).toEqual([]);
  });
});
