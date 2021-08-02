import { render } from '@testing-library/react';

import TestLibrary from './test-library';

describe('TestLibrary', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TestLibrary />);
    expect(baseElement).toBeTruthy();
  });
});
