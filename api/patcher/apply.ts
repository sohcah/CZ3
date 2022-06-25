import { EndpointPath, EndpointResponse } from "@cz3/api-types";
import { PatchFunction } from "./index.js";
import * as Patches from "./patches.js";

export const iconPatches = Object.values(Patches).filter(i => i.patchIcon);
export const namePatches = Object.values(Patches).filter(i => i.patchName);
export const endpointPatches = Object.values(Patches).filter(i => i.patchEndpoints);

export async function applyIconPatches(value: string) {
  let patched = value;
  for (const patch of iconPatches) {
    patched = await patch.patchIcon!(patched);
  }
  return patched;
}

export async function applyNamePatches(value: string) {
  let patched = value;
  for (const patch of namePatches) {
    patched = await patch.patchName!(patched);
  }
  return patched;
}

export const applyEndpointPatches = new Proxy(
  {} as {
    [key in EndpointPath]: NonNullable<PatchFunction<EndpointResponse<key>>>;
  },
  {
    get(target, prop: EndpointPath) {
      if (!(prop in target)) {
        const patchFns = endpointPatches.filter(i => i.patchEndpoints?.[prop]);
        target[prop] = (async (value: EndpointResponse<typeof prop>) => {
          let patched = value;
          for (const patch of patchFns) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            patched = await patch.patchEndpoints![prop]!(patched as any);
          }
          return patched;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any;
      }

      return target[prop]!;
    },
  }
);
