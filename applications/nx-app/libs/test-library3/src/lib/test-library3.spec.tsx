import { render } from '@testing-library/react';

import TestLibrary3 from './test-library3';

describe('TestLibrary3', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TestLibrary3 />);
    expect(baseElement).toBeTruthy();
  });
});
