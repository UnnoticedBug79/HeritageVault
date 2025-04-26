import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    try {
      const json = JSON.parse(errorText);
      throw new Error(json.error || "An error occurred");
    } catch (e) {
      throw new Error(errorText || `HTTP error ${res.status}`);
    }
  }
  return res;
}

export async function apiRequest(
  method: string,
  path: string,
  body?: any
): Promise<Response> {
  const options: RequestInit = {
    method,
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  };

  if (body) {
    if (body instanceof FormData) {
      options.body = body;
    } else {
      options.headers = {
        ...options.headers,
        "Content-Type": "application/json",
      };
      options.body = JSON.stringify(body);
    }
  }

  const res = await fetch(path, options);
  return throwIfResNotOk(res);
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn = <T>(options: {
  on401: UnauthorizedBehavior;
}) => {
  return async ({ queryKey }: { queryKey: string[] }): Promise<T | undefined> => {
    const path = queryKey[0];
    try {
      const res = await fetch(path, {
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (res.status === 401 && options.on401 === "returnNull") {
        return undefined;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      console.error(`Error fetching ${path}:`, error);
      throw error;
    }
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
