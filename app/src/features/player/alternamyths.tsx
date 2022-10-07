import { H2, Text, YStack, XStack, Popover, Image } from "tamagui";
import { trpc } from "@/common/trpc/trpc";
import { useMatch } from "react-router";
import { ScrollView } from "react-native";
import { captureGridSettings } from "@/settings/captureGrids";
import { SettingPanels } from "@/features/settings/editor";
import { Page } from "@/page/page";

export function PlayerAlternamythsScreen() {
  const { params: { player = null } = {} } = useMatch("/player/:player/*") ?? {};
  const query = trpc.player.alternamyth.captures.useQuery(
    {
      username: player!,
    },
    {
      enabled: player !== null,
    }
  );

  const groupBy = captureGridSettings.useGroupBy();
  const layout = captureGridSettings.useLayout();

  if (!query.data) {
    return (
      <Page.Content>
        <H2>AlternaMyth Captures - Loading...</H2>
      </Page.Content>
    );
  }

  const creators = new Set(query.data.alternaMyths.map(i => i.creator));
  const types = new Set(query.data.alternaMyths.map(i => i.munzee_logo));
  const creatorTypeMap = new Map<string, typeof query.data.alternaMyths[number]>();

  for (const myth of query.data.alternaMyths) {
    creatorTypeMap.set(`${myth.creator}-${myth.munzee_logo}`, myth);
  }

  if (layout === "cards") {
    return (
      <Page.Content>
        <H2>AlternaMyth Captures</H2>
        {groupBy === "type" ? (
          <XStack w="100%" flexWrap="wrap">
            {[...types].map(type => (
              <YStack
                bc="$backgroundSoft"
                borderWidth={2}
                borderColor="$borderColor"
                borderRadius="$4"
                elevation="$4"
                p="$2"
                space="$2"
                m="$2"
                width={400}
                maxWidth="100%"
                flexGrow={1}
                key={type}
              >
                <XStack alignItems="center" space="$2">
                  <Image src={type} height={32} width={32} />
                  <Text fontFamily="$body" fontWeight="bold">
                    {type.slice(49, -4)}
                  </Text>
                </XStack>
                <XStack flexWrap="wrap">
                  {[...creators].map(creator => {
                    const myth = creatorTypeMap.get(`${creator}-${type}`);
                    if (!myth) {
                      return null;
                    }
                    return (
                      <Popover key={creator} placement="bottom-start">
                        <Popover.Trigger>
                          <YStack
                            p="$1"
                            m="$1"
                            borderRadius={1000}
                            bc={myth.captured ? "#00ff0022" : "#ff000022"}
                          >
                            <Image
                              src={`https://api.cuppazee.app/player/${creator}/avatar`}
                              height={32}
                              width={32}
                              borderRadius={16}
                              opacity={myth.captured ? 1 : 0.25}
                              scale={myth.captured ? 1 : 0.8}
                              overflow="hidden"
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
              </YStack>
            ))}
          </XStack>
        ) : (
          <XStack w="100%" flexWrap="wrap">
            {[...creators].map(creator => (
              <YStack
                bc="$backgroundSoft"
                borderWidth={2}
                borderColor="$borderColor"
                borderRadius="$4"
                elevation="$4"
                p="$2"
                space="$2"
                m="$2"
                width={400}
                maxWidth="100%"
                flexGrow={1}
                key={creator}
              >
                <XStack alignItems="center" space="$2">
                  <Image
                    src={`https://api.cuppazee.app/player/${creator}/avatar`}
                    height={32}
                    width={32}
                    borderRadius={16}
                    overflow="hidden"
                  />
                  <Text fontFamily="$body" fontWeight="bold">
                    {creator}
                  </Text>
                </XStack>
                <XStack flexWrap="wrap">
                  {[...types].map(type => {
                    const myth = creatorTypeMap.get(`${creator}-${type}`);
                    if (!myth) {
                      return null;
                    }
                    return (
                      <Popover key={type} placement="bottom-start">
                        <Popover.Trigger>
                          <YStack
                            p="$1"
                            m="$1"
                            borderRadius={1000}
                            bc={myth.captured ? "#00ff0022" : "#ff000022"}
                          >
                            <Image
                              src={type}
                              height={32}
                              width={32}
                              opacity={myth.captured ? 1 : 0.25}
                              scale={myth.captured ? 1 : 0.8}
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
              </YStack>
            ))}
          </XStack>
        )}
        <SettingPanels settings={[captureGridSettings.groupBy, captureGridSettings.layout]} />
      </Page.Content>
    );
  }

  const MainStack = groupBy === "player" ? YStack : XStack;
  const SecondaryStack = groupBy === "player" ? XStack : YStack;

  return (
    <Page.Content>
      <H2>AlternaMyth Captures</H2>
      <ScrollView horizontal>
        <MainStack>
          {[...creators].map(creator => (
            <SecondaryStack key={creator}>
              <YStack
                animation="bouncy"
                hoverStyle={{
                  rotateY: "180deg",
                }}
              >
                <Image
                  key={creator}
                  src={`https://api.cuppazee.app/player/${creator}/avatar`}
                  height={32}
                  width={32}
                  borderRadius={16}
                  overflow="hidden"
                />
              </YStack>
              {groupBy === "player" && (
                <Text
                  px="$2"
                  alignSelf="center"
                  fontFamily="$body"
                  fontSize="$3"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  w={100}
                >
                  {creator}
                </Text>
              )}
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
                          src={myth.munzee_logo}
                          height={32}
                          width={32}
                          opacity={myth.captured ? 1 : 0.25}
                          scale={myth.captured ? 1 : 0.8}
                        />
                      </YStack>
                    </Popover.Trigger>
                    <Popover.Content
                      enterStyle={{ x: 0, y: -10, o: 0 }}
                      exitStyle={{ x: 0, y: -10, o: 0 }}
                      x={0}
                      y={0}
                      o={1}
                      animation="bouncy"
                      elevate
                    >
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
            </SecondaryStack>
          ))}
        </MainStack>
      </ScrollView>
      <SettingPanels settings={[captureGridSettings.groupBy, captureGridSettings.layout]} />
    </Page.Content>
  );
}
