/**
 * Tipos de erro customizados para a aplicação
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Não autenticado') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Sem permissão') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso não encontrado') {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Erro no banco de dados') {
    super(message, 'DATABASE_ERROR', 500);
    this.name = 'DatabaseError';
  }
}

/**
 * Função para tratar erros do Supabase
 */
export function handleSupabaseError(error: any): AppError {
  // Erro de autenticação
  if (error.status === 401 || error.message?.includes('JWT')) {
    return new AuthenticationError(error.message);
  }

  // Erro de autorização/RLS
  if (error.status === 403 || error.code === '42501') {
    return new AuthorizationError('Você não tem permissão para acessar este recurso');
  }

  // Erro de validação
  if (error.status === 400 || error.code === '23505') {
    return new ValidationError(error.message || 'Dados inválidos');
  }

  // Erro de não encontrado
  if (error.status === 404 || error.code === 'PGRST116') {
    return new NotFoundError(error.message);
  }

  // Erro genérico de banco
  return new DatabaseError(error.message || 'Erro ao processar requisição');
}

/**
 * Função para formatar mensagens de erro para o usuário
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Ocorreu um erro inesperado';
}

/**
 * Função para log de erros (pode ser integrada com serviço de monitoramento)
 */
export function logError(error: unknown, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
    if (context) {
      console.error('Context:', context);
    }
  }

  // TODO: Integrar com serviço de monitoramento (Sentry, LogRocket, etc)
  // Exemplo:
  // Sentry.captureException(error, { extra: context });
}
