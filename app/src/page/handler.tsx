import { ReactNode, useState, createContext, useContext } from "react";
import { Map } from "./map";
import type { MapProps } from "react-map-gl";
import { YStack, XStack, useWindowDimensions, Sheet } from "tamagui";
import { Platform, ScrollView } from "react-native";
import config from "../tamagui.config";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface PageState {
  leftPanel: { children: ReactNode }[];
  rightPanel: { children: ReactNode }[];
  map: (Omit<MapProps, "mapboxAccessToken" | "mapStyle" | "fog" | "light"> & {
    terrain?: NonNullable<MapProps["terrain"]> | undefined;
  })[];
  content: { children: ReactNode; scrollable?: boolean }[];
  meta: { title: string }[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const PageContext = createContext<(func: (state: PageState) => PageState) => void>(() => {});

export function usePageContext() {
  return useContext(PageContext);
}

const defaultState = {
  leftPanel: [],
  rightPanel: [],
  map: [],
  content: [],
  meta: [],
};

export function PageHandler({ children }: { children: ReactNode }) {
  const [pageState, setPageState] = useState<PageState>(defaultState);
  const windowDimensions = useWindowDimensions();
  const map = pageState.map[pageState.map.length - 1];
  const leftPanel =
    windowDimensions.width > 800 ? pageState.leftPanel[pageState.leftPanel.length - 1] : undefined;
  const rightPanel =
    windowDimensions.width > 800
      ? pageState.rightPanel[pageState.rightPanel.length - 1]
      : undefined;
  const bottomPanel =
    windowDimensions.width > 800
      ? undefined
      : pageState.rightPanel[pageState.rightPanel.length - 1] ??
        pageState.leftPanel[pageState.leftPanel.length - 1];
  const content = pageState.content[pageState.content.length - 1];
  const panelPadding = Number(config.tokensParsed.space["$2"]?.val ?? 0);
  const padding = {
    top: 0,
    bottom: 0,
    left: leftPanel ? 300 + 2 * panelPadding : 0,
    right: rightPanel ? 300 + 2 * panelPadding : 0,
  };
  const safeArea = useSafeAreaInsets();
  return (
    <PageContext.Provider value={setPageState}>
      {map && <Map padding={padding} map={map} />}
      <XStack
        pointerEvents={Platform.OS === "web" ? "none" : "box-none"}
        position="absolute"
        top={safeArea.top}
        bottom={safeArea.bottom}
        left={safeArea.left}
        right={safeArea.right}
        p="$2"
        space="$2"
      >
        {leftPanel && (
          <YStack
            pointerEvents="auto"
            borderRadius="$4"
            bc="$backgroundSoft"
            borderWidth={2}
            borderColor="$borderColor"
            p="$2"
            elevation="$4"
            w={300}
          >
            {leftPanel.children}
          </YStack>
        )}
        {content ? (
          <YStack
            pointerEvents="auto"
            borderRadius="$4"
            bc="$backgroundSoft"
            borderWidth={2}
            borderColor="$borderColor"
            elevation="$4"
            flex={1}
          >
            {content.scrollable ?? true ? (
              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                {content.children}
              </ScrollView>
            ) : (
              content.children
            )}
          </YStack>
        ) : (
          <YStack flex={1} pointerEvents="none"></YStack>
        )}
        {rightPanel && (
          <YStack
            pointerEvents="auto"
            borderRadius="$4"
            bc="$backgroundSoft"
            borderWidth={2}
            borderColor="$borderColor"
            p="$2"
            elevation="$4"
            w={300}
          >
            {rightPanel.children}
          </YStack>
        )}
      </XStack>
      {bottomPanel && (
        <Sheet open snapPoints={[85, 50, 15]}>
          <Sheet.Frame
            pointerEvents="auto"
            borderTopLeftRadius="$4"
            borderTopRightRadius="$4"
            bc="$backgroundSoft"
            borderWidth={2}
            borderColor="$borderColor"
            p="$2"
            elevation="$4"
          >
            {bottomPanel.children}
          </Sheet.Frame>
        </Sheet>
      )}
      {children}
    </PageContext.Provider>
  );
}
