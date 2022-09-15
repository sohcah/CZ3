import { ReactNode, useState, createContext, useContext, useRef, useMemo, useEffect } from "react";
import { Map, MapProps, MapRef } from "react-map-gl";
import { YStack, XGroup, Button, YGroup, XStack } from "tamagui";
import { Globe, Map as MapIcon, Minus, Plus } from "@tamagui/feather-icons";
import { mapSettings } from "@/settings/map";
import { Platform } from "react-native";
import config from "../tamagui.config";

export interface PageState {
  leftPanel: { children: ReactNode }[];
  rightPanel: { children: ReactNode }[];
  map: (Omit<MapProps, "mapboxAccessToken" | "mapStyle" | "fog" | "light"> & {
    terrain?: NonNullable<MapProps["terrain"]> | undefined;
  })[];
  content: { children: ReactNode }[];
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
};

export function PageHandler({ children }: { children: ReactNode }) {
  const [pageState, setPageState] = useState<PageState>(defaultState);
  const [mapProjection, , setMapProjection] = mapSettings.useWriteableProjection();
  const map = pageState.map[pageState.map.length - 1];
  const leftPanel = pageState.leftPanel[pageState.leftPanel.length - 1];
  const rightPanel = pageState.rightPanel[pageState.rightPanel.length - 1];
  const id = useMemo(() => `${Math.floor(Math.random() * 100000)}`, []);
  const panelPadding = Number(config.tokensParsed.space["$2"]?.val ?? 0);
  const mapRef = useRef<MapRef>(null);
  const padding = {
    top: 0,
    bottom: 0,
    left: leftPanel ? 300 + 2 * panelPadding : 0,
    right: rightPanel ? 300 + 2 * panelPadding : 0,
  };
  useEffect(() => {
    mapRef.current?.easeTo({
      padding,
      duration: 500,
    });
  }, [map, padding.top, padding.bottom, padding.left, padding.right]);
  return (
    <PageContext.Provider value={setPageState}>
      {map && (
        <YStack className={`map-${id}`} flex={1}>
          {Platform.OS === "web" && (
            <style>
              {`
              .map-${id} .mapboxgl-ctrl-bottom-left, .map-${id} .mapboxgl-ctrl-top-left {
                left: ${padding.left}px;
              }
              .map-${id} .mapboxgl-ctrl-bottom-right, .map-${id} .mapboxgl-ctrl-top-right {
                right: ${padding.right}px;
              }
              .map-${id} .mapboxgl-ctrl-bottom-left, .map-${id} .mapboxgl-ctrl-bottom-right {
                bottom: ${padding.bottom}px;
              }
              .map-${id} .mapboxgl-ctrl-top-left, .map-${id} .mapboxgl-ctrl-top-right {
                top: ${padding.top}px;
              }
              `}
            </style>
          )}
          <Map
            ref={mapRef}
            initialViewState={{
              padding,
            }}
            style={{
              flex: 1,
              height: "100%",
              width: "100%",
            }}
            mapboxAccessToken="pk.eyJ1Ijoic29oY2FoIiwiYSI6ImNqeWVqcm8wdTAxc2MzaXFpa282Yzd2aHEifQ.afYbt2sVMZ-kbwdx5_PekQ"
            mapStyle="mapbox://styles/mapbox/streets-v11"
            fog={{}}
            light={{}}
            projection={mapProjection}
            {...map}
          />
          <YStack
            alignItems="flex-end"
            position="absolute"
            bottom={20}
            paddingBottom="$2"
            right="$2"
            space="$2"
          >
            <YGroup>
              <Button
                onPress={() => mapRef.current?.zoomIn()}
                size="$3"
                scaleIcon={1.5}
                icon={Plus}
              />
              <Button
                onPress={() => mapRef.current?.zoomOut()}
                size="$3"
                scaleIcon={1.5}
                icon={Minus}
              />
            </YGroup>
            <XGroup>
              <Button
                theme={mapProjection === "globe" ? "alt3" : undefined}
                onPress={() => setMapProjection("globe")}
                size="$3"
              >
                <Globe />
              </Button>
              <Button
                theme={mapProjection === "mercator" ? "alt3" : undefined}
                onPress={() => setMapProjection("mercator")}
                size="$3"
              >
                <MapIcon />
              </Button>
            </XGroup>
          </YStack>
        </YStack>
      )}
      {leftPanel && (
        <YStack
          display="none"
          $gtMd={{
            display: "flex",
          }}
          position="absolute"
          top="$2"
          bottom="$2"
          left="$2"
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
      <YStack
        display="none"
        $gtMd={{
          display: "flex",
        }}
        position="absolute"
        top="$2"
        bottom="$2"
        right={rightPanel ? "$2" : -400}
        borderRadius="$4"
        bc="$backgroundSoft"
        borderWidth={2}
        borderColor="$borderColor"
        p="$2"
        elevation="$4"
        // animation="quick"
        // animation={[["transform"]]}
        w={300}
      >
        {rightPanel?.children}
      </YStack>
      {children}
    </PageContext.Provider>
  );
}
