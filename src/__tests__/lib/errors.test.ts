import { describe, it, expect } from 'vitest';
import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  DatabaseError,
  handleSupabaseError,
  getErrorMessage,
} from '@/lib/errors';

describe('Custom Error Classes', () => {
  it('should create AppError with message and code', () => {
    const error = new AppError('Test error', 'TEST_CODE', 500);

    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_CODE');
    expect(error.statusCode).toBe(500);
    expect(error.name).toBe('AppError');
  });

  it('should create AuthenticationError', () => {
    const error = new AuthenticationError();

    expect(error.message).toBe('Não autenticado');
    expect(error.code).toBe('AUTH_ERROR');
    expect(error.statusCode).toBe(401);
    expect(error.name).toBe('AuthenticationError');
  });

  it('should create AuthorizationError', () => {
    const error = new AuthorizationError();

    expect(error.message).toBe('Sem permissão');
    expect(error.code).toBe('AUTHORIZATION_ERROR');
    expect(error.statusCode).toBe(403);
    expect(error.name).toBe('AuthorizationError');
  });

  it('should create ValidationError with fields', () => {
    const fields = { email: ['Email inválido'], password: ['Senha muito curta'] };
    const error = new ValidationError('Dados inválidos', fields);

    expect(error.message).toBe('Dados inválidos');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.statusCode).toBe(400);
    expect(error.fields).toEqual(fields);
    expect(error.name).toBe('ValidationError');
  });

  it('should create NotFoundError', () => {
    const error = new NotFoundError();

    expect(error.message).toBe('Recurso não encontrado');
    expect(error.code).toBe('NOT_FOUND');
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe('NotFoundError');
  });

  it('should create DatabaseError', () => {
    const error = new DatabaseError();

    expect(error.message).toBe('Erro no banco de dados');
    expect(error.code).toBe('DATABASE_ERROR');
    expect(error.statusCode).toBe(500);
    expect(error.name).toBe('DatabaseError');
  });
});

describe('handleSupabaseError', () => {
  it('should convert 401 error to AuthenticationError', () => {
    const supabaseError = { status: 401, message: 'Invalid JWT' };
    const error = handleSupabaseError(supabaseError);

    expect(error).toBeInstanceOf(AuthenticationError);
    expect(error.message).toBe('Invalid JWT');
  });

  it('should convert 403 error to AuthorizationError', () => {
    const supabaseError = { status: 403, message: 'Forbidden' };
    const error = handleSupabaseError(supabaseError);

    expect(error).toBeInstanceOf(AuthorizationError);
  });

  it('should convert RLS error to AuthorizationError', () => {
    const supabaseError = { code: '42501', message: 'RLS policy violation' };
    const error = handleSupabaseError(supabaseError);

    expect(error).toBeInstanceOf(AuthorizationError);
  });

  it('should convert 400 error to ValidationError', () => {
    const supabaseError = { status: 400, message: 'Invalid input' };
    const error = handleSupabaseError(supabaseError);

    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should convert unique constraint error to ValidationError', () => {
    const supabaseError = { code: '23505', message: 'Duplicate key' };
    const error = handleSupabaseError(supabaseError);

    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should convert 404 error to NotFoundError', () => {
    const supabaseError = { status: 404, message: 'Not found' };
    const error = handleSupabaseError(supabaseError);

    expect(error).toBeInstanceOf(NotFoundError);
  });

  it('should convert PGRST116 to NotFoundError', () => {
    const supabaseError = { code: 'PGRST116', message: 'No rows found' };
    const error = handleSupabaseError(supabaseError);

    expect(error).toBeInstanceOf(NotFoundError);
  });

  it('should convert unknown error to DatabaseError', () => {
    const supabaseError = { status: 500, message: 'Internal error' };
    const error = handleSupabaseError(supabaseError);

    expect(error).toBeInstanceOf(DatabaseError);
  });
});

describe('getErrorMessage', () => {
  it('should extract message from AppError', () => {
    const error = new AppError('Custom error');
    expect(getErrorMessage(error)).toBe('Custom error');
  });

  it('should extract message from standard Error', () => {
    const error = new Error('Standard error');
    expect(getErrorMessage(error)).toBe('Standard error');
  });

  it('should return string error as is', () => {
    expect(getErrorMessage('String error')).toBe('String error');
  });

  it('should return default message for unknown error', () => {
    expect(getErrorMessage(null)).toBe('Ocorreu um erro inesperado');
    expect(getErrorMessage(undefined)).toBe('Ocorreu um erro inesperado');
    expect(getErrorMessage(123)).toBe('Ocorreu um erro inesperado');
  });
});
