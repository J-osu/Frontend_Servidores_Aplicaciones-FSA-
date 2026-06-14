// Sistema centralizado de manejo de errores para Panel de Administración

export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  data?: any;
}

export class AppError extends Error {
  constructor(
    public type: ErrorType,
    public message: string,
    public statusCode?: number,
    public originalError?: any,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function parseError(error: any): AppError {
  if (error instanceof AppError) return error;

  // Error de red/fetch
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new AppError(
      ErrorType.NETWORK,
      'Error de conexión. Verifica tu conexión a internet.',
      0,
      error
    );
  }

  // Error de respuesta JSON
  if (error?.message?.includes('JSON')) {
    return new AppError(
      ErrorType.SERVER,
      'Error al procesar la respuesta del servidor.',
      500,
      error
    );
  }

  // Errores HTTP con status code
  if (error?.statusCode || error?.status) {
    const statusCode = error.statusCode || error.status;
    const message = error.message || error.msg || 'Error desconocido';

    if (statusCode === 401) {
      return new AppError(
        ErrorType.AUTHENTICATION,
        'No autenticado. Por favor, inicia sesión.',
        401,
        error
      );
    }

    if (statusCode === 403) {
      return new AppError(
        ErrorType.AUTHORIZATION,
        'No tienes permiso para realizar esta acción.',
        403,
        error
      );
    }

    if (statusCode === 404) {
      return new AppError(
        ErrorType.NOT_FOUND,
        'El recurso solicitado no existe.',
        404,
        error
      );
    }

    if (statusCode === 409) {
      return new AppError(
        ErrorType.CONFLICT,
        'El recurso ya existe o hay un conflicto.',
        409,
        error
      );
    }

    if (statusCode === 422 || statusCode === 400) {
      return new AppError(
        ErrorType.VALIDATION,
        message || 'Los datos proporcionados no son válidos.',
        statusCode,
        error,
        error?.data || error?.errors
      );
    }

    if (statusCode >= 500) {
      return new AppError(
        ErrorType.SERVER,
        'Error en el servidor. Por favor, intenta más tarde.',
        statusCode,
        error
      );
    }

    if (statusCode >= 400) {
      return new AppError(
        ErrorType.UNKNOWN,
        message || 'Error en la solicitud.',
        statusCode,
        error
      );
    }
  }

  // Error genérico de objeto Error
  if (error instanceof Error) {
    return new AppError(
      ErrorType.UNKNOWN,
      error.message || 'Un error desconocido ocurrió.',
      undefined,
      error
    );
  }

  // String o valor primitivo
  if (typeof error === 'string') {
    return new AppError(ErrorType.UNKNOWN, error);
  }

  return new AppError(
    ErrorType.UNKNOWN,
    'Un error desconocido ocurrió.',
    undefined,
    error
  );
}

export function getErrorMessage(error: any): string {
  const appError = parseError(error);
  return appError.message;
}

export function logError(error: any, context?: string): void {
  const appError = parseError(error);

  const logData = {
    timestamp: new Date().toISOString(),
    type: appError.type,
    message: appError.message,
    statusCode: appError.statusCode,
    context,
    details: appError.details,
    stack: appError.originalError?.stack,
  };

  console.error('[AppError]', logData);

  // Aquí puedes enviar a un servicio de logging (Sentry, etc.)
  // if (process.env.NODE_ENV === 'production') {
  //   sendToLoggingService(logData);
  // }
}
