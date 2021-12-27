import { Group } from "../groups";
import { TypeTags } from "../types";
import { CardType } from "./index";

export const OpenCardGroup = new Group({ name: "Open Cards" });

export class OpenCardType extends CardType {
  override template(): this {
    super.template();
    return this.setGroup([OpenCardGroup]).addTag(TypeTags.CardOpen);
  }
}

export const getWellCard = new OpenCardType("Get Well Card", 2421);
export const birthdayCard = new OpenCardType("Birthday Card", 2420);
export const thankYouCard = new OpenCardType("Thank You Card", 2432);
export const howdyCard = new OpenCardType("Howdy Card", 2450);
export const congratsCard = new OpenCardType("Congrats Card", 2495);
export const sorryCard = new OpenCardType("Sorry Card", 2496);
export const sorryCard1 = new OpenCardType("Sorry Card 1", 2497);
export const sorryCard2 = new OpenCardType("Sorry Card 2", 2498);
export const sorryCard3 = new OpenCardType("Sorry Card 3", 2499);
export const summerCard = new OpenCardType("Summer Card", 2532);
export const winterCard = new OpenCardType("Winter Card", 2533);
export const eventCard = new OpenCardType("Event Card", 2542);
export const fallCard = new OpenCardType("Fall Card", 2602);
export const springCard = new OpenCardType("Spring Card", 2601);
export const techIssuesCard = new OpenCardType("Tech Issues Card", 2622);
