const TypeDoc = require('typedoc');
const path = require('path');

/**
 * TypeDoc build script for generating TypeScript API documentation
 * Integrates with MKDocs for unified documentation site
 */

async function buildTypeDoc() {
    console.log('🔄 Building TypeScript documentation with TypeDoc...');

    const app = new TypeDoc.Application();

    // Bootstrap the app with configuration
    app.options.addReader(new TypeDoc.TSConfigReader());
    app.bootstrap({
        entryPoints: ['src/typescript'],
        out: 'docs/api/typescript',
        theme: 'default',
        includeVersion: true,
        excludePrivate: true,
        excludeProtected: false,
        excludeExternals: true,
        readme: 'README.md',
        name: 'TypeScript API Documentation',
        tsconfig: 'tsconfig.json',
        plugin: ['typedoc-plugin-mermaid'],
        // MKDocs integration settings
        hideGenerator: true,
        githubPages: false,
        searchInComments: true,
        searchInDocuments: true
    });

    // Check if source directory exists
    const sourceDir = path.join(process.cwd(), 'src', 'typescript');
    const fs = require('fs');
    
    if (!fs.existsSync(sourceDir)) {
        console.log('⚠️  TypeScript source directory not found. Creating sample files...');
        createSampleTypeScriptFiles();
    }

    try {
        const project = app.convert();
        
        if (project) {
            // Generate the documentation
            await app.generateDocs(project, 'docs/api/typescript');
            console.log('✅ TypeDoc documentation generated successfully!');
            
            // Create MKDocs integration file
            createMKDocsIndex();
            
        } else {
            console.error('❌ Failed to convert TypeScript project');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Error generating TypeDoc documentation:', error);
        process.exit(1);
    }
}

function createSampleTypeScriptFiles() {
    const fs = require('fs');
    const path = require('path');
    
    // Create TypeScript source directory
    const tsDir = path.join(process.cwd(), 'src', 'typescript');
    fs.mkdirSync(tsDir, { recursive: true });
    
    // Create sample TypeScript files
    const sampleClass = `
/**
 * Sample service class for demonstration
 * 
 * This class provides example methods to showcase TypeDoc
 * documentation generation and integration with MKDocs.
 */
export class SampleService {
    private readonly name: string;
    private data: Map<string, any> = new Map();

    /**
     * Creates a new SampleService instance
     * @param name - The service name identifier
     */
    constructor(name: string) {
        this.name = name;
    }

    /**
     * Processes input data and returns processed result
     * @param input - The data to process
     * @param options - Processing options
     * @returns Promise that resolves to processed data
     * 
     * @example
     * \`\`\`typescript
     * const service = new SampleService('processor');
     * const result = await service.processData(['item1', 'item2']);
     * \`\`\`
     */
    async processData(input: any[], options?: ProcessingOptions): Promise<ProcessedResult> {
        if (!input || input.length === 0) {
            throw new Error('Input data cannot be empty');
        }

        const processed = input.map((item, index) => ({
            id: index,
            value: item,
            processed: true
        }));

        return {
            items: processed,
            count: processed.length,
            processedBy: this.name,
            timestamp: new Date()
        };
    }

    /**
     * Retrieves data by key
     * @param key - The key to lookup
     * @returns The stored data or undefined
     */
    getData(key: string): any | undefined {
        return this.data.get(key);
    }

    /**
     * Stores data with associated key
     * @param key - The storage key
     * @param value - The value to store
     */
    setData(key: string, value: any): void {
        this.data.set(key, value);
    }
}

/**
 * Configuration options for data processing
 */
export interface ProcessingOptions {
    /** Whether to validate input data */
    validate?: boolean;
    /** Maximum number of items to process */
    maxItems?: number;
    /** Custom transformation function */
    transform?: (item: any) => any;
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
}
`;

    const utilityFunctions = `
/**
 * Utility functions for common operations
 * @module Utils
 */

/**
 * Formats a date string using specified format
 * @param date - The date to format
 * @param format - The format string (default: 'YYYY-MM-DD')
 * @returns Formatted date string
 * 
 * @example
 * \`\`\`typescript
 * formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
 * // Returns: "2025-08-17 10:30:00"
 * \`\`\`
 */
export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
        .replace('YYYY', year.toString())
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

/**
 * Validates email address format
 * @param email - The email address to validate
 * @returns True if valid email format
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Debounces a function call
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns Debounced function
 * 
 * @example
 * \`\`\`typescript
 * const debouncedSave = debounce(() => {
 *   console.log('Saving...');
 * }, 300);
 * \`\`\`
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(null, args), wait);
    };
}

/**
 * Type guard to check if value is not null or undefined
 * @param value - Value to check
 * @returns True if value is defined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}
`;

    const indexFile = `
/**
 * Main entry point for the TypeScript API
 * @packageDocumentation
 */

export { SampleService, ProcessingOptions, ProcessedResult, ProcessedItem } from './SampleService';
export { formatDate, validateEmail, debounce, isDefined } from './utils';

/**
 * Library version
 */
export const VERSION = '1.0.0';

/**
 * Default configuration object
 */
export const DEFAULT_CONFIG = {
    timeout: 5000,
    retries: 3,
    debug: false
} as const;
`;

    // Write the files
    fs.writeFileSync(path.join(tsDir, 'SampleService.ts'), sampleClass);
    fs.writeFileSync(path.join(tsDir, 'utils.ts'), utilityFunctions);
    fs.writeFileSync(path.join(tsDir, 'index.ts'), indexFile);
    
    console.log('✅ Sample TypeScript files created');
}

function createMKDocsIndex() {
    const fs = require('fs');
    const indexContent = `# TypeScript API Documentation

This section contains automatically generated TypeScript API documentation.

[Browse Full Documentation](index.html)

## Overview

The TypeScript API provides:

- **Services**: Core business logic services
- **Utilities**: Helper functions and utilities
- **Interfaces**: Type definitions and contracts
- **Types**: Custom type definitions

## Key Components

### SampleService
Main service class for data processing and management.

### Utility Functions
Collection of helper functions for common operations:
- Date formatting
- Email validation
- Function debouncing
- Type guards

!!! tip "Type Safety"
    All TypeScript APIs are fully typed with comprehensive JSDoc documentation.
    Use your IDE's IntelliSense for the best development experience.

!!! note "Auto-generated Content"
    This documentation is automatically generated from TypeScript source code using TypeDoc.
    For the most up-to-date information, refer to the source code.
`;

    fs.writeFileSync('docs/api/typescript/index.md', indexContent);
    console.log('✅ MKDocs integration file created');
}

// Run the build process
if (require.main === module) {
    buildTypeDoc().catch(error => {
        console.error('Build failed:', error);
        process.exit(1);
    });
}

module.exports = { buildTypeDoc };
