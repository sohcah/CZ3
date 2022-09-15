import { XStack, YStack } from "tamagui";
import { ReactNode } from "react";

export function PageWithSidebar({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  return (
    <XStack height="100vh" flex={1}>
      <YStack
        display="none"
        $gtMd={{
          display: "flex",
        }}
        my="$4"
        mr="$4"
        position="relative"
        top="$0"
        bottom="$0"
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
        {sidebar}
      </YStack>
      <YStack flex={1} w={0}>
        {children}
      </YStack>
    </XStack>
  );
}
