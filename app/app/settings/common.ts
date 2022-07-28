import { useAtom, useAtomValue, WritableAtom } from "jotai";
import { atomWithMMKV } from "@cz3/app/common/storage/atoms";
import { SetAtom } from "jotai/core/atom";
import { nanoid } from "nanoid";
import { mmkv } from "@cz3/app/common/storage/mmkv";
import seedrandom from "seedrandom";

function getDeviceId() {
  let devId = mmkv.getString("@cz3/deviceId");
  if (!devId) {
    devId = nanoid();
    mmkv.set("@cz3/deviceId", devId);
  }
  return devId;
}

const deviceId = getDeviceId();

export enum SettingType {
  Select = "SELECT",
  SegmentSelect = "SEGMENT_SELECT",
  String = "STRING",
  Color = "COLOR",
  Boolean = "BOOLEAN",
}

export interface SettingOptions<V> {
  [SettingType.Select]: V[] | { label: string; value: V }[];
  [SettingType.SegmentSelect]: V[] | { label: string; value: V }[];
  [SettingType.Color]: { alpha?: boolean } | undefined;
  [SettingType.String]: never;
  [SettingType.Boolean]: { onLabel?: string; offLabel?: string } | undefined;
}

export interface SettingTypes {
  [SettingType.Select]: string;
  [SettingType.SegmentSelect]: string;
  [SettingType.Color]: string;
  [SettingType.String]: string;
  [SettingType.Boolean]: boolean;
}

const ValueSymbol = Symbol();

export type Setting<T extends SettingType, V extends SettingTypes[T]> = {
  name: string;
  description?: string;
  type: T;
  [ValueSymbol]: V;
  defaultValue: V | ((rand: number) => V);
} & (SettingOptions<V>[T] extends never
  ? { options?: never }
  : undefined extends SettingOptions<V>[T]
  ? { options?: SettingOptions<V>[T] }
  : { options: SettingOptions<V>[T] });

export type SettingsSection<V = any> = {
  [key: string]:
    | Setting<SettingType.String, any>
    | Setting<SettingType.Color, any>
    | Setting<SettingType.Select, any>
    | Setting<SettingType.SegmentSelect, any>
    | Setting<SettingType.Boolean, any>;
};

export type SettingWithAtom<S extends Setting<any, any>, K extends string> = S & {
  defaultValue: S[typeof ValueSymbol];
  id: K;
  atom: WritableAtom<S[typeof ValueSymbol] | null, S[typeof ValueSymbol] | null>;
}

export type SettingsSectionWithAtoms<N extends string, T extends SettingsSection> = {
  [key in
    | keyof T
    | `use${keyof T extends string ? Capitalize<keyof T> : never}`
    | `useWriteable${keyof T extends string
        ? Capitalize<keyof T>
        : never}`]: key extends `useWriteable${infer Key}`
    ? () => [
        Awaited<T[Uncapitalize<Key>][typeof ValueSymbol]>,
        Awaited<T[Uncapitalize<Key>][typeof ValueSymbol] | null>,
        SetAtom<T[Uncapitalize<Key>][typeof ValueSymbol] | null, void>
      ]
    : key extends `use${infer Key}`
    ? () => Awaited<T[Uncapitalize<Key>][typeof ValueSymbol]>
    : SettingWithAtom<T[key], key extends string ? `${N}:${key}` : never>;
};

export function createSettings<N extends string, T extends SettingsSection>(
  name: N,
  settings: T
): SettingsSectionWithAtoms<N, T> {
  return Object.fromEntries(
    Object.entries(settings)
      .map(([key, setting]) => {
        const id = `${name}:${key}`;
        const defaultValue =
          typeof setting.defaultValue === "function"
            ? setting.defaultValue(seedrandom(`${deviceId}:${id}`)())
            : setting.defaultValue;
        const atom = atomWithMMKV(id, null);
        return [
          [
            key,
            {
              ...setting,
              defaultValue,
              id,
              atom,
            },
          ],
          [
            `use${key[0]?.toUpperCase()}${key.slice(1)}`,
            () => {
              return useAtomValue(atom) ?? defaultValue;
            },
          ],
          [
            `useWriteable${key[0]?.toUpperCase()}${key.slice(1)}`,
            () => {
              const [value, setValue] = useAtom(atom);
              return [value ?? defaultValue, value ?? null, setValue];
            },
          ],
        ];
      })
      .flat()
  ) as unknown as SettingsSectionWithAtoms<N, T>;
}

export function createSetting<V extends SettingTypes[SettingType.Boolean]>(
  setting: Omit<Setting<SettingType.Boolean, V>, typeof ValueSymbol>
): Setting<SettingType.Boolean, V>;
export function createSetting<V extends SettingTypes[SettingType.String]>(
  setting: Omit<Setting<SettingType.String, V>, typeof ValueSymbol>
): Setting<SettingType.String, V>;
export function createSetting<V extends SettingTypes[SettingType.Select]>(
  setting: Omit<Setting<SettingType.Select, V>, typeof ValueSymbol>
): Setting<SettingType.Select, V>;
export function createSetting<V extends SettingTypes[SettingType.SegmentSelect]>(
  setting: Omit<Setting<SettingType.SegmentSelect, V>, typeof ValueSymbol>
): Setting<SettingType.SegmentSelect, V>;
export function createSetting<V extends SettingTypes[SettingType.Color]>(
  setting: Omit<Setting<SettingType.Color, V>, typeof ValueSymbol>
): Setting<SettingType.Color, V>;
export function createSetting<V extends SettingTypes[T], T extends SettingType>(
  setting: Omit<Setting<T, V>, typeof ValueSymbol>
): Setting<T, V> {
  return setting as Setting<T, V>;
}
