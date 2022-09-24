import { H2, XStack, YStack } from "tamagui";
import { Outlet, useNavigate } from "react-router";
import { Page } from "@/page/page";
import { trpc } from "@/common/trpc/trpc";
import { Button } from "tamagui";

export function TourismScreen() {
  const query = trpc.tourism.overview.useQuery();
  const navigate = useNavigate();
  return (
    <Page>
      <Outlet />
      <Page.LeftPanel>
        <YStack space="$2">
          <XStack ai="center">
            <H2>Tourism</H2>
          </XStack>
          {query.data?.sections.map(i => (
            <Button key={i.id} onPress={() => navigate(`/tourism/${i.id}`)}>{i.name}</Button>
          ))}
        </YStack>
      </Page.LeftPanel>
    </Page>
  );
}
