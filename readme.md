# 👩‍🔬 React Scientist [![Build Status](https://travis-ci.org/sappira-inc/react-scientist.svg?branch=master)](https://travis-ci.org/sappira-inc/react-scientist) [![codecov](https://codecov.io/gh/sappira-inc/react-scientist/branch/master/graph/badge.svg)](https://codecov.io/gh/sappira-inc/react-scientist)


> Simple React components for split testing and analytics

## Installation

```
$ npm install react-scientist
$ yarn add react-scientist
```

## Components

### `Experiment`

#### Props

|  name | type  |   required | default   | description   |
|---|---|---|---|---|
|  `name` | string  | ✅   | | The name of the experiment |
|  `id` | string  |   | "" | An external experiment ID, e.g. from Google Optimize |
| `userId`  |  string |   | "" |  static user ID to ensure users have consistent, repeat experiences when running experiments |
| `variants` | array |  ✅ |  | List of possible variants for the experiment to choose from. |

#### Usage

```jsx
import React from 'react';
import { render } from 'react-dom';
import { Experiment } from 'react-scientist';

// Override the static `onStart` method to listen when users are enrolled in an experiment. NOTE: Overriding the `onStart` method should happen **before** the React app is rendered to the DOM.

Experiment.onStart = ({ experimentName, experimentId, variantIndex, variantName }) => {
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
method should happen **before** the React app is rendered to the DOM.
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

## License

MIT © [Sappira Inc.](https://sappira.com)
