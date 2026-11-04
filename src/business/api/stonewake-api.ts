import type { ApiClient, BinaryResponse, JsonResponse, Query } from '../../infrastructure/http/api-client';
import type {
  Country,
  CountryList,
  DealDetail,
  DealDocument,
  DealPage,
  Entity,
  Health,
  Me,
  Node,
  OwnershipChain,
  PageOf,
  PortfolioItem,
  PortfolioSummary,
  Screening,
  SearchResult,
  Transition,
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

  portfolioTransitions(query?: Query): Promise<JsonResponse<PageOf<Transition>>> {
    return this.client.get<PageOf<Transition>>('/v1/portfolio/transitions', query);
  }

  deals(query?: Query): Promise<JsonResponse<DealPage>> {
    return this.client.get<DealPage>('/v1/deals', query);
  }

  deal(id: string, query?: Query): Promise<JsonResponse<DealDetail>> {
    return this.client.get<DealDetail>(`/v1/deals/${id}`, query);
  }

  /** Generated deal documents (requires the `reports` scope). Returned as raw bytes. */
  dealDocument(id: string, doc: DealDocument): Promise<BinaryResponse> {
    return this.client.getBinary(`/v1/deals/${id}/${doc}`);
  }

  entities(query?: Query): Promise<JsonResponse<PageOf<Entity>>> {
    return this.client.get<PageOf<Entity>>('/v1/entities', query);
  }

  entity(id: number | string): Promise<JsonResponse<Entity>> {
    return this.client.get<Entity>(`/v1/entities/${id}`);
  }

  node(id: number | string): Promise<JsonResponse<Node>> {
    return this.client.get<Node>(`/v1/nodes/${id}`);
  }

  nodeOwnershipChain(id: number | string, query?: Query): Promise<JsonResponse<OwnershipChain>> {
    return this.client.get<OwnershipChain>(`/v1/nodes/${id}/ownership-chain`, query);
  }

  screenings(query?: Query): Promise<JsonResponse<PageOf<Screening>>> {
    return this.client.get<PageOf<Screening>>('/v1/screenings', query);
  }

  monitoringTargets(query?: Query): Promise<JsonResponse<PageOf<unknown>>> {
    return this.client.get<PageOf<unknown>>('/v1/monitoring/targets', query);
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
