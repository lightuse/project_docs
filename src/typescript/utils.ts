/**
 * Utility functions for common operations
 * @module Utils
 */

/**
 * Date formatting options
 */
export interface DateFormatOptions {
  /** Include time component */
  includeTime?: boolean;
  /** Use 12-hour format instead of 24-hour */
  use12Hour?: boolean;
  /** Locale for formatting */
  locale?: string;
}

/**
 * Email validation result
 */
export interface EmailValidationResult {
  /** Whether the email is valid */
  isValid: boolean;
  /** Validation error message if invalid */
  error?: string;
  /** Suggested corrections if available */
  suggestions?: string[];
}

/**
 * Formats a date string using specified options
 * 
 * @param date - The date to format
 * @param options - Formatting options
 * @returns Formatted date string
 * 
 * @example
 * ```typescript
 * formatDate(new Date(), { includeTime: true, use12Hour: true })
 * // Returns: "8/18/2025, 10:30:00 AM"
 * 
 * formatDate(new Date(), { locale: 'ja-JP' })
 * // Returns: "2025/8/18"
 * ```
 */
export function formatDate(date: Date, options: DateFormatOptions = {}): string {
  const {
    includeTime = false,
    use12Hour = false,
    locale = 'en-US'
  } = options;

  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  };

  if (includeTime) {
    formatOptions.hour = 'numeric';
    formatOptions.minute = '2-digit';
    formatOptions.second = '2-digit';
    formatOptions.hour12 = use12Hour;
  }

  try {
    return date.toLocaleDateString(locale, formatOptions);
  } catch (error) {
    // Fallback to default locale if specified locale is invalid
    return date.toLocaleDateString('en-US', formatOptions);
  }
}

/**
 * Validates email address format with detailed feedback
 * 
 * @param email - The email address to validate
 * @returns Validation result with details
 * 
 * @example
 * ```typescript
 * const result = validateEmailAdvanced('user@example.com');
 * console.log(result.isValid); // true
 * 
 * const invalid = validateEmailAdvanced('invalid-email');
 * console.log(invalid.error); // "Missing @ symbol"
 * ```
 */
export function validateEmailAdvanced(email: string): EmailValidationResult {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email must be a non-empty string'
    };
  }

  const trimmed = email.trim();
  if (trimmed !== email) {
    return {
      isValid: false,
      error: 'Email contains leading or trailing whitespace',
      suggestions: [trimmed]
    };
  }

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'Email cannot be empty'
    };
  }

  if (!trimmed.includes('@')) {
    return {
      isValid: false,
      error: 'Missing @ symbol'
    };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return {
      isValid: false,
      error: 'Email must contain exactly one @ symbol'
    };
  }

  const [local, domain] = parts;
  
  if (local.length === 0) {
    return {
      isValid: false,
      error: 'Local part (before @) cannot be empty'
    };
  }

  if (domain.length === 0) {
    return {
      isValid: false,
      error: 'Domain part (after @) cannot be empty'
    };
  }

  if (!domain.includes('.')) {
    return {
      isValid: false,
      error: 'Domain must contain at least one dot'
    };
  }

  // Advanced email regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Email format is invalid'
    };
  }

  return { isValid: true };
}

/**
 * Simple email validation for backward compatibility
 * 
 * @param email - The email address to validate
 * @returns True if valid email format
 * 
 * @deprecated Use validateEmailAdvanced for better error handling
 */
export function validateEmail(email: string): boolean {
  return validateEmailAdvanced(email).isValid;
}

/**
 * Debounces a function call to limit execution frequency
 * 
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns Debounced function
 * 
 * @example
 * ```typescript
 * const debouncedSave = debounce((data: string) => {
 *   console.log('Saving:', data);
 * }, 300);
 * 
 * debouncedSave('draft1'); // Will be cancelled
 * debouncedSave('draft2'); // Will be cancelled  
 * debouncedSave('final');  // Will execute after 300ms
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: any = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func.apply(null, args);
      timeout = null;
    }, wait);
  };
}

/**
 * Type guard to check if value is not null or undefined
 * 
 * @param value - Value to check
 * @returns True if value is defined
 * 
 * @example
 * ```typescript
 * const maybeString: string | null = getValue();
 * 
 * if (isDefined(maybeString)) {
 *   // TypeScript knows maybeString is string here
 *   console.log(maybeString.toUpperCase());
 * }
 * ```
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Throttles function execution to occur at most once per specified interval
 * 
 * @param func - The function to throttle
 * @param limit - The number of milliseconds to throttle executions to
 * @returns Throttled function
 * 
 * @example
 * ```typescript
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event handled');
 * }, 100);
 * 
 * window.addEventListener('scroll', throttledScroll);
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Deep clones an object using JSON serialization
 * 
 * @param obj - The object to clone
 * @returns Deep cloned object
 * 
 * @throws {Error} When object contains non-serializable values
 * 
 * @example
 * ```typescript
 * const original = { name: 'John', meta: { age: 30 } };
 * const cloned = deepClone(original);
 * 
 * cloned.meta.age = 31;
 * console.log(original.meta.age); // Still 30
 * ```
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    throw new Error('Object contains non-serializable values and cannot be deep cloned');
  }
}

/**
 * Generates a random string of specified length
 * 
 * @param length - Length of the random string
 * @param charset - Character set to use (default: alphanumeric)
 * @returns Random string
 * 
 * @example
 * ```typescript
 * const id = randomString(8); // e.g., "aB3xY9zQ"
 * const hexId = randomString(16, '0123456789abcdef'); // hex string
 * ```
 */
export function randomString(
  length: number, 
  charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return result;
}
