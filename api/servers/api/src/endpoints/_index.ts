import auth from "./auth/_index";
import user from "./user/_index";
import bouncer from "./bouncer/_index";
import map from "./map/_index";

export default [...auth, ...user, ...bouncer, ...map];