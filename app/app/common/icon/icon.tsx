import { MaterialCommunityIcons } from "@expo/vector-icons";
import type {ViewProps} from "react-native";
import { useTheme } from "tamagui";
import { unwrapColor, unwrapFontSize } from "@cz3/app_ui";

export type IconProps = ViewProps & {
  color?: string;
  size: string | number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

export function Icon({ color = "$color", size, ...props }: IconProps) {
  const theme = useTheme();
  return (
    <MaterialCommunityIcons
      {...props}
      name={props.icon}
      size={unwrapFontSize(theme, size)}
      color={unwrapColor(theme, color)}
    />
  );
}
