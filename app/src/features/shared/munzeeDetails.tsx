import { trpc } from "@/common/trpc/trpc";
import { H2, H3, YStack, Button } from "tamagui";
import { openBrowserAsync } from "expo-web-browser";

export function MunzeeDetailsPanel({ munzeeId }: { munzeeId: number }) {
  const data = trpc.useQuery(["munzee:details", { munzeeId }]);
  if (!data.data) return null;
  return (
    <YStack>
      <H2>{data.data.name}</H2>
      <H3>By {data.data.creator.username}</H3>
      <Button
        href={data.data.url}
        onPress={() => {
          console.log(data.data.url);
          openBrowserAsync(data.data.url);
        }}
      >
        Open on Munzee.com
      </Button>
    </YStack>
  );
}
