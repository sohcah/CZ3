import { PageState } from "@/page/handler";
import MapboxGL, { MapView, Camera } from "@rnmapbox/maps";
import { useRef } from "react";

MapboxGL.setAccessToken(
  "pk.eyJ1Ijoic29oY2FoIiwiYSI6ImNqeWVqcm8wdTAxc2MzaXFpa282Yzd2aHEifQ.afYbt2sVMZ-kbwdx5_PekQ"
);

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
  const cameraRef = useRef<Camera>(null);
  return (
    <MapView style={{ flex: 1, height: "100%", width: "100%" }}>
      <Camera
        ref={cameraRef}
        defaultSettings={{ centerCoordinate: [0, 0], zoomLevel: 0 }}
        centerCoordinate={[0, 0]}
        zoomLevel={0}
        padding={{
          paddingTop: padding.top,
          paddingBottom: padding.bottom,
          paddingLeft: padding.left,
          paddingRight: padding.right,
        }}
      />
    </MapView>
  );
}
