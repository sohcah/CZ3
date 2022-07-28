/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConfig } from "tamagui";
import Color from "color";

export function unwrapColor(theme: any, color: any): string {
  if (typeof color === "object") {
    return color.val;
  }
  const token = getConfig().tokensParsed.color[color];
  if (token) {
    if (typeof token === "object") {
      return token.val as string;
    }
    return token;
  }
  if (theme[color]) {
    const themeCol = theme[color];
    if (typeof themeCol === "object") {
      return themeCol.val;
    }
    return themeCol;
  }
  return color;
}

export function unwrapColorAlpha(theme: any, color: any, alpha: number): string {
  const colorValue = unwrapColor(theme, color);
  return Color(colorValue).alpha(alpha).hexa();
}

export function unwrapSize(theme: any, size: any): number {
  if (typeof size === "object") {
    return size.val;
  }
  const token = getConfig().tokensParsed.size[size];
  if (token) {
    if (typeof token === "object") {
      return token.val as number;
    }
    return token;
  }
  if (theme[size]) {
    const themeCol = theme[size];
    if (typeof themeCol === "object") {
      return themeCol.val;
    }
    return themeCol;
  }
  return size;
}

export function unwrapFontSize(theme: any, size: any, scale = 1.5): number {
  if (typeof size === "object") {
    return size.val;
  }
  const token = getConfig().fontsParsed["$body"]?.size[size];
  if (token) {
    if (typeof token === "object") {
      return (token.val as number) * scale;
    }
    return token * scale;
  }
  if (theme[size]) {
    const themeCol = theme[size];
    if (typeof themeCol === "object") {
      return themeCol.val * scale;
    }
    return themeCol * scale;
  }
  return size;
}
