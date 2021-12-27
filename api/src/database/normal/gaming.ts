import { Group } from "../groups";
import { ScatterType, Type, TypeSet, TypeTags } from "../types";

export const GamingGroup = new Group({ name: "Gaming" });

export class GamingType extends Type {
  override template(): this {
    super.template();
    return this.setGroup([GamingGroup]).addTag(TypeTags.TypeGaming);
  }
}

export class GamingScatterType extends ScatterType {
  override template(): this {
    super.template();
    return this.setGroup([GamingGroup]).addTag(TypeTags.TypeGaming);
  }
}

// [Gaming] Misc
export const surprise = new GamingType("Surprise", 400).virtual();
export const prizeWheel = new GamingType("Prize Wheel", 401).physical();
export const rps = new GamingType("Rock Paper Scissors", 522).physical();
export const bowling = new GamingType("Bowling Ball", 1643).physical();
export const urbanFit = new GamingType("Urban Fit", 1824).physical();
export const sirPrizeWheel = new GamingType("Sir Prize Wheel", 2412).virtual();

// [Gaming] Scatter
export const scatter = new GamingType("Scatter", 500).physical();

// [Gaming] Joysticks
export const joystickVirtualScatters = new TypeSet()
  .add(new GamingScatterType("Gold Coin", 2004).standalone())
  .add(new GamingScatterType("Fly", 2006).standalone())
  .add(new GamingScatterType("Ghostzee", 2008).standalone());

export const joystickPhysicalScatters = new TypeSet()
  .add(new GamingScatterType("Runzee Rob", 2003).physical())
  .add(new GamingScatterType("Leap Frog", 2005).physical())
  .add(new GamingScatterType("Munch-Man", 2007).physical())
  .each(i => i.scattererScatters(joystickVirtualScatters));

export const joystickVirtual = new GamingType("Joystick Virtual", 2002)
  .virtual()
  .scattererScatters(joystickPhysicalScatters);
export const joystickPhysical = new GamingType("Joystick Physical", 1976)
  .physical()
  .addIcon("joystick")
  .scattererScatters(joystickPhysicalScatters);

// [Gaming] Chess
export const mapleChestSet = new GamingType("Maple Chess Set").virtual();
export const walnutChestSet = new GamingType("Walnut Chess Set").virtual();
