import { PageState } from "@/page/handler";
import { mapSettings } from "@/settings/map";
import { useMemo, useRef } from "react";
import { Map as MapView, MapRef } from "react-map-gl";
import { Button, XGroup, YGroup, YStack } from "tamagui";
import { Globe, Minus, Plus, Map as MapIcon } from "@tamagui/feather-icons";

export function Map({
  padding,
  map,
}: {
  map: PageState["map"][number];
  padding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}) {
  const [mapProjection, , setMapProjection] = mapSettings.useWriteableProjection();
  const mapRef = useRef<MapRef>(null);
  const id = useMemo(() => `${Math.floor(Math.random() * 100000)}`, []);
  return (
    <YStack className={`map-${id}`} flex={1}>
      <MapView
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
      <YStack
        alignItems="flex-end"
        position="absolute"
        bottom={20}
        paddingBottom="$2"
        right="$2"
        space="$2"
      >
        <YGroup>
          <Button onPress={() => mapRef.current?.zoomIn()} size="$3" scaleIcon={1.5} icon={Plus} />
          <Button
            onPress={() => mapRef.current?.zoomOut()}
            size="$3"
            scaleIcon={1.5}
            icon={Minus}
          />
        </YGroup>
        <XGroup>
          <Button
            theme={mapProjection === "globe" ? "active" : undefined}
            onPress={() => setMapProjection("globe")}
            size="$3"
          >
            <Globe />
          </Button>
          <Button
            theme={mapProjection === "mercator" ? "active" : undefined}
            onPress={() => setMapProjection("mercator")}
            size="$3"
          >
            <MapIcon />
          </Button>
        </XGroup>
      </YStack>
    </YStack>
  );
}
