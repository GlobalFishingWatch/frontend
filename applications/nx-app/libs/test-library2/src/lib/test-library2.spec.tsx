import { render } from '@testing-library/react';

import TestLibrary2 from './test-library2';

describe('TestLibrary2', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TestLibrary2 />);
    expect(baseElement).toBeTruthy();
  });
});
