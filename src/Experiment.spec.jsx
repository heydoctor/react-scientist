import React from 'react';
import { render, cleanup } from 'react-testing-library';
import Experiment, { varianceHelpers } from './Experiment';
import Storage from './storage';

const variants = [
	{
		name: 'Control',
		weight: 0.5,
		render: () => <div>Control</div>,
	},
	{
		name: 'Test',
		weight: 0.5,
		render: () => <div>Test</div>,
	},
];

const Subject = props => (
	<Experiment variants={props.variants || variants} {...props} />
);

afterEach(cleanup);

describe('varianceHelpers', () => {
	describe('#getWeightSum', () => {
		test('throws if any weight is greater than 1', () => {
			expect(() =>
				varianceHelpers.getWeightSum([{ name: 'Wrong', weight: 2 }])
			).toThrowErrorMatchingSnapshot();
		});

		test('returns a sum of all normalized weights', () => {
			const sum = varianceHelpers.getWeightSum(variants);
			expect(sum).toEqual(100);
		});
	});

	describe('#getWeightedDistribution', () => {
		test('returns an array with variant indexes as values, repeated proportionate to their weight', () => {
			const dist = varianceHelpers.getWeightedDistribution([
				{ weight: 0.3 },
				{ weight: 0.7 },
			]);
			const counts = {};
			dist.forEach(d => {
				const index = `${d}`;
				counts[d] = typeof counts[index] === 'number' ? counts[index] + 1 : 1;
			});
			expect(counts[0]).toEqual(30);
			expect(counts[1]).toEqual(70);
		});
	});

	describe('#getWeightedIndex', () => {
		test('returns a number in between 0 and weightSum', () => {
			const weightSum = 100;
			const index = varianceHelpers.getWeightedIndex(weightSum);
			expect(index).toBeGreaterThanOrEqual(0);
			expect(index).toBeLessThan(weightSum);
		});

		test('always returns same index when passed static id', () => {
			let index;
			const staticId = 42;
			for (let i; i < 500; i++) {
				const nextIndex = varianceHelpers.getWeightedIndex(variants, staticId);
				if (index !== nextIndex) {
					throw new Error(
						'`getWeightedIndex` returned a different value when passed a static id'
					);
				}
				if (!index) {
					index = nextIndex;
				}
			}
		});
	});

	describe('#selectVariantIndex', () => {
		test('returns an valid variant index', () => {
			const index = varianceHelpers.selectVariantIndex(variants);
			expect(typeof index).toEqual('number');
			expect([0, 1]).toContain(index);
		});
	});
});

test('Experiment#onStart throws', () => {
	expect(() => Experiment.onStart()).toThrowErrorMatchingSnapshot();
});

describe('<Experiment />', () => {
	beforeAll(() => {
		Experiment.onStart = jest.fn();
	});

	afterEach(() => {
		Experiment.onStart.mockReset();
	});

	test('storeKey is set to guest if no userId is provided', () => {
		const name = 'Test';
		const { container } = render(<Subject name={name} />);
		expect(Storage.getItem(`scientist.guest.${name}`)).toBeDefined();
	});

	test('storeKey uses userId if provided', () => {
		const name = 'Test';
		const userId = 3;
		const { container } = render(<Subject name={name} userId={userId} />);
		expect(Storage.getItem(`scientist.${userId}.${name}`)).toBeDefined();
	});

	test('calls Experiment.onStart only once', () => {
		const name = 'onStart';
		const { rerender } = render(<Subject name={name} />);
		expect(Experiment.onStart).toHaveBeenCalledTimes(1);
		rerender(<Subject name={name} />);
		expect(Experiment.onStart).toHaveBeenCalledTimes(1);
	});

	test('renders one of the variants', () => {
		const name = 'Render';
		const { container } = render(<Subject name={name} />);

		expect(['Control', 'Test']).toContain(container.textContent);
	});
});
