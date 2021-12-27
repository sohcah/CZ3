import { Group } from "../groups";
import { Type, TypeTags } from "../types";

export const FlatGroup = new Group({ name: "Flats" });

export class FlatType extends Type {
  override template(): this {
    super.template();
    return this.addGroup(FlatGroup).addTag(TypeTags.TypeFlat).virtual();
  }
}

export const flatRob = new FlatType("Flat Rob", 353);
export const flatMatt = new FlatType("Flat Matt", 1015);
export const flatLou = new FlatType("Flat Lou", 1338);
export const flatHammock = new FlatType("Flat Hammock", 1581);
export const flatDHS = new FlatType("Flat DHS", 2903);
export const flatDiscGolfBasket = new FlatType("Flat Disc Golf Basket", 2904);
export const flatFlashlight = new FlatType("Flat Flashlight");
export const flatTypewriter = new FlatType("Flat Typewriter");
