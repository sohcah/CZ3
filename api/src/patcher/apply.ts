import { Endpoints } from "@cuppazee/api";
import { PatchFunction } from ".";
import * as Patches from "./patches";

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
    [key in keyof Endpoints]: NonNullable<PatchFunction<Endpoints[key]["response"]>>;
  },
  {
    get(target, prop: keyof Endpoints) {
      if (!(prop in target)) {
        const patchFns = endpointPatches.filter(i => i.patchEndpoints?.[prop]);
        target[prop] = (async (value: Endpoints[typeof prop]["response"]) => {
          let patched = value;
          for (const patch of patchFns) {
            patched = await patch.patchEndpoints![prop]!(patched as any);
          }
          return patched;
        }) as any;
      }

      return target[prop]!;
    },
  }
);
