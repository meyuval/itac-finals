import type { APIRequestContext, APIResponse } from '@playwright/test';

/** Query values are passed through verbatim so tests can send deliberately invalid input. */
export type Query = Record<string, string | number | boolean>;

export interface BinaryResponse {
  readonly status: number;
  readonly headers: Record<string, string>;
  readonly body: Buffer;
}

export interface JsonResponse<T> {
  readonly status: number;
  readonly headers: Record<string, string>;
  readonly body: T;
}

/**
 * Thin HTTP transport over Playwright's APIRequestContext.
 * Knows about base URL, an optional Authorization header and JSON (de)serialisation.
 * Knows nothing about Stonewake endpoints; that belongs to the business layer.
 */
export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
    private readonly authorization?: string,
  ) {}

  async get<T = unknown>(path: string, query?: Query): Promise<JsonResponse<T>> {
    const response = await this.request.get(this.url(path), {
      headers: this.headers(),
      params: query,
    });
    return this.toJson<T>(response);
  }

  /** GET for non-JSON payloads (PDF, PPTX, CSV). The body is returned as raw bytes. */
  async getBinary(path: string, query?: Query): Promise<BinaryResponse> {
    const response = await this.request.get(this.url(path), {
      headers: this.headers(),
      params: query,
    });
    return { status: response.status(), headers: response.headers(), body: await response.body() };
  }

  async post<T = unknown>(path: string, data?: unknown): Promise<JsonResponse<T>> {
    const response = await this.request.post(this.url(path), {
      headers: this.headers(),
      data,
    });
    return this.toJson<T>(response);
  }

  private url(path: string): string {
    return new URL(path, this.baseUrl).toString();
  }

  private headers(): Record<string, string> {
    return this.authorization ? { Authorization: this.authorization } : {};
  }

  private async toJson<T>(response: APIResponse): Promise<JsonResponse<T>> {
    const text = await response.text();
    let body: T;
    try {
      body = JSON.parse(text) as T;
    } catch {
      throw new Error(
        `Expected JSON from ${response.url()} (status ${response.status()}), got: ${text.slice(0, 200)}`,
      );
    }
    return { status: response.status(), headers: response.headers(), body };
  }
}
