import auth from "./auth/_index.js";
import player from "./player/_index.js";
import bouncer from "./bouncer/_index.js";
import map from "./map/_index.js";
import database from "./database/_index.js";
import shadow from "./shadow/_index.js";
import patches from "./patches/_index.js";
import misc from "./misc/_index.js";
import dataexport from "./dataexport/_index.js";

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
