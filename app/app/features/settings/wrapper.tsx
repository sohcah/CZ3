import { H2, XStack, YStack, Text } from "@cz3/app_ui";
import { Outlet, useMatch } from "react-router";
import { settingsSections } from "@cz3/app/settings/all";

export function SettingsWrapper() {
  return (
    <XStack flex={1}>
      <YStack
        display="none"
        $gtMd={{
          display: "flex",
        }}
        my="$4"
        mr="$4"
        borderTopRightRadius="$4"
        borderBottomRightRadius="$4"
        bc="$backgroundSoft"
        borderWidth={2}
        borderLeftWidth={0}
        borderColor="$borderColor"
        p="$2"
        elevation="$4"
        w={300}
      >
        <H2>Settings</H2>
        {settingsSections.map(i => <Text fontFamily="$body">{i.title}</Text>)}
      </YStack>
      <YStack flex={1} w={0}>
        <Outlet />
      </YStack>
    </XStack>
  );
}
