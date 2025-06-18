export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export function isAxiosError(
  error: unknown,
): error is import('axios').AxiosError {
  return isError(error) && 'isAxiosError' in error;
}

export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  return 'Unknown error';
}

export function getErrorStack(error: unknown): string | undefined {
  if (isError(error)) {
    return error.stack;
  }
}
