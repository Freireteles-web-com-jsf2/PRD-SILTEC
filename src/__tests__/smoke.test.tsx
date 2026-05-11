import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Componente simples para teste
function TestComponent() {
  return <div>Hello Test</div>;
}

describe('Smoke Test', () => {
  it('should render component', () => {
    render(<TestComponent />);
    expect(screen.getByText('Hello Test')).toBeInTheDocument();
  });

  it('should perform basic assertion', () => {
    expect(1 + 1).toBe(2);
  });
});
