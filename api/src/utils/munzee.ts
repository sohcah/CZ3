import fetch, { Response } from "node-fetch";
import { APIError } from "../api";
import { FetchRequest, FetchResponse, Endpoints } from "@cuppazee/api";
import { URLSearchParams } from "url";
import { MinimumAuthenticationResult } from "./auth";
import { rollbar } from "../extra/rollbar";

declare module "node-fetch" {
  interface Response {
    getMunzeeData<T extends any = any>(): Promise<T>;
  }
}

Response.prototype.getMunzeeData = async function() {
  const text = await this.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error(`Invalid Data from Munzee (${this.url}): ${text}`);
    rollbar?.error(`Invalid Data from Munzee (${this.url}): ${text}`);
    throw APIError.MunzeeInvalid();
  }
}

export type EndpointSlashes<T extends string> = T | `/${T}`;

export interface MunzeeFetchParams<Path extends keyof Endpoints> {
  endpoint: FetchRequest<Path>["endpoint"]; //EndpointSlashes<NonNullable<>>
  params: FetchRequest<Path>["params"];
  method?: "GET" | "POST";
  token: string | MinimumAuthenticationResult;
}

export async function munzeeFetch<Path extends keyof Endpoints>({ endpoint, params, method, token }: MunzeeFetchParams<Path>): Promise<Omit<Response, "getMunzeeData"> & { getMunzeeData: () => Promise<FetchResponse<Path>> }> {
  return await fetch(
    "https://api.munzee.com/" +
      endpoint?.replace(/{([A-Za-z0-9_]+)}/g, (_, a) => {
        return params?.[a as keyof FetchRequest<Path>["params"]] || "";
      }) +
      (method === "GET"
        ? `?access_token=${encodeURIComponent(
            typeof token === "string" ? token : token.access_token
          )}${Object.entries(params ?? {})
            .map(i => `&${i[0]}=${encodeURIComponent(i[1].toString())}`)
            .join("")}`
        : ""),
    {
      method: method ?? "POST",
      body: method === "GET" ? undefined : new URLSearchParams({
        data: JSON.stringify(params),
        access_token: typeof token === "string" ? token : token.access_token,
      }),
      headers: {
        "User-Agent": "@cuppazee/api-server (+https://github.com/CuppaZee/CuppaZee)",
      },
    }
  );
}