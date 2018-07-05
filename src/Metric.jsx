import React, { Component } from 'react';
import PropTypes from 'prop-types';

const throwError = message => {
  throw new Error(`<Metric />: ${message}`);
};

export default class Metric extends Component {
  static propTypes = {
    on: PropTypes.string,
    name: PropTypes.string.isRequired,
    data: PropTypes.shape(),
    options: PropTypes.shape(),
  };

  static defaultProps = {
    on: 'click',
  };

  static onEvent = () => {
    throwError('This method should be overwritten somewhere before React is mounted, e.g. Metric.onEvent = () => {...}');
  };

  componentDidMount() {
    this.node.addEventListener(this.props.on, this.trackEvent);
  }

  componentWillUnmount() {
    this.node.removeEventListener(this.props.on);
  }

  trackEvent = () => {
    const { name, data, options } = this.props;

    this.constructor.onEvent({ name, data, options });
  };

  render() {
    const { children, data, name, on, options, ...props } = this.props;

    return (
      <div
        {...props}
        className="react-scientist-metric"
        style={{ display: 'contents' }}
        ref={ref => {
          this.node = ref;
        }}>
        {children}
      </div>
    );
  }
}
