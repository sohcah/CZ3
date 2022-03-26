import { Endpoints } from "@cuppazee/api";

type PossiblePromise<T> = T | Promise<T>;

export type PatchFunction<Value> = ((value: Value) => PossiblePromise<Value>) | null;

export interface Patcher {
  name: string;
  description: string;

  patchIcon?: PatchFunction<string>;

  patchName?: PatchFunction<string>;

  patchEndpoints?: {
    [key in keyof Endpoints]?: PatchFunction<Endpoints[key]["response"]>;
  };
}
