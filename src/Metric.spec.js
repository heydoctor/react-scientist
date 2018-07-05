import React from 'react';
import {
	render,
	fireEvent,
	cleanup,
	waitForElement,
} from 'react-testing-library';
import Metric from './Metric';

const Subject = props => (
	<Metric {...props}>
		<span>Test</span>
	</Metric>
);

afterEach(cleanup);

test('Metric.onEvent throws', () => {
	expect(() => Metric.onEvent()).toThrowErrorMatchingSnapshot();
});

describe('<Metric />', () => {
	beforeEach(() => {
		Metric.onEvent = jest.fn();
	});

	afterEach(() => {
		Metric.onEvent.mockRestore();
	});

	test('event defaults to `click`', () => {
		const name = 'Test';
		const { getByText, getByTestId, container } = render(
			<Subject name={name} />
		);

		fireEvent.click(getByTestId('rs-metric'));

		expect(Metric.onEvent).toBeCalled();
		expect(Metric.onEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				name,
			})
		);
	});

	test('specify event type with `on` prop', () => {
		const name = 'Test';
		const { getByTestId } = render(<Subject name={name} on="mouseover" />);

		fireEvent.mouseOver(getByTestId('rs-metric'));

		expect(Metric.onEvent).toBeCalled();
		expect(Metric.onEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				name,
			})
		);
	});

	test('sends along data', () => {
		const name = 'Test';
		const data = {
			hello: 'world',
		};
		const { getByTestId } = render(<Subject name={name} data={data} />);

		fireEvent.click(getByTestId('rs-metric'));

		expect(Metric.onEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				name,
				data,
			})
		);
	});

	test('renders children', () => {
		const { getByText } = render(<Subject name="Test" />);
		const child = getByText('Test');

		expect(child.tagName).toEqual('SPAN');
		expect(child.textContent).toEqual('Test');
	});
});
