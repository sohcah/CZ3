import { Group } from "../groups";
import { Type, TypeTags } from "../types";

export const PlacesGroup = new Group({ name: "Places" });

export class PlacesType extends Type {
  override template(): this {
    super.template();
    return this.setGroup([PlacesGroup]).addTag(TypeTags.TypePOI).virtual();
  }
}

export const poiAirport = new PlacesType("POI Airport", 782);
export const poiSports = new PlacesType("POI Sports", 783);
export const poiUniversity = new PlacesType("POI University", 784);
export const poiMuseum = new PlacesType("POI Museum", 786);
export const poiWildlife = new PlacesType("POI Wildlife", 787);
export const poiHistoricalPlace = new PlacesType("POI Historical Place", 1339);
export const poiLibrary = new PlacesType("POI Library", 1340);
export const poiFirstResponders = new PlacesType("POI First Responders", 1341);
export const poiFaithPlace = new PlacesType("POI Faith Place", 1342);
export const poiHospital = new PlacesType("POI Hospital", 1486);
export const poiPostOffice = new PlacesType("POI Post Office", 1487);
export const poiCemetery = new PlacesType("POI Cemetery", 1488);
export const poiUniqueAttraction = new PlacesType("POI Unique Attraction", 1551);
export const poiVirtualGarden = new PlacesType("POI Virtual Garden", 1631);
export const poiCinema = new PlacesType("POI Cinema", 1770);
export const poiTransportation = new PlacesType("POI Transportation", 1977);
export const poiPlayPark = new PlacesType("POI Play Park", 1978);
export const poiBank = new PlacesType("POI Bank", 2445);
export const poiBeach = new PlacesType("POI Beach", 2446);
export const poiCampground = new PlacesType("POI Campground", 2447);
export const poiGolf = new PlacesType("POI Golf", 2448);
export const poiDrinkDepot = new PlacesType("POI Drink Depot", 2690);
export const poiPet = new PlacesType("POI Pet", 3049);
export const poiEntertainment = new PlacesType("POI Entertainment", 3050);
