import { getConfig, useTheme } from "tamagui";
import FeatherIcons from "@tamagui/feather-icons";

export const Icon = function ({
  icon: As,
  size,
  color = "$color",
}: {
  size: string;
  color?: string;
  icon: typeof FeatherIcons[keyof typeof FeatherIcons];
}) {
  const theme = useTheme();
  const sizeValue = getConfig().fontsParsed?.$body?.size?.[size];
  const tc = theme[color];
  return (
    <As
      size={Number(typeof sizeValue === "number" ? sizeValue : sizeValue?.val)}
      height={typeof sizeValue === "number" ? sizeValue : sizeValue?.val}
      width={typeof sizeValue === "number" ? sizeValue : sizeValue?.val}
      color={typeof tc === "number" ? tc.toString() : typeof tc === "object" ? tc.val : tc}
    />
  );
};
