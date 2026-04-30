export const ERROR_MESSAGES: Record<number | string, string> = {
  400: 'Invalid request. Please check your input.',
  404: 'Resource not found.',
  500: 'Server error. Please try again later.',
  'NETWORK_ERROR': 'Network error. Please check your connection.',
  'VALIDATION_ERROR': 'Please fix the errors below.',
  'DUPLICATE_ID': 'This ID already exists.',
  'INVALID_DATE': 'Please enter a valid date.',
};

export const getErrorMessage = (code?: number | string): string => {
  if (!code) return 'An error occurred.';
  return ERROR_MESSAGES[code] || `Error: ${code}`;
};

export const mapApiError = (error: any): {code: number; message: string} => {
  if (!error) return {code: 500, message: getErrorMessage(500)};
  
  const status = error?.status || error?.httpCode || 500;
  const apiMsg = error?.error?.message || error?.message;
  
  let msg = getErrorMessage(status);
  
  // detect specific errors
  if (apiMsg?.toLowerCase().includes('duplicate')) {
    msg = getErrorMessage('DUPLICATE_ID');
  } else if (apiMsg?.toLowerCase().includes('not found')) {
    msg = getErrorMessage(404);
  } else if (apiMsg) {
    msg = apiMsg;
  }
  
  return {code: status, message: msg};
};
