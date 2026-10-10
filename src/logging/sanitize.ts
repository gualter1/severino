const SENSITIVE_KEYS = [
  'password', 'secret', 'token', 'apiKey', 'api_key', 'authorization', 
  'auth', 'privateKey', 'private_key', 'credential', 'creditCard', 'ssn'
];

function sanitizeValue(key: string, value: any): any {
  if (value === null || value === undefined) return value;
  
  const lowerKey = key.toLowerCase();
  if (SENSITIVE_KEYS.some(sk => lowerKey.includes(sk.toLowerCase()))) {
    return '[REDACTED]';
  }

  if (typeof value === 'object') {
    return sanitizeObject(value);
  }

  // Basic regex check for potential token strings or keys
  if (typeof value === 'string' && (value.startsWith('Bearer ') || value.length > 64)) {
    return '[REDACTED_TOKEN]';
  }

  return value;
}

export function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeValue(key, value);
  }
  return sanitized;
}

export function sanitizeArgs(args: any): any {
  return sanitizeObject(args);
}

export function sanitizeResult(result: any): any {
  return sanitizeObject(result);
}
