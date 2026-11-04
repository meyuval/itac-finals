import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * Typed runtime configuration for the test suite.
 * Values come from the environment (CI secrets) or from a local `.env` file (never committed).
 */
export interface Config {
  readonly appUrl: string;
  readonly apiUrl: string;
  readonly email: string;
  readonly password: string;
  readonly apiKey: string;
}

export const DEFAULT_APP_URL = 'https://app.stonewake.ai';
export const DEFAULT_API_URL = 'https://api.stonewake.ai';

let envFileLoaded = false;

/**
 * Loads `<repo>/.env` into `process.env` once, if the file exists.
 * Variables already present in the environment take precedence (Node semantics).
 */
export function loadEnvFile(): void {
  if (envFileLoaded) return;
  envFileLoaded = true;
  const envFile = path.resolve(__dirname, '..', '..', '..', '.env');
  if (existsSync(envFile)) {
    process.loadEnvFile(envFile);
  }
}

function optional(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value ? value : fallback;
}

/** Reads and validates the full configuration. Throws one error naming every missing variable. */
export function loadConfig(): Config {
  loadEnvFile();
  const required = ['STONEWAKE_EMAIL', 'STONEWAKE_PASSWORD', 'STONEWAKE_API_KEY'] as const;
  const missing = required.filter((name) => !process.env[name]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        'Copy .env.example to .env locally, or define them as CI secrets.',
    );
  }
  return {
    appUrl: optional('STONEWAKE_APP_URL', DEFAULT_APP_URL),
    apiUrl: optional('STONEWAKE_API_URL', DEFAULT_API_URL),
    email: process.env.STONEWAKE_EMAIL!.trim(),
    password: process.env.STONEWAKE_PASSWORD!.trim(),
    apiKey: process.env.STONEWAKE_API_KEY!.trim(),
  };
}
