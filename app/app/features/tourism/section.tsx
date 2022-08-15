import { H2, YStack } from "@cz3/app_ui";
import { trpc } from "@cz3/app/common/trpc/trpc";
import { useMatch } from "react-router";
import { useState, useEffect } from "react";
import { Layer, Map, Source, useMap } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export function Icons(props: { icons: string[] }) {
  const map = useMap().current!;
  useEffect(() => {
    for (const icon of props.icons) {
      if (!map.hasImage(icon)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.loadImage(icon, (error: any, image: any) => {
          if (error) return;
          map.addImage(icon, image);
        });
      }
    }
  }, [props.icons.join(",")]);
  return null;
}

export function TourismSectionScreen() {
  const { params: { section = null } = {} } = useMatch("/tourism/:section") ?? {};
  const data = trpc.useQuery(
    [
      "tourism:section",
      {
        section: section!,
      },
    ],
    {
      enabled: section != null,
    }
  );

  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 0,
  });

  if (!data.data) {
    return <H2>Tourism - Loading...</H2>;
  }

  return (
    <YStack flexGrow={1}>
      <H2>Tourism - {data.data.section.name}</H2>

      <YStack flex={1}>
        <Map
          style={{
            height: "100%",
            width: "100%",
          }}
          mapboxAccessToken="pk.eyJ1Ijoic29oY2FoIiwiYSI6ImNqeWVqcm8wdTAxc2MzaXFpa282Yzd2aHEifQ.afYbt2sVMZ-kbwdx5_PekQ"
          mapStyle="mapbox://styles/mapbox/streets-v11"
          // projection="globe"
          fog={{}}
          light={{}}
          {...viewport}
          onMove={ev => {
            setViewport(ev.viewState);
          }}
          interactiveLayerIds={["tourism"]}
          onClick={ev => {
            const properties = ev.features?.[0]?.properties;
            if (properties) {
              window.location.href = properties.url;
            }
          }}
        >
          <Icons icons={[...new Set(data.data.items.map(i => i.icon))]} />
          <Source
            id="tourism"
            type="geojson"
            data={{
              type: "FeatureCollection",
              features: data.data.items.map(f => ({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [f.longitude, f.latitude],
                },
                properties: f,
              })),
            }}
          >
            <Layer
              id="tourism"
              type="symbol"
              layout={{
                "icon-image": ["get", "icon"],
                "icon-size": 0.8,
                "icon-allow-overlap": true,
                "icon-anchor": "bottom",
              }}
              interactive
            />
          </Source>
        </Map>
      </YStack>
    </YStack>
  );
}
