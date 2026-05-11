import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Componente que lança erro para testar
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
}

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render fallback UI when error occurs', () => {
    // Suprimir console.error para este teste
    const consoleError = console.error;
    console.error = () => {};

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo deu errado')).toBeInTheDocument();
    expect(screen.getByText(/Ocorreu um erro inesperado/)).toBeInTheDocument();

    // Restaurar console.error
    console.error = consoleError;
  });

  it('should render custom fallback when provided', () => {
    const consoleError = console.error;
    console.error = () => {};

    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();

    console.error = consoleError;
  });

  it('should call onError callback when error occurs', () => {
    const consoleError = console.error;
    console.error = () => {};

    let errorCaught = false;
    const onError = () => {
      errorCaught = true;
    };

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(errorCaught).toBe(true);

    console.error = consoleError;
  });

  it('should show error details in development mode', () => {
    const consoleError = console.error;
    console.error = () => {};

    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Detalhes do erro/)).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
    console.error = consoleError;
  });
});
