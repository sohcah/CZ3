import {
  Setting,
  SettingsSectionWithAtoms,
  SettingType,
  SettingWithAtom,
} from "@cz3/app/settings/common";
import { useAtom } from "jotai";
import { XStack, YStack, Text, Group, Button, Switch } from "@cz3/app_ui";
import { useMatch } from "react-router";
import { settingsSections } from "@cz3/app/settings/all";
import { ReactNode } from "react";
import { Icon } from "@cz3/app/common/icon/icon";

function SettingSegmentSelectEditor({
  setting,
}: {
  setting: SettingWithAtom<Setting<SettingType.SegmentSelect, any>, any>;
}) {
  const [atomValue, setValue] = useAtom(setting.atom);
  const defaultOption = setting.options.find(i =>
    typeof i === "object" ? i.value === setting.defaultValue : i === setting.defaultValue
  );
  return (
    <XStack space="$2">
      <Button
        chromeless
        borderColor={atomValue === null ? "$borderColor" : "#fff0"}
        onPress={() => setValue(null)}
      >
        {atomValue === null && <Icon icon="check" size="$3" />} Default (
        {(typeof defaultOption === "object" ? defaultOption.label : defaultOption) ??
          setting.defaultValue}
        )
      </Button>
      <Group>
        {setting.options.map(i => {
          const label = typeof i === "object" ? i.label : i;
          const value = typeof i === "object" ? i.value : i;
          return (
            <Button
              bc={atomValue === value ? "$backgroundStrong" : undefined}
              onPress={() => setValue(value)}
            >
              {atomValue === value && <Icon icon="check" size="$3" />}
              {label}
            </Button>
          );
        })}
      </Group>
    </XStack>
  );
}

function SettingBooleanEditor({
  setting,
}: {
  setting: SettingWithAtom<Setting<SettingType.Boolean, any>, any>;
}) {
  const [atomValue, setValue] = useAtom(setting.atom);
  return (
    <XStack space="$2">
      <Button
        chromeless
        borderColor={atomValue === null ? "$borderColor" : "#fff0"}
        onPress={() => setValue(null)}
      >
        {atomValue === null && <Icon icon="check" size="$3" />} Default (
        {setting.defaultValue
          ? setting.options?.onLabel ?? "On"
          : setting.options?.offLabel ?? "Off"}
        )
      </Button>
      <Group>
        <Button
          bc={atomValue === false ? "$backgroundStrong" : undefined}
          onPress={() => setValue(false)}
        >
          {atomValue === false && <Icon icon="check" size="$3" />}
          {setting.options?.offLabel ?? "Off"}
        </Button>
        <Button
          bc={atomValue === true ? "$backgroundStrong" : undefined}
          onPress={() => setValue(true)}
        >
          {atomValue === true && <Icon icon="check" size="$3" />}
          {setting.options?.onLabel ?? "On"}
        </Button>
      </Group>
    </XStack>
  );
}

// function SettingBooleanEditor({
//   setting,
// }: {
//   setting: SettingWithAtom<Setting<SettingType.Boolean, any>, any>;
// }) {
//   const [atomValue, setValue] = useAtom(setting.atom);
//   return (
//     <XStack space="$2">
//       {atomValue === null ? (
//         <Button chromeless onPress={() => setValue(setting.defaultValue)}>
//           <Icon icon="pencil" size="$3" /> Edit
//         </Button>
//       ) : (
//         <Button chromeless onPress={() => setValue(null)}>
//           <Icon icon="undo-variant" size="$3" /> Reset
//         </Button>
//       )}
//       <Switch
//         key={atomValue === null ? "unset" : "set"}
//         value={atomValue ?? setting.defaultValue}
//         onCheckedChange={atomValue === null ? undefined : checked => setValue(checked)}
//         disabled={atomValue !== null}
//         opacity={atomValue === null ? 0.5 : 1}
//         pointerEvents={atomValue === null ? "none" : "auto"}
//         size="$4"
//         alignSelf="center"
//       >
//         <Switch.Thumb animation="bouncy" />
//       </Switch>
//     </XStack>
//   );
// }

export function SettingPanel({ setting }: { setting: SettingWithAtom<any, any> }) {
  const [value] = useAtom(setting.atom);

  let editor: ReactNode = null;
  switch (setting.type) {
    case SettingType.SegmentSelect:
      editor = <SettingSegmentSelectEditor setting={setting} />;
      break;
    case SettingType.Boolean:
      editor = <SettingBooleanEditor setting={setting} />;
      break;
  }

  return (
    <XStack
      borderRadius="$4"
      m="$2"
      width={500}
      maxWidth="100%"
      flexGrow={1}
      p="$2"
      space="$2"
      bc="$backgroundSoft"
      borderColor="$borderColor"
      borderWidth={2}
    >
      <YStack flex={1}>
        <Text fontSize="$5" fontFamily="$body" fontWeight="bold">
          {setting.name}
        </Text>
        {!!setting.description && (
          <Text fontSize="$3" fontFamily="$body">
            {setting.description}
          </Text>
        )}
      </YStack>
      {editor}
    </XStack>
  );
}

export function SettingPanels({ settings }: { settings: any[] }) {
  return (
    <XStack p="$2" flexWrap="wrap">
      {settings.map(setting => (
        <SettingPanel key={setting.id} setting={setting} />
      ))}
    </XStack>
  );
}

export function SettingsEditor() {
  const { params: { section = null } = {} } = useMatch("/settings/:section") ?? {};
  const settingsSection = settingsSections.find(i => i.id === section);
  if (!settingsSection) return null;
  const settings = Object.entries(settingsSection.settings).filter(i => typeof i[1] !== "function");
  return (
    <XStack p="$2" flexWrap="wrap">
      {settings.map(setting => (
        <SettingPanel key={setting[0]} setting={setting[1]} />
      ))}
    </XStack>
  );
}
