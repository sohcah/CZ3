import { H2, Text, XStack } from "tamagui";
import { Outlet, useMatch } from "react-router";
import { Page } from "@/page/page";

export function PlayerScreen() {
  const { params: { player = null } = {} } = useMatch("/player/:player/*") ?? {};
  if (!player) {
    return <H2>No player found</H2>;
  }
  return (
    <Page>
      <Page.LeftPanel>
        <XStack ai="center">
          <H2>{player}</H2>
        </XStack>
        <Text fontFamily="$body">This is a sidebar. I might put some things here eventually.</Text>
      </Page.LeftPanel>
      <Outlet />
    </Page>
  );
}
