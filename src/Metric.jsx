// @flow

import * as React from 'react';
import PropTypes from 'prop-types';

type MetricProps = {
  on: string,
  name: string,
  data?: Object,
  options?: Object,
  style: Object,
  children: React.Node,
};

type EventArgs = {
  name: string,
  data?: Object,
  options?: Object,
};

const throwError = (message: string) => {
  throw new Error(`<Metric />: ${message}`);
};

export default class Metric extends React.Component<MetricProps> {
  node: ?HTMLDivElement;

  static defaultProps = {
    on: 'click',
    style: {},
  };

  static onEvent = (args: EventArgs) => {
    throwError(
      'This method should be overwritten somewhere before React is mounted, e.g. Metric.onEvent = () => {...}'
    );
  };

  componentDidMount() {
    if (this.node) {
      this.node.addEventListener(this.props.on, this.trackEvent);
    }
  }

  componentWillUnmount() {
    if (this.node) {
      this.node.removeEventListener(this.props.on, this.trackEvent);
    }
  }

  trackEvent = () => {
    const { name, data, options } = this.props;

    this.constructor.onEvent({ name, data, options });
  };

  render() {
    const { children, data, name, on, options, style, ...props } = this.props;

    return (
      <div
        {...props}
        className="rs-metric"
        data-testid="rs-metric"
        style={{ display: 'contents', ...style }}
        ref={ref => {
          this.node = ref;
        }}
      >
        {children}
      </div>
    );
  }
}
