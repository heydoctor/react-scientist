// @flow

import React from 'react';
import crc32 from 'fbjs/lib/crc32';
import Cookie from 'js-cookie';

type Variant = {
  name: string,
  weight: number,
  render: Function,
};

type VariantList = Array<Variant>;

type ExperimentProps = {
  name: string,
  id?: string | number,
  userId?: string,
  variants: VariantList,
};

type StartArgs = {
  experimentName: string,
  experimentId?: string | number,
  variantIndex: number,
  variantName: string,
};

export const varianceHelpers = {
  /**
   * Gets the sum of all weights after conversion from percent to integer
   */
  getWeightSum(variants: VariantList): number {
    return variants.reduce((sum, v) => {
      if (v.weight > 1) {
        throwError(
          'Weights should be < 1 and in decimal form. The sum of the variant weights should most commonly add up to 1, e.g. 0.5 & 0.5'
        );
      }
      return sum + v.weight * 100;
    }, 0);
  },

  /**
   * Create an array filled with variant indexes proportionate to their weight
   * Given variants: [{ name: 'One', weight: 0.2 }, { name: 'Two', weight: 0.8 }]
   * Distribtuion array would consist of 20 "One" elements and 80 "Two" elements
   */
  getWeightedDistribution(variants: VariantList): Array<number> {
    return variants.reduce(
      (arr, { weight }, idx) => [...arr, ...Array(weight * 100).fill(idx)],
      []
    );
  },

  /**
   * Random number between 0 and 100. If userId is provided, calculate fixed number within
   * bounds to maintain consistent experience across repeat visits
   */
  getWeightedIndex(weightSum: number, staticId: number): number {
    return staticId
      ? Math.abs(crc32(`${staticId}`) % weightSum)
      : Math.floor(Math.random() * weightSum);
  },

  /**
   * Chooses a variant
   */
  selectVariantIndex(
    variants: VariantList,
    staticId: ?number | ?string
  ): number {
    const weightSum = this.getWeightSum(variants);
    const weightedDistribution = this.getWeightedDistribution(variants);
    const weightedIndex = this.getWeightedIndex(weightSum, staticId);
    const variantIndex = weightedDistribution[weightedIndex];
    return variantIndex;
  },
};

const throwError = message => {
  throw new Error(`<Experiment />: ${message}`);
};

class Experiment extends React.Component<ExperimentProps> {
  static onStart = (args: StartArgs) => {
    throwError(
      'This method should be overwritten somewhere before React is mounted, e.g. Experiment.onStart = () => {...}'
    );
  };

  storeKey = `scientist.${
    this.props.userId !== undefined ? this.props.userId : 'guest'
  }.${this.props.name}`;

  getVariant = () => {
    const { name, variants, id, userId } = this.props;

    const storedVariantIndex = Cookie.get(this.storeKey);
    if (storedVariantIndex !== undefined && storedVariantIndex !== null)
      return variants[storedVariantIndex];

    const variantIndex = varianceHelpers.selectVariantIndex(variants, userId);
    const selectedVariant = variants[variantIndex];
    Cookie.set(this.storeKey, variantIndex);

    this.constructor.onStart({
      experimentName: name,
      experimentId: id,
      variantIndex,
      variantName: selectedVariant.name,
    });

    return selectedVariant;
  };

  render() {
    const variant = this.getVariant();
    if (variant) return variant.render();

    return null;
  }
}

export default Experiment;
