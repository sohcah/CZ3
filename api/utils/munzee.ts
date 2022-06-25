import fetch, { Response } from "node-fetch";
import { APIError } from "../api.js";
import { EndpointPath, EndpointParams, EndpointResponse } from "@cz3/api-types";
import { URLSearchParams } from "url";
import { MinimumAuthenticationResult } from "./auth/index.js";
import { rollbar } from "../extra/rollbar.js";
import { applyEndpointPatches } from "../patcher/apply.js";

declare module "node-fetch" {
  interface Response {
    getMunzeeData<T = unknown>(applyPatches?: boolean): Promise<T>;

    __munzeeEndpoint?: EndpointPath;
  }
}

Response.prototype.getMunzeeData = async function (applyPatches = true) {
  const text = await this.text();
  try {
    const data = JSON.parse(text);
    if (applyPatches) {
      return applyEndpointPatches[this.__munzeeEndpoint!]?.(data) ?? data;
    }
    return data;
  } catch {
    console.error(`Invalid Data from Munzee (${this.url}): ${text}`);
    rollbar?.error(`Invalid Data from Munzee (${this.url}): ${text}`);
    throw APIError.MunzeeInvalid();
  }
};

export interface MunzeeFetchParams<Path extends EndpointPath> {
  endpoint: Path;
  params: EndpointParams<Path>;
  method?: "GET" | "POST";
  token: string | MinimumAuthenticationResult;
}

export async function munzeeFetch<Path extends EndpointPath>({
  endpoint,
  params,
  method,
  token,
}: MunzeeFetchParams<Path>): Promise<
  Omit<Response, "getMunzeeData"> & { getMunzeeData: () => Promise<EndpointResponse<Path>> }
> {
  const response = await fetch(
    "https://api.munzee.com/" +
      endpoint?.replace(/{([A-Za-z0-9_]+)}/g, (_, a) => {
        return (params?.[a as keyof EndpointParams<Path>] as string | undefined) || "";
      }) +
      (method === "GET"
        ? `?access_token=${encodeURIComponent(
            typeof token === "string" ? token : token.access_token
          )}${Object.entries(params ?? {})
            .map(i => `&${i[0]}=${encodeURIComponent((i[1] as string).toString())}`)
            .join("")}`
        : ""),
    {
      method: method ?? "POST",
      body:
        method === "GET"
          ? undefined
          : new URLSearchParams({
              data: JSON.stringify(params),
              access_token: typeof token === "string" ? token : token.access_token,
            }),
      headers: {
        "User-Agent": "@cz3/api (+https://github.com/CuppaZee/CZ3)",
      },
    }
  );
  response.__munzeeEndpoint = endpoint;
  return response;
}
