import { QueryClient } from '@tanstack/react-query';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const error = await res.json();
      throw new Error(error.message || 'Unknown error');
    }
    throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
  }
}

export async function apiRequest(
  method: string,
  path: string,
  body?: any,
  headers?: HeadersInit
) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  };

  if (body && !(body instanceof FormData)) {
    options.body = JSON.stringify(body);
  } else if (body) {
    options.body = body;
    // Remove Content-Type header so browser can set it with boundary for FormData
    delete (options.headers as any)['Content-Type'];
  }

  return fetch(path, options);
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (context: { queryKey: unknown[] }) => Promise<T | null> = (options) => async (context) => {
  const [path] = context.queryKey as [string, ...unknown[]];
  
  const res = await apiRequest('GET', path as string);
  
  if (res.status === 401) {
    if (options.on401 === 'throw') {
      throw new Error('Unauthorized');
    }
    return null;
  }
  
  await throwIfResNotOk(res);
  return await res.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn<unknown>({ on401: 'returnNull' }),
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
    },
  },
});
