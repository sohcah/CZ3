import { PluginMeta } from "../../base";

export const meta: PluginMeta = {
  name: "Better Coordinate Insert",
  id: "coordinateinsert",
  urls: ["*/munzee.com/m/*/*/admin/map/", "*/www.munzee.com/m/*/*/admin/map/"],
  credit: "Originally by CzPeet",
  defaultOn: true,
};

export async function afterLoad() {
  const latitudeInput = document.querySelector<HTMLInputElement>("#latitude");
  const longitudeInput = document.querySelector<HTMLInputElement>("#longitude");
  if (latitudeInput && longitudeInput) {
    latitudeInput.addEventListener(
      "keyup",
      () => {
        const coordinates = latitudeInput.value.split(`\t`);
        if (coordinates.length === 2) {
          latitudeInput.value = coordinates[0];
          longitudeInput.value = coordinates[1];
          (latitudeInput.parentElement?.parentElement?.children[3] as HTMLButtonElement)?.click?.();
        }
      },
      false
    );
  }
}
