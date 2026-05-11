import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMembers, useCreateMember, useUpdateMember, useDeleteMember, useMember } from '@/hooks/api/useMembersQuery';
import { supabase } from '@/lib/supabase';
import { createElement } from 'react';

// Mock do Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
    from: vi.fn(),
  },
}));

// Wrapper para React Query
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: any) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useMembersQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useMembers', () => {
    it('should fetch members successfully', async () => {
      const mockMembers = [
        { id: '1', name: 'John Doe', email: 'john@example.com', status: true },
        { id: '2', name: 'Jane Doe', email: 'jane@example.com', status: true },
      ];

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: { user: { id: '1' } } as any },
        error: null,
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: mockMembers,
          error: null,
          count: 2,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const { result } = renderHook(() => useMembers(), {
        wrapper: createWrapper(),
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.members).toEqual(mockMembers);
      expect(result.current.total).toBe(2);
      expect(result.current.error).toBeNull();
    });

    it('should handle search filter', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: { user: { id: '1' } } as any },
        error: null,
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 0,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      renderHook(() => useMembers({ search: 'John' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockQuery.ilike).toHaveBeenCalledWith('name', '%John%');
      });
    });

    it('should handle errors', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: { user: { id: '1' } } as any },
        error: null,
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error', status: 500 },
          count: 0,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const { result } = renderHook(() => useMembers(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 3000 });

      expect(result.current.error).toBeTruthy();
      expect(result.current.members).toEqual([]);
    });
  });

  describe('useCreateMember', () => {
    it('should create a member successfully', async () => {
      const newMember = { name: 'New Member', email: 'new@example.com' };
      const createdMember = { id: '3', ...newMember, status: true };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: createdMember,
          error: null,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const { result } = renderHook(() => useCreateMember(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newMember);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(createdMember);
    });
  });

  describe('useUpdateMember', () => {
    it('should update a member successfully', async () => {
      const updatedData = { name: 'Updated Name' };
      const updatedMember = { id: '1', ...updatedData, email: 'test@example.com' };

      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: updatedMember,
          error: null,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const { result } = renderHook(() => useUpdateMember(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: updatedData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(updatedMember);
    });
  });

  describe('useDeleteMember', () => {
    it('should soft delete a member successfully', async () => {
      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const { result } = renderHook(() => useDeleteMember(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({ deleted_at: expect.any(String) })
      );
    });
  });

  describe('useMember', () => {
    it('should fetch a single member successfully', async () => {
      const mockMember = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        status: true,
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockMember,
          error: null,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const { result } = renderHook(() => useMember('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.member).toEqual(mockMember);
      expect(result.current.error).toBeNull();
    });
  });
});
