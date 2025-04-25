import { QueryClient } from '@tanstack/react-query';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    let errorJson: any = null;
    try {
      errorJson = JSON.parse(errorText);
    } catch {}
    throw new Error(errorJson?.message || errorText || res.statusText);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  body?: unknown
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (body !== undefined) {
    if (body instanceof FormData) {
      options.body = body;
      delete (options.headers as any)['Content-Type'];
    } else {
      options.body = JSON.stringify(body);
    }
  }

  const res = await fetch(url, options);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (context: { queryKey: [string, ...unknown[]] }) => Promise<T> = (
  options
) => async (context) => {
  const [url] = context.queryKey as [string];
  
  const res = await apiRequest('GET', url);

  if (res.status === 401) {
    if (options.on401 === "returnNull") {
      return null as any;
    } else {
      await throwIfResNotOk(res);
    }
  }

  await throwIfResNotOk(res);
  return await res.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
