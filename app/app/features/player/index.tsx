import { H1 } from "@cz3/app_ui";
import { Outlet, useMatch } from "react-router";

export function PlayerScreen() {
  const { params: { player = null } = {} } = useMatch("/player/:player/*") ?? {};
  if (!player) {
    return <H1>No player found</H1>;
  }
  return (
    <>
      <H1>{player}</H1>
      <Outlet />
    </>
  );
}
