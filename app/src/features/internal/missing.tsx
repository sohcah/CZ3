import { H4, H5, XStack, YStack, Image } from "tamagui";
import { Page } from "@/page/page";
import { trpc } from "@/common/trpc/trpc";

export function InternalMissingScreen() {
  const query = trpc.internal.missing.useQuery();
  return (
    <Page>
      <Page.Content>
        <YStack space="$2">
          {query.data?.types.map(i => (
            <XStack ai="center">
              <Image src={i.iconUrl} height={36} width={36} />
              <YStack flex={1}>
                <H4>{i.icon}</H4>
                {!!i.id && <H5>ID: {i.id}</H5>}
                {!!i.name && <H5>Name: {i.name}</H5>}
              </YStack>
            </XStack>
          ))}
        </YStack>
      </Page.Content>
    </Page>
  );
}
