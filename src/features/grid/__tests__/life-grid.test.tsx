import type { ComponentProps } from 'react';
import { useClock } from '@shopify/react-native-skia';
import { render } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { useReducedMotion as useReanimatedReducedMotion } from 'react-native-reanimated';

import { lightTokens, toSkia } from '@/lib/theme/tokens';
import { LifeGrid } from '../components/life-grid';
import { computeGridLayout } from '../lib/grid-layout';
import { buildLifeGridState } from '../lib/life-grid-state';

interface TestNode {
  type: string;
  props: Record<string, unknown>;
  children: TestChild[] | null;
}

type TestChild = TestNode | string;
type TestTree = TestNode | TestNode[] | null;

const originalOS = Platform.OS;

function setPlatformOS(os: typeof Platform.OS) {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    value: os,
  });
}

function findNodesByType(tree: TestTree, type: string): TestNode[] {
  if (!tree) return [];
  if (Array.isArray(tree)) {
    return tree.flatMap((node) => findNodesByType(node, type));
  }

  const children = tree.children?.flatMap((child) => {
    if (typeof child === 'string') return [];
    return findNodesByType(child, type);
  }) ?? [];

  return tree.type === type ? [tree, ...children] : children;
}

function renderLifeGrid(props?: Partial<ComponentProps<typeof LifeGrid>>) {
  const state = buildLifeGridState({
    view: 'weeks',
    dob: '2000-01-01',
    today: '2000-01-08',
    width: 393,
    height: 852,
  });

  return render(
    <LifeGrid
      state={state}
      {...props}
    />,
  );
}

function strokeCircles(tree: TestTree): TestNode[] {
  return findNodesByType(tree, 'skCircle').filter(
    (node) => node.props.style === 'stroke',
  );
}

describe('life grid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setPlatformOS(originalOS);
    jest.mocked(useReanimatedReducedMotion).mockReturnValue(false);
  });

  it('draws the today ring inside the fill dot bounds so edge dots are not clipped', () => {
    const tree = renderLifeGrid().toJSON() as TestTree;
    const [ring] = strokeCircles(tree);
    const layout = computeGridLayout('weeks', 393, 852);
    const fillRadius = layout.dotSize / 2;

    expect(ring).toBeDefined();
    expect(ring.props.cx).toBe(fillRadius);
    expect(ring.props.cy).toBe(fillRadius);
    expect((ring.props.r as number) + (ring.props.strokeWidth as number) / 2)
      .toBeLessThanOrEqual(fillRadius);
  });

  it('does not draw a today ring in bonus time', () => {
    const tree = renderLifeGrid({
      state: buildLifeGridState({
        view: 'weeks',
        dob: '1940-01-01',
        today: '2020-01-01',
        width: 393,
        height: 852,
      }),
    }).toJSON() as TestTree;

    expect(strokeCircles(tree)).toHaveLength(0);
  });

  it('mounts the Skia clock only for pulsing rings', () => {
    renderLifeGrid();
    expect(useClock).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();
    renderLifeGrid({
      state: buildLifeGridState({
        view: 'years',
        dob: '2000-01-01',
        today: '2001-01-01',
        width: 393,
        height: 852,
      }),
    });
    expect(useClock).not.toHaveBeenCalled();

    jest.clearAllMocks();
    jest.mocked(useReanimatedReducedMotion).mockReturnValue(true);
    renderLifeGrid();
    expect(useClock).not.toHaveBeenCalled();
  });

  it('does not mount the Skia clock on web', () => {
    setPlatformOS('web');

    renderLifeGrid();

    expect(useClock).not.toHaveBeenCalled();
  });

  it('uses static opacity when the ring does not pulse', () => {
    const tree = renderLifeGrid({
      state: buildLifeGridState({
        view: 'years',
        dob: '2000-01-01',
        today: '2001-01-01',
        width: 393,
        height: 852,
      }),
    }).toJSON() as TestTree;
    const [ring] = strokeCircles(tree);

    expect(ring.props.color).toBe(toSkia(lightTokens).ring);
    expect(ring.props.opacity).toBe(0.8);
  });
});
