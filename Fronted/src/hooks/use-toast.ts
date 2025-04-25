import { useCallback } from "react";

type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement
  variant?: "default" | "destructive" | "success"
}

const toastState: {
  toasts: ToasterToast[];
  addToast: (toast: Omit<ToasterToast, "id">) => void;
  removeToast: (id: string) => void;
} = {
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
};

// Generate unique ID for toasts
const generateId = () => Math.random().toString(36).substring(2, 9);

export function useToast() {
  const addToast = useCallback((toast: Omit<ToasterToast, "id">) => {
    const id = generateId();
    toastState.toasts = [...toastState.toasts, { id, ...toast }];
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      toastState.toasts = toastState.toasts.filter(t => t.id !== id);
    }, 5000);
    
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    toastState.toasts = toastState.toasts.filter(t => t.id !== id);
  }, []);

  const toast = useCallback(
    ({ ...props }: Omit<ToasterToast, "id">) => {
      return addToast(props);
    },
    [addToast]
  );

  return {
    toast,
    toasts: toastState.toasts,
    removeToast,
  };
}
