import { trpc } from "@/common/trpc/trpc";
import { useMatch } from "react-router";
import { useState, useEffect } from "react";
import { Layer, Source, useMap } from "react-map-gl";
import { Page } from "@/page/page";
import { MunzeeDetailsPanel } from "../shared/munzeeDetails";

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
  const data = trpc.tourism.section.useQuery(
    {
      section: section!,
    },
    {
      enabled: section != null,
    }
  );
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Page>
      <Page.Map
        interactiveLayerIds={["tourism"]}
        onClick={ev => {
          const properties = ev.features?.[0]?.properties;
          if (properties) {
            setSelected(c => (c === properties.id ? null : properties.id));
          }
        }}
      >
        <Icons icons={[...new Set(data.data?.items.map(i => i.icon) ?? [])]} />
        <Source
          id="tourism"
          type="geojson"
          data={{
            type: "FeatureCollection",
            features:
              data.data?.items.map(f => ({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [f.longitude, f.latitude],
                },
                properties: f,
              })) ?? [],
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
      </Page.Map>
      {!!selected && (
        <Page.RightPanel>
          <MunzeeDetailsPanel munzeeId={selected} />
        </Page.RightPanel>
      )}
    </Page>
  );
}
