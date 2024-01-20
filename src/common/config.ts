import { SupportedChainId } from "./chains";
import { BackoffOptions } from 'exponential-backoff'
import { RateLimiterOpts } from 'limiter/dist/esm'



/**
 * @property {RateLimiterOpts} [limiterOpts] The options to use for the rate limiter.
 * @property {BackoffOptions} [backoffOpts] The options to use for the backoff.
 */
export interface RequestOptions {
  limiterOpts?: RateLimiterOpts
  backoffOpts?: BackoffOptions
}



/**
 * @property {string} [1890] The base URL for the phoenix mainnet API.
 * @property {string} [1891] The base URL for the pegasus testnet API.
 * @property {string} [11155111] The base URL for the sepolia API.
 */
export type ApiBaseUrls = Record<SupportedChainId, string>;

export type ProAnalyticsEnv = "prod" | "staging";

export interface ApiContext {
  chainId: SupportedChainId;
  env: ProAnalyticsEnv;
  baseUrls?: ApiBaseUrls;
}

export type PartialApiContext = Partial<ApiContext>

/**
 * The list of available environments.
 */
export const ENVS_LIST: ProAnalyticsEnv[] = ["prod", "staging"];

/**
 * The default Pro Analytics API context.
 */
export const DEFAULT_PRO_ANALYTICS_CONTEXT: ApiContext = {
  env: "prod",
  chainId: SupportedChainId.LIGHTLINK_PHOENIX_MAINNET,
};
