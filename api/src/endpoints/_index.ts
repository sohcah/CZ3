import auth from "./auth/_index";
import player from "./player/_index";
import bouncer from "./bouncer/_index";
import map from "./map/_index";
import database from "./database/_index";
import shadow from "./shadow/_index";
import patches from "./patches/_index";
import misc from "./misc/_index";
import dataexport from "./dataexport/_index";

export default [
  ...auth,
  ...player,
  ...bouncer,
  ...map,
  ...database,
  ...shadow,
  ...patches,
  ...misc,
  ...dataexport,
];