import Experiment, { selectVariantIndex } from './Experiment';

const variants = [
  {
    name: 'Control',
    weight: 0.5,
    render: () => <div>Control</div>
  },
  {
    name: 'Test',
    weight: 0.5,
    render: () => <div>Test</div>
  }
];

describe('#selectVariantIndex', () => {
  test('returns an valid variant index', () => {
    const index = selectVariantIndex(variants);
    expect(typeof index).toEqual('number');
    expect([0, 1]).toContain(index);
  });

  test('always returns same index when passed static id', () => {
    let index;
    const staticId = 42
    for (let i; i < 500; i++) {
      const nextIndex = selectVariantIndex(variants, staticId);
      if (index !== nextIndex) {
        throw new Error('`selectVariantIndex` returned a different value when passed a static id');
      }
      if (!index) {
        index = nextIndex;
      }
    }
  });
})

