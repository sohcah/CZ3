import { H2, Text, YStack, XStack, Popover, Group, Button, Label } from "@cz3/app_ui";
import { trpc } from "@cz3/app/common/trpc/trpc";
import { Image } from "react-native";
import { useMatch } from "react-router";
import { useState } from "react";

export function PlayerAlternamythsScreen() {
  const { params: { player = null } = {} } = useMatch("/player/:player/*") ?? {};
  const query = trpc.useQuery(
    [
      "player:alternamyth",
      {
        username: player!,
      },
    ],
    {
      enabled: player !== null,
    }
  );

  const [layout, setLayout] = useState("type");

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
      <XStack p="$2">
        <Label>Group by </Label>
        <Group size="$3">
          <Button
            onPress={() => setLayout("type")}
            bc={layout === "type" ? "$backgroundStrong" : "$background"}
          >
            Type
          </Button>
          <Button
            onPress={() => setLayout("player")}
            bc={layout === "player" ? "$backgroundStrong" : "$background"}
          >
            Player
          </Button>
        </Group>
      </XStack>
      {layout === "type" ? (
        <YStack>
          <XStack>
            {[...creators].map(creator => (
              <Image
                key={creator}
                source={{ uri: `https://api.cuppazee.app/player/${creator}/avatar` }}
                style={{ height: 32, width: 32, borderRadius: 16 }}
              />
            ))}
          </XStack>
          {[...types].map(type => (
            <XStack key={type}>
              {[...creators].map(creator => {
                const myth = creatorTypeMap.get(`${creator}-${type}`);
                if (!myth) {
                  return <YStack key={creator} w={32} h={32} />;
                }
                return (
                  <Popover key={creator} placement="bottom-start">
                    <Popover.Trigger>
                      <YStack bc={myth.captured ? "#00ff0022" : "#ff000022"}>
                        <Image
                          source={{ uri: myth.munzee_logo }}
                          style={{
                            height: 32,
                            width: 32,
                            opacity: myth.captured ? 1 : 0.25,
                            transform: [{ scale: myth.captured ? 1 : 0.8 }],
                          }}
                        />
                      </YStack>
                    </Popover.Trigger>
                    <Popover.Content>
                      <YStack>
                        <Text
                          tag="a"
                          className="external-link"
                          href={myth.code}
                          fontFamily="$body"
                          fontWeight="bold"
                        >
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
      ) : (
        <YStack>
          {[...creators].map(creator => (
            <XStack key={creator}>
              <Image
                key={creator}
                source={{ uri: `https://api.cuppazee.app/player/${creator}/avatar` }}
                style={{ height: 32, width: 32, borderRadius: 16 }}
              />
              <Text
                px="$2"
                alignSelf="center"
                fontFamily="$body"
                fontSize="sm"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                w={100}
              >
                {creator}
              </Text>
              {[...types].map(type => {
                const myth = creatorTypeMap.get(`${creator}-${type}`);
                if (!myth) {
                  return <YStack key={type} w={32} h={32} />;
                }
                return (
                  <Popover key={type} placement="bottom-start">
                    <Popover.Trigger>
                      <YStack bc={myth.captured ? "#00ff0022" : "#ff000022"}>
                        <Image
                          source={{ uri: myth.munzee_logo }}
                          style={{
                            height: 32,
                            width: 32,
                            opacity: myth.captured ? 1 : 0.25,
                            transform: [{ scale: myth.captured ? 1 : 0.8 }],
                          }}
                        />
                      </YStack>
                    </Popover.Trigger>
                    <Popover.Content>
                      <YStack>
                        <Text
                          tag="a"
                          className="external-link"
                          href={myth.code}
                          fontFamily="$body"
                          fontWeight="bold"
                        >
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
      )}
    </YStack>
  );
}
