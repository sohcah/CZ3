import { useHotkeys } from "react-hotkeys-hook";
import { useState } from "react";
import { Text, YStack, Button } from "tamagui";

export function CMDK() {
  const [open, setOpen] = useState(false);
  useHotkeys("cmd+k", () => {
    setOpen(i => !i);
  });

  if (!open) return null;

  return (
    <YStack
      justifyContent="center"
      alignItems="center"
      position="absolute"
      top="0"
      bottom="0"
      left="0"
      right="0"
    >
      <YStack position="absolute" top="0" bottom="0" left="0" right="0" bc="$color" opacity={0.5} />
      <YStack
        zIndex={1}
        bc="$backgroundStrong"
        p="$4"
        borderRadius="$2"
        borderWidth={4}
        borderColor="$borderColor"
      >
        <Text fontFamily="$body" fontWeight="bold" fontSize="$8">
          Command Palette Coming Soon
        </Text>
        <Button
          bc="$backgroundStrong"
          onPress={() => {
            setOpen(false);
          }}
        >
          Close
        </Button>
      </YStack>
    </YStack>
  );
}
