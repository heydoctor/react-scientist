import { Component } from 'react';
import PropTypes from 'prop-types';
import crc32 from 'fbjs/lib/crc32';
import storage from './storage';

const throwError = message => {
  throw new Error(`<Experiment />: ${message}`);
};

export const selectVariantIndex = (variants, staticId) => {
  // Sorted array of the variant names, example: ["A", "B", "C"]
  const weightSum = variants.reduce((a, b) => {
    if (b.weight > 1) {
      throwError('Weights should be < 1 and in decimal form. The sum of the variant weights should most commonly add up to 1, e.g. 0.5 & 0.5')
    }
    return a + b.weight * 100
  }, 0);

  // Create an array filled with variant names proportionate to their weight
  // Given variants: [{ name: 'One', weight: 0.2 }, { name: 'Two', weight: 0.8 }]
  // Distribtuion array would consist of 20 "One" elements and 80 "Two" elements
  const weightedDistribution = variants.reduce(
    (arr, { weight }, idx) => [...arr, ...Array(weight * 100).fill(idx)],
    []
  );

  // Random number between 0 and 100. If userId is provided, calculate fixed number within
  // bounds to maintain consistent experience across repeat visits
  const weightedIndex = staticId ? Math.abs(crc32(`${staticId}`) % weightSum) : Math.floor(Math.random() * weightSum);
  const variantIndex = weightedDistribution[weightedIndex];

  return variantIndex;
};

class Experiment extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string,
    userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        weight: PropTypes.number.isRequired,
        render: PropTypes.func.isRequired,
      })
    ),
  };

  static onStart = () => {};

  storeKey = `scientist.${this.props.userId ? this.props.userId : 'guest'}.${this.props.name}`;

  getVariant = () => {
    const { name, variants, id, userId } = this.props;
    const storedVariantIndex = storage.getItem(this.storeKey);
    if (storedVariantIndex) return variants[storedVariantIndex];

    const variantIndex = selectVariantIndex(variants, userId);
    const selectedVariant = variants[variantIndex];
    if (!selectedVariant) throwError(`Could not find variant at index ${variantIndex}`);
    storage.setItem(this.storeKey, variantIndex);

    this.constructor.onStart({
      experimentName: name,
      experimentId: id,
      variantIndex,
      variantName: selectedVariant.name,
    });

    return selectedVariant;
  };

  render() {
    return this.getVariant().render();
  }
}

export default Experiment;
