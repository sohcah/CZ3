import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { mmkv } from "./mmkv";

const createMMKVStorage = <T>() =>
  createJSONStorage<T>(() => ({
    getItem: (key: string) => mmkv.getString(key) ?? null,
    setItem: (key: string, newValue: string | undefined) => {
      if (newValue === undefined) {
        mmkv.delete(key);
      } else {
        mmkv.set(key, newValue);
      }
    },
    removeItem: (key: string) => mmkv.delete(key),
  }));

export function atomWithMMKV<T>(key: string, initialValue?: T) {
  return atomWithStorage<T>(`@cz3/${key}`, initialValue!, createMMKVStorage<T>());
}

export const themeAtom = atomWithMMKV<"light" | "dark" | "system">("theme", "system");
