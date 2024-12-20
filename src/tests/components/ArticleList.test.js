import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArticleList } from '../../components/ArticleList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('ArticleList', () => {
  it('renders article list correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ArticleList />
      </QueryClientProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });

    expect(screen.getByText('Test content...')).toBeInTheDocument();
  });
});