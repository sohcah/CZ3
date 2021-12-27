import { Group } from "../groups";
import { Type, TypeTags } from "../types";

export class JewelType extends Type {
  override template(): this {
    super.template();
    return this.setGroup([jewelsGroup]).addTag(TypeTags.TypeJewel);
  }
}

export const jewelsGroup = new Group({ name: "Jewels" });

export const diamond = new JewelType("Diamond", 40).physical()
export const ruby = new JewelType("Ruby", 131).physical()
export const emerald = new JewelType("Virtual Emerald", 148).virtual().addIcons("emerald", "virtual_emerald")
export const aquamarine = new JewelType("Aquamarine", 218).physical().addIcon("aquamarinemunzee")
export const topaz = new JewelType("Topaz", 242).physical()
export const amethyst = new JewelType("Virtual Amethyst", 290).addIcons("virtual_amethyst", "amethyst").virtual()
export const pinkDiamond = new JewelType("Pink Diamond", 584).physical()
export const sapphire = new JewelType("Virtual Sapphire", 681).addIcons("virtual_sapphire", "sapphire").virtual()
export const citrine = new JewelType("Virtual Citrine", 2361).addIcons("virtual_citrine", "citrine").virtual()
export const onyx = new JewelType("Virtual Onyx", 2362).addIcons("virtual_onyx", "onyx").virtual()
