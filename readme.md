# 👩‍🔬 React Scientist [![npm version](https://badge.fury.io/js/react-scientist.svg)](http://badge.fury.io/js/react-scientist) [![Build Status](https://travis-ci.org/heydoctor/react-scientist.svg?branch=master)](https://travis-ci.org/heydoctor/react-scientist) [![codecov](https://codecov.io/gh/heydoctor/react-scientist/branch/master/graph/badge.svg)](https://codecov.io/gh/heydoctor/react-scientist)

> Simple React components for split testing and analytics

## Installation

```
$ npm install react-scientist
$ yarn add react-scientist
```

## Components

### `Experiment`

#### Props

| name            | type   | required | default                  | description                                                                                                 |
| --------------- | ------ | -------- | ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `name`          | string | ✅       |                          | The name of the experiment                                                                                  |
| `id`            | string |          | ""                       | An external experiment ID, e.g. from Google Optimize                                                        |
| `userId`        | string |          | ""                       | A static user ID to ensure logged-in users have consistent experiences when running experiments             |
| `domain`        | string |          | `document.location.host` | The domain that the variant cookie should be set on.                                                        |
| `variants`      | array  | ✅       |                          | List of possible variants for the experiment to choose from.                                                |
| `activeVariant` | string |          |                          | Variant name to define active variant from outside (Optimizely or Split or any other a/b testing platform). |

#### Usage

```jsx
import React from 'react';
import { render } from 'react-dom';
import { Experiment } from 'react-scientist';

// Override the static `onStart` method to listen when users are enrolled in an experiment.
// NOTE: Overriding the `onStart` method should happen **before** the React app is rendered to the DOM.

Experiment.onStart = ({
  experimentName,
  experimentId,
  variantIndex,
  variantName,
}) => {
  // Handle experiment start. Typically will send an analytic event to Segment, Google Analytics, etc.
};

const LoginTitleExperiment = () => (
  <Experiment
    name="Login Title"
    variants={[
      {
        name: 'Control',
        weight: 0.5,
        render: () => <h1>Sign In</h1>,
      },
      {
        name: 'Login',
        weight: 0.5,
        render: () => <h1>Login</h1>,
      },
    ]}
  />
);

render(<LoginTitleExperiment />);
```

## Cross Domain Experiments

`<Experiment />` uses cookies to store the active variant for your running experiments. If you'd like to run experiments on both a naked domain and a subdomain, pass the root domain as the `domain` prop. Make sure to prefix the domain with leading `.` so the cookie will be accessible across any property.

```jsx
<Experiment
  name="Cross Domain"
  domain=".example.com"
  variants={[
    {
      name: 'Control',
      weight: 0.5,
      render: () => <h1>Sign In</h1>,
    },
    {
      name: 'Login',
      weight: 0.5,
      render: () => <h1>Login</h1>,
    },
  ]}
/>
```

---

### `Metric`

#### Props

| name      | type   | required | default | description                                                            |
| --------- | ------ | -------- | ------- | ---------------------------------------------------------------------- |
| `name`    | string | ✅       |         | The name of the event, e.g. `Button Clicked`                           |
| `on`      | string |          | `click` | The event to listen to, e.g. `click`, `hover`                          |
| `data`    | object |          | {}      | Extra data to send along with the event, e.g. `{ location: 'banner' }` |
| `options` | object |          | {}      | Options to pass to Event handler                                       |

#### Usage

```jsx
import React from 'react';
import { render } from 'react-dom';
import { Metric } from 'react-scientist';

// Override the static `onEvent` method to listen when events are captured. NOTE: Overriding the `onEvent`
// method should happen **before** the React app is rendered to the DOM.
Metric.onEvent = ({ name, data, options }) => {
  // Handle event capture. Typically will send an analytic event to Segment, Google Analytics, etc.
};

const MetricExample = () => (
  <Metric name="Facebook Login Clicked">
    <Button>Login With Facebook</Button>
  </Metric>
);

render(<MetricExample />);
```

---

### `Feature`

#### Props

| name              | type     | required | default                  | description                                                                                     |
| ----------------- | -------- | -------- | ------------------------ | ----------------------------------------------------------------------------------------------- |
| `children`        | function | ✅       |                          | Function that render children component                                                         |
| `disableTracking` | boolean  |          |                          | Disable onStart reporting                                                                       |
| `domain`          | string   |          | `document.location.host` | The domain that the variant cookie should be set on.                                            |
| `enabledPercent`  | number   |          |                          | Number from 0 to 100 indicate percentage of user we want to enable this feature                 |
| `isEnabled`       | boolean  |          |                          | Force enable or disable feature from parent component                                           |
| `userId`          | string   |          |                          | A static user ID to ensure logged-in users have consistent experiences when running experiments |
| `name`            | string   | ✅       |                          | The name/id of the feature                                                                      |
| `variables`       | object   |          |                          | List of variables that will be passed to children                                               |

#### Usage

```jsx
import React from 'react';
import { render } from 'react-dom';
import { Feature } from 'react-scientist';

// Override the static `onStart` method to listen when events are captured. NOTE: Overriding the `onEvent`
// method should happen **before** the React app is rendered to the DOM.
Feature.onStart = ({ featureName, isEnabled, variables }) => {
  // Handle event capture. Typically will send an analytic event to Segment, Google Analytics, etc.
};

const FeatureExample = () => (
  <Feature name="New button" enabledPercent={50} variables={{ color: 'green' }}>
    {(isEnabled, variables) =>
      isEnabled && <Button>New {variables.color} button</Button>
    }
  </Feature>
);

render(<FeatureExample />);
```

#### Local development

Run `yarn link` in root folder of `react-scientist`. Then go to consuming package and run `yarn link "react-scientist"` -> Profit 🔥.

Don't forget to run `yarn build` after each code changes in `react-scientist`

## License

MIT © [Sappira Inc.](https://sappira.com)
