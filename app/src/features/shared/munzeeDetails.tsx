import { trpc } from "@/common/trpc/trpc";
import { H3, YStack, Button, Spinner, H4 } from "tamagui";
import { openBrowserAsync } from "expo-web-browser";

export function MunzeeDetailsPanel({ munzeeId }: { munzeeId: number }) {
  const data = trpc.munzee.details.useQuery({ munzeeId });
  if (!data.data) {
    return (
      <YStack alignItems="center" p="$4">
        <Spinner size="large" />
      </YStack>
    );
  }
  return (
    <YStack>
      <H3>{data.data.name}</H3>
      <H4>By {data.data.creator.username}</H4>
      <Button
        href={data.data.url}
        onPress={async () => {
          if (data.data) await openBrowserAsync(data.data.url);
        }}
      >
        Open on Munzee.com
      </Button>
    </YStack>
  );
}
