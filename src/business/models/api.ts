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
  key?: { scopes: string[]; expires_at: string | null };
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
  node_id: number;
  team_id: string;
  score: number | null;
}

export interface PortfolioSummary {
  statuses: Record<PortfolioStatus, number>;
  active_exposures: number;
  reviews_overdue: number;
  transitions_30d: number;
  status_changes_30d: number;
}

export interface TransitionCause {
  kind: string;
  available: boolean;
}

/** One row of `/v1/portfolio/transitions` (newest first). */
export interface Transition {
  id: number;
  exposure_id: number;
  team_id: string;
  node_id: number;
  label: string;
  from_status: PortfolioStatus | null;
  to_status: PortfolioStatus;
  occurred_at: string;
  cause: TransitionCause;
}

/** Deal list item (`V1DealSummaryOut`); only the fields the tests rely on are typed. */
export interface Deal {
  deal_id: string;
  team_id: string;
  name: string;
  sector: string | null;
  stage: string;
  status: string;
  relevance_score: number | null;
  contract_value_usd: number | null;
  value_text: string | null;
  countries: string[];
  countries_iso3: string[];
  score_window: string | null;
  score_window_label: string | null;
  summary: string | null;
  buyer: string | null;
  /** Set only when the list is read with `q`: where each term of q was found (`DealQMatchOut`). */
  q_matched: DealQMatch[] | null;
}

/** One term of the free-text search `q` and the first field of the row that holds it. */
export interface DealQMatch {
  term: string;
  field: 'name' | 'buyer' | 'agencies' | 'exporters' | 'summary';
  value?: string | null;
}

/** Deal detail (`V1DealDetailOut`). */
export interface DealDetail extends Deal {
  timeline: unknown[];
  timeline_total: number;
}

export interface DealPage extends PageOf<Deal> {
  outside_markets_held: number;
}

export const DEAL_DOCUMENTS = ['report.pdf', 'pack.pdf', 'deck.pptx'] as const;
export type DealDocument = (typeof DEAL_DOCUMENTS)[number];

/** `/v1/nodes/{id}/ownership-chain`: paths of hops from the root company to its owners. */
export interface OwnershipChain {
  root_id: number;
  nodes: unknown;
  paths: Array<{
    hops: Array<{ owner_id: number; witnesses: OwnershipWitness[] }>;
    /** Why the walk stopped (OwnershipTerminalOut); set on every path. */
    terminal: { reason: string; wording: string };
  }>;
}

/** OwnershipWitnessOut: the register record a hop is cited from. */
export interface OwnershipWitness {
  record_id: number;
  connector_id: string;
  source_class: string;
}

export interface Node {
  id: number;
  /** V1NodeDetailOut keys the id as `node_id` (live and in openapi.json). */
  node_id: number;
  node_type: string;
  label: string;
}

export interface Screening {
  id: number;
  subject_type: string;
  subject_name: string;
  status: string;
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
  risk_score: number | null;
  risk_reason: string | null;
}

export interface RiskBreakdownRow {
  component: string;
  weight: number;
  /** Null when the component has no data (`missing: true`), per the OpenAPI schema. */
  contribution: number | null;
  missing: boolean;
  part: string;
  citation: { dataset_id: string } | null;
}

/** A breakdown component without data, with the reason it is missing. */
export interface RiskGap {
  component: string;
  reason: string;
}

export interface CountryList {
  regions: unknown[];
  countries: CountrySummary[];
}

export interface Country extends CountrySummary {
  iso2: string;
  region: string;
  risk: { score: number; breakdown: RiskBreakdownRow[]; gaps: RiskGap[] };
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
