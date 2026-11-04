/** Business models for the Stonewake read-only API (https://api.stonewake.ai/openapi.json). */

export interface ErrorEnvelope {
  error: { code: string; message: string };
  detail?: ValidationDetail[];
}

export interface ValidationDetail {
  type: string;
  loc: Array<string | number>;
  msg: string;
}

export interface PageOf<T> {
  items: T[];
  limit: number;
  offset: number;
  total: number;
}

export interface Health {
  status: string;
  app: string;
  version: string;
  environment: string;
}

export interface Me {
  credential: string;
  role: string;
  team_scope: { all_teams: boolean; teams: Array<{ id: string; name: string }> };
}

export const PORTFOLIO_STATUSES = ['green', 'amber', 'red', 'insufficient', 'not_assessed', 'sole_trader'] as const;
export type PortfolioStatus = (typeof PORTFOLIO_STATUSES)[number];

export interface PortfolioItem {
  id: number;
  label: string;
  active: boolean;
  status: PortfolioStatus;
  completeness: number;
}

export interface PortfolioSummary {
  statuses: Record<PortfolioStatus, number>;
  active_exposures: number;
  reviews_overdue: number;
}

export interface Entity {
  id: number;
  slug: string;
  display_name: string;
  kind: string;
}

export interface CountrySummary {
  iso3: string;
  name: string;
}

export interface CountryList {
  regions: unknown[];
  countries: CountrySummary[];
}

export interface Country extends CountrySummary {
  iso2: string;
  region: string;
  risk: { score: number };
}

export interface SearchHit {
  node_id: number;
  label: string;
  score: number;
}

export interface SearchResult {
  query: string;
  hits: SearchHit[];
}
