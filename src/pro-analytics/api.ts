import {
  ApiBaseUrls,
  ApiContext,
  PartialApiContext,
  RequestOptions,
  SupportedChainId,
  DEFAULT_PRO_ANALYTICS_CONTEXT,
  ProAnalyticsEnv,
} from "../common";

import { RateLimiter } from "limiter";
import {
  DEFAULT_BACKOFF_OPTIONS,
  DEFAULT_LIMITER_OPTIONS,
  FetchParams,
  request,
} from "./request";

export const PRO_ANALYTICS_PROD_CONFIG: ApiBaseUrls = {
  [SupportedChainId.LIGHTLINK_PHOENIX_MAINNET]: "",
  [SupportedChainId.LIGHTLINK_PEGASUS_TESTNET]: "",
  [SupportedChainId.SEPOLIA]: "",
};

/**
 * An object containing *staging* environment base URLs for each supported `chainId`.
 */
export const PRO_ANALYTICS_STAGING_CONFIG: ApiBaseUrls = {
  [SupportedChainId.LIGHTLINK_PHOENIX_MAINNET]: "",
  [SupportedChainId.LIGHTLINK_PEGASUS_TESTNET]: "",
  [SupportedChainId.SEPOLIA]: "",
};

function cleanObjectFromUndefinedValues(
  obj: Record<string, string>
): typeof obj {
  return Object.keys(obj).reduce((acc, key) => {
    const val = obj[key];
    if (typeof val !== "undefined") acc[key] = val;
    return acc;
  }, {} as typeof obj);
}

export class OrderBookApi {
  public context: ApiContext & RequestOptions;
  private rateLimiter: RateLimiter;

  /**
   * Creates a new instance of the CoW Protocol OrderBook API client.
   * @param context - The API context to use. If not provided, the default context will be used.
   */
  constructor(context: PartialApiContext & RequestOptions = {}) {
    this.context = { ...DEFAULT_PRO_ANALYTICS_CONTEXT, ...context };
    this.rateLimiter = new RateLimiter(
      context.limiterOpts || DEFAULT_LIMITER_OPTIONS
    );
  }

  /**
   * Get the version of the API.
   * @param contextOverride Optional context override for this request.
   * @returns The version of the API.
   */
  getVersion(contextOverride: PartialApiContext = {}): Promise<string> {
    return this.fetch(
      { path: "/api/v1/version", method: "GET" },
      contextOverride
    );
  }

  /**
   * Apply an override to the context for a request.
   * @param contextOverride Optional context override for this request.
   * @returns New context with the override applied.
   */
  private getContextWithOverride(
    contextOverride: PartialApiContext = {}
  ): ApiContext & RequestOptions {
    return { ...this.context, ...contextOverride };
  }

  /**
   * Get the base URLs for the API endpoints given the environment.
   * @param env The environment to get the base URLs for.
   * @returns The base URLs for the API endpoints.
   */
  private getApiBaseUrls(env: ProAnalyticsEnv): ApiBaseUrls {
    if (this.context.baseUrls) return this.context.baseUrls;

    return env === "prod"
      ? PRO_ANALYTICS_PROD_CONFIG
      : PRO_ANALYTICS_STAGING_CONFIG;
  }
  /**
   * Make a request to the API.
   * @param params The parameters for the request.
   * @param contextOverride Optional context override for this request.
   * @returns The response from the API.
   */
  private fetch<T>(
    params: FetchParams,
    contextOverride: PartialApiContext = {}
  ): Promise<T> {
    const { chainId, env } = this.getContextWithOverride(contextOverride);
    const baseUrl = this.getApiBaseUrls(env)[chainId];
    const backoffOpts = this.context.backoffOpts || DEFAULT_BACKOFF_OPTIONS;

    return request(baseUrl, params, this.rateLimiter, backoffOpts);
  }
}
