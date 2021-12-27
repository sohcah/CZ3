import { Group } from "../groups";
import { Type, TypeTags } from "../types";

export const CardGroup = new Group({name: "Cards"})

export class CardType extends Type {
    override template() {
        super.template();
        return this.virtual().addTag(TypeTags.Card).addGroup(CardGroup);
    }
}