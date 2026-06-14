// Hook centralizado para manejo de errores en React
import { useCallback, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { parseError, logError, type AppError } from '@/lib/errors';
import { AuthContext } from '@/lib/auth-context';

export interface ErrorHandlerOptions {
  context?: string;
  showNotification?: boolean;
  notificationType?: 'default' | 'error' | 'success' | 'info' | 'warning';
  redirect?: string;
  onError?: (error: AppError) => void;
  rethrow?: boolean;
}

export function useErrorHandler() {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  const handleError = useCallback(
    (
      error: any,
      options: ErrorHandlerOptions = {}
    ): AppError => {
      const {
        context = 'unknown',
        showNotification = true,
        notificationType = 'error',
        redirect,
        onError,
        rethrow = false,
      } = options;

      const appError = parseError(error);

      // Loguear el error
      logError(error, context);

      // Manejar autenticación
      if (appError.statusCode === 401) {
        // Limpiar sesión
        if (authContext) {
          authContext.logout?.();
        }
        // Redirigir a login
        router.push('/login');

        if (showNotification) {
          toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
        return appError;
      }

      // Mostrar notificación
      if (showNotification) {
        const toastFn = toast[notificationType] || toast.error;
        toastFn(appError.message, {
          description: appError.details
            ? Object.entries(appError.details)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ')
            : undefined,
        });
      }

      // Ejecutar callback personalizado
      if (onError) {
        onError(appError);
      }

      // Redirigir si es necesario
      if (redirect) {
        router.push(redirect);
      }

      // Re-lanzar el error si se solicita
      if (rethrow) {
        throw appError;
      }

      return appError;
    },
    [router, authContext]
  );

  return {
    handleError,
  };
}
