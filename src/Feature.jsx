// @flow

import React, { ElementType, Fragment } from 'react';
import Cookie from 'js-cookie';

type VariableValuesObject = {
  [key: string]: boolean | number | string | null,
};

type ChildrenRenderFunction = (
  isEnabled: boolean,
  variables: VariableValuesObject
) => ElementType;

type FeatureProps = {
  children: ChildrenRenderFunction,
  disableTracking?: boolean,
  domain?: string,
  enabledPercent?: number, //value from 0 to 100 indicate probability of enabling this feature to user
  isEnabled?: boolean, // control enabling feature from outside
  name: string,
  userId?: string,
  variables: VariableValuesObject,
};

type StartArgs = {
  featureName: string,
  isEnabled: boolean,
  variables: number,
};

const throwError = message => {
  throw new Error(`<Feature />: ${message}`);
};

/**
 * Feature component allows to evaluate the state of a feature flag and its variables for a given use
 * Can be controlled from outside by isEnabled flag,
 * or internally calculate probability of enabling for user and store value in cookies
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Feature = ({
  children,
  disableTracking,
  domain,
  enabledPercent,
  isEnabled,
  userId,
  name,
  variables,
}: FeatureProps) => {
  const storeKey = `scientist.feature.${
    typeof userId === 'number' || typeof userId === 'string' ? userId : 'guest'
  }.${name}`;

  const storedValue = Cookie.get(storeKey);

  //if no cookie and no props from parent we need to calculate probability of enabling feature
  let isEnabledCalculated = isEnabled;
  if (typeof storedValue === 'undefined' && typeof isEnabled === 'undefined') {
    const chance = Math.random() * 100; //range from 0 to 100
    isEnabledCalculated = enabledPercent > chance;
  }
  //if no cookie, save value and report it
  if (typeof storedValue === 'undefined') {
    Cookie.set(storeKey, isEnabled, { domain });
    if (!disableTracking) {
      Feature.onStart({
        featureName: name,
        isEnabled,
        variables,
      });
    }
  }

  return <Fragment>{children(isEnabledCalculated, variables)}</Fragment>;
};

Feature.onStart = (args: StartArgs) => {
  throwError(
    'This method should be overwritten somewhere before React is mounted, e.g. Feature.onStart = () => {...}'
  );
};

export default Feature;
