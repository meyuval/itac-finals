import type { ApiClient, JsonResponse, Query } from '../../infrastructure/http/api-client';
import type {
  Country,
  CountryList,
  Entity,
  Health,
  Me,
  PageOf,
  PortfolioItem,
  PortfolioSummary,
  SearchResult,
} from '../models/api';

/** Limits documented in the OpenAPI spec (`.itac/sut-docs/openapi.json`). */
export const API_LIMITS = {
  portfolioMax: 100,
  searchMax: 25,
  searchMinQueryLength: 2,
} as const;

/**
 * Endpoint semantics of the Stonewake read-only API.
 * Each method maps to one route; validation and auth outcomes are returned, not thrown,
 * so tests can assert on negative cases.
 */
export class StonewakeApi {
  constructor(private readonly client: ApiClient) {}

  health(): Promise<JsonResponse<Health>> {
    return this.client.get<Health>('/health');
  }

  me(): Promise<JsonResponse<Me>> {
    return this.client.get<Me>('/v1/me');
  }

  portfolio(query?: Query): Promise<JsonResponse<PageOf<PortfolioItem>>> {
    return this.client.get<PageOf<PortfolioItem>>('/v1/portfolio', query);
  }

  portfolioSummary(): Promise<JsonResponse<PortfolioSummary>> {
    return this.client.get<PortfolioSummary>('/v1/portfolio/summary');
  }

  entities(query?: Query): Promise<JsonResponse<PageOf<Entity>>> {
    return this.client.get<PageOf<Entity>>('/v1/entities', query);
  }

  entity(id: number | string): Promise<JsonResponse<Entity>> {
    return this.client.get<Entity>(`/v1/entities/${id}`);
  }

  node(id: number | string): Promise<JsonResponse<unknown>> {
    return this.client.get(`/v1/nodes/${id}`);
  }

  countries(): Promise<JsonResponse<CountryList>> {
    return this.client.get<CountryList>('/v1/countries');
  }

  country(iso3: string): Promise<JsonResponse<Country>> {
    return this.client.get<Country>(`/v1/countries/${iso3}`);
  }

  search(query?: Query): Promise<JsonResponse<SearchResult>> {
    return this.client.get<SearchResult>('/v1/search', query);
  }

  resolveCitations(): Promise<JsonResponse<unknown>> {
    return this.client.post('/v1/citations/resolve');
  }

  /** Arbitrary GET for auth-boundary checks on routes without a dedicated method. */
  raw(path: string, query?: Query): Promise<JsonResponse<unknown>> {
    return this.client.get(path, query);
  }
}
