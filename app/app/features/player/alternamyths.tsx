import { H2, Text, YStack, XStack, Popover } from "@cz3/app_ui";
import { trpc } from "@cz3/app/common/trpc/trpc";
import { Image } from "react-native";
import { useMatch } from "react-router";

export function PlayerAlternamythsScreen() {
  const { params: { player = null } = {} } = useMatch("/player/:player/*") ?? {};
  const query = trpc.useQuery([
    "player:alternamyth",
    {
      username: player!,
    }
  ], {
    enabled: player !== null,
  });
  if (!query.data) {
    return <H2>AlternaMyth Captures - Loading...</H2>;
  }

  const creators = new Set(query.data.alternaMyths.map(i => i.creator));
  const types = new Set(query.data.alternaMyths.map(i => i.munzee_logo));
  const creatorTypeMap = new Map<string, typeof query.data.alternaMyths[number]>();

  for (const myth of query.data.alternaMyths) {
    creatorTypeMap.set(`${myth.creator}-${myth.munzee_logo}`, myth);
  }

  return (
    <YStack>
      <H2>AlternaMyth Captures</H2>
      <YStack>
        <XStack>
          {[...creators].map(creator => (
            <Image
              source={{ uri: `https://api.cuppazee.app/player/${creator}/avatar` }}
              style={{ height: 32, width: 32, borderRadius: 16 }}
            />
          ))}
        </XStack>
        {[...types].map(type => (
          <XStack>
            {[...creators].map(creator => {
              const myth = creatorTypeMap.get(`${creator}-${type}`);
              if (!myth) {
                return <YStack w={32} h={32} />;
              }
              return (
                <Popover placement="bottom-start">
                  <Popover.Trigger>
                    <Image
                      source={{ uri: myth.munzee_logo }}
                      style={{ height: 32, width: 32, opacity: myth.captured ? 1 : 0.25, transform: [ {scale: myth.captured ? 1 : 0.8 } ] }}
                    />
                  </Popover.Trigger>
                  <Popover.Content>
                    <YStack>
                      <Text tag="a" className="external-link" href={myth.code} fontFamily="$body" fontWeight="bold">
                        {myth.friendly_name}
                      </Text>
                      <Text fontFamily="$body">by {myth.creator}</Text>
                    </YStack>
                  </Popover.Content>
                </Popover>
              );
            })}
          </XStack>
        ))}
      </YStack>
    </YStack>
  );
}
