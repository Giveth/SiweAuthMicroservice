import { MockGivethIoAdapter } from './givethIo/mockGivethIoAdapter';
import { ImpactGraphAdapter } from './givethIo/impactGraphAdapter';
import { GivethIoInterface } from './givethIo/givethIoInterface';

const mockGivethIoAdapter = new MockGivethIoAdapter();
const impactGraphAdapter = new ImpactGraphAdapter();

export const getGivethIoAdapterInstance = (): GivethIoInterface => {
  switch (process.env.GIVETH_IO_ADAPTER) {
    case 'mock':
      return mockGivethIoAdapter;
    case 'impactGraph':
      return impactGraphAdapter;
    default:
      return mockGivethIoAdapter;
  }
};
