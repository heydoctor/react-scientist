import React from 'react';
import { render, cleanup } from 'react-testing-library';
import Cookie from 'js-cookie';
import Feature from './Feature';

const children = (isEnabled: boolean, variables: VariableValuesObject) =>
  isEnabled && <span>{JSON.stringify(variables)}</span>;

describe('<Feature />', () => {
  beforeAll(() => {
    Feature.onStart = jest.fn();
  });

  afterEach(() => {
    Feature.onStart.mockReset();
  });

  test('storeKey is set to guest if no userId is provided', () => {
    const name = 'Test';
    const { container } = render(
      <Feature name={name} enabledPercent={100}>
        {children}
      </Feature>
    );
    expect(Cookie.get(`scientist.feature.guest.${name}`)).toBeDefined();
  });

  test('storeKey uses userId if provided', () => {
    const name = 'Test';
    const userId = 3;
    const { container } = render(
      <Feature name={name} enabledPercent={100} userId={userId}>
        {children}
      </Feature>
    );
    expect(Cookie.get(`scientist.feature.${userId}.${name}`)).toBeDefined();
  });

  test('calls Feature.onStart only once', () => {
    const name = 'onStart';
    const { rerender } = render(
      <Feature name={name} enabledPercent={100}>
        {children}
      </Feature>
    );
    expect(Feature.onStart).toHaveBeenCalledTimes(1);
    rerender(
      <Feature name={name} enabledPercent={100}>
        {children}
      </Feature>
    );
    expect(Feature.onStart).toHaveBeenCalledTimes(1);
  });

  test('renders variables by enabledPercent', () => {
    const name = 'Render';
    const variables = { key: 'testVariables' };
    const { container } = render(
      <Feature name={name} enabledPercent={100} variables={variables}>
        {children}
      </Feature>
    );

    expect(JSON.stringify(variables)).toContain(container.textContent);
  });

  test('renders variables by enabled props', () => {
    const name = 'Render';
    const variables = { key: 'testVariables' };
    const { container } = render(
      <Feature name={name} isEnabled={true} variables={variables}>
        {children}
      </Feature>
    );

    expect(JSON.stringify(variables)).toContain(container.textContent);
  });

  test('renders null if not enabled', () => {
    const name = 'Null';
    const variables = { key: 'testVariables' };
    const { container } = render(
      <Feature name={name} enabledPercent={0} variables={variables}>
        {children}
      </Feature>
    );

    expect(container.textContent).toContain('');
  });
});
