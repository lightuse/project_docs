/**
 * Sample TypeScript API Documentation
 * @packageDocumentation
 */

/**
 * Configuration options for the documentation service
 */
export interface ServiceConfig {
  /** Service name identifier */
  name: string;
  /** Enable debug logging */
  debug?: boolean;
  /** Maximum number of items to process */
  maxItems?: number;
  /** Timeout in milliseconds */
  timeout?: number;
}

/**
 * Result object returned from processing operations
 */
export interface ProcessedResult {
  /** Array of processed items */
  items: ProcessedItem[];
  /** Total count of processed items */
  count: number;
  /** Identifier of the processing service */
  processedBy: string;
  /** Processing timestamp */
  timestamp: Date;
  /** Processing status */
  status: 'success' | 'partial' | 'failed';
}

/**
 * Individual processed item structure
 */
export interface ProcessedItem {
  /** Unique identifier */
  id: number;
  /** Original value */
  value: any;
  /** Processing status flag */
  processed: boolean;
  /** Optional error message if processing failed */
  error?: string;
}

/**
 * Sample service class for documentation purposes
 * 
 * This class demonstrates how TypeScript code is documented using TypeDoc
 * and integrated into the MKDocs documentation site.
 * 
 * @example
 * ```typescript
 * const service = new DocumentationService({
 *   name: 'MyService',
 *   debug: true
 * });
 * 
 * const result = await service.processData(['item1', 'item2']);
 * console.log(result.count); // 2
 * ```
 */
export class DocumentationService {
  private readonly config: Required<ServiceConfig>;
  private data: Map<string, any> = new Map();

  /**
   * Creates a new DocumentationService instance
   * 
   * @param config - Configuration options for the service
   * @throws {Error} When service name is empty
   * 
   * @example
   * ```typescript
   * const service = new DocumentationService({
   *   name: 'DataProcessor',
   *   debug: true,
   *   maxItems: 1000
   * });
   * ```
   */
  constructor(config: ServiceConfig) {
    if (!config.name.trim()) {
      throw new Error('Service name cannot be empty');
    }

    this.config = {
      name: config.name,
      debug: config.debug ?? false,
      maxItems: config.maxItems ?? 100,
      timeout: config.timeout ?? 5000
    };

    if (this.config.debug) {
      console.log(`DocumentationService '${this.config.name}' initialized`);
    }
  }

  /**
   * Processes input data and returns processed result
   * 
   * @param input - The data array to process
   * @param options - Optional processing parameters
   * @returns Promise that resolves to processed data
   * 
   * @throws {Error} When input data is empty
   * @throws {Error} When input exceeds maxItems limit
   * 
   * @example
   * ```typescript
   * const service = new DocumentationService({ name: 'processor' });
   * const result = await service.processData(['item1', 'item2']);
   * 
   * console.log(result.status); // 'success'
   * console.log(result.count);  // 2
   * ```
   */
  async processData(
    input: any[], 
    options?: { 
      validate?: boolean; 
      transform?: (item: any) => any 
    }
  ): Promise<ProcessedResult> {
    if (!input || input.length === 0) {
      throw new Error('Input data cannot be empty');
    }

    if (input.length > this.config.maxItems) {
      throw new Error(`Input exceeds maximum items limit (${this.config.maxItems})`);
    }

    const startTime = Date.now();
    const processed: ProcessedItem[] = [];
    let successCount = 0;

    for (let i = 0; i < input.length; i++) {
      try {
        let value = input[i];
        
        // Apply validation if requested
        if (options?.validate) {
          this.validateItem(value);
        }

        // Apply transformation if provided
        if (options?.transform) {
          value = options.transform(value);
        }

        processed.push({
          id: i,
          value,
          processed: true
        });
        successCount++;

      } catch (error) {
        processed.push({
          id: i,
          value: input[i],
          processed: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Check timeout
      if (Date.now() - startTime > this.config.timeout) {
        throw new Error('Processing timeout exceeded');
      }
    }

    const result: ProcessedResult = {
      items: processed,
      count: processed.length,
      processedBy: this.config.name,
      timestamp: new Date(),
      status: successCount === input.length ? 'success' : 
               successCount > 0 ? 'partial' : 'failed'
    };

    if (this.config.debug) {
      console.log(`Processed ${successCount}/${input.length} items successfully`);
    }

    return result;
  }

  /**
   * Retrieves stored data by key
   * 
   * @param key - The key to lookup
   * @returns The stored data or undefined if not found
   * 
   * @example
   * ```typescript
   * service.setData('user', { name: 'John', age: 30 });
   * const user = service.getData('user');
   * console.log(user.name); // 'John'
   * ```
   */
  getData<T = any>(key: string): T | undefined {
    return this.data.get(key);
  }

  /**
   * Stores data with associated key
   * 
   * @param key - The storage key
   * @param value - The value to store
   * @throws {Error} When key is empty
   * 
   * @example
   * ```typescript
   * service.setData('config', { theme: 'dark', lang: 'en' });
   * ```
   */
  setData<T>(key: string, value: T): void {
    if (!key.trim()) {
      throw new Error('Storage key cannot be empty');
    }

    this.data.set(key, value);
    
    if (this.config.debug) {
      console.log(`Data stored with key: ${key}`);
    }
  }

  /**
   * Removes data by key
   * 
   * @param key - The key to remove
   * @returns true if the key existed and was removed, false otherwise
   */
  removeData(key: string): boolean {
    const existed = this.data.has(key);
    this.data.delete(key);
    
    if (this.config.debug && existed) {
      console.log(`Data removed for key: ${key}`);
    }
    
    return existed;
  }

  /**
   * Gets all stored keys
   * 
   * @returns Array of all storage keys
   */
  getKeys(): string[] {
    return Array.from(this.data.keys());
  }

  /**
   * Clears all stored data
   */
  clearData(): void {
    const count = this.data.size;
    this.data.clear();
    
    if (this.config.debug) {
      console.log(`Cleared ${count} stored items`);
    }
  }

  /**
   * Gets service configuration
   * 
   * @returns Service configuration object
   */
  getConfig(): Readonly<Required<ServiceConfig>> {
    return { ...this.config };
  }

  /**
   * Validates a single item
   * 
   * @private
   * @param item - Item to validate
   * @throws {Error} When item is null or undefined
   */
  private validateItem(item: any): void {
    if (item === null || item === undefined) {
      throw new Error('Item cannot be null or undefined');
    }
  }
}

/**
 * Library version
 */
export const VERSION = '1.0.0';

/**
 * Default configuration object
 */
export const DEFAULT_CONFIG: ServiceConfig = {
  name: 'DefaultService',
  debug: false,
  maxItems: 100,
  timeout: 5000
} as const;
