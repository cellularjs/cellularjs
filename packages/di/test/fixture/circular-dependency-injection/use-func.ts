import { forwardRef } from '../../../src';
import { Bar } from './bar.class';

export const useFuncProviderWithoutForwardRef = {
  token: 'bar',
  useFunc: (bar) => bar,
  deps: [Bar],
};

export const useFuncProviderWithForwardRef = {
  token: 'bar',
  useFunc: (bar) => bar,
  deps: [forwardRef(() => Bar)],
};
