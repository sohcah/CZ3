import { MunzeeSpecial, MunzeeSpecialBouncer } from "@cuppazee/api/munzee/specials";
import { FastifyInstance } from "fastify";
import { APIError } from "../../api";
import { getBouncers } from "../../utils/bouncers";

function logo(special: MunzeeSpecial | MunzeeSpecialBouncer): string {
  if ("logo" in special) {
    return special.logo || "https://munzee.global.ssl.fastly.net/images/pins/undefined.png";
  } else {
    return (
      special.mythological_munzee.munzee_logo ||
      "https://munzee.global.ssl.fastly.net/images/pins/undefined.png"
    );
  }
}

export default function BouncerList(fastify: FastifyInstance) {
  fastify.get < {
    Params: { types: string }
  }>("/v1/bouncer/list/:types", async request => {
    request.deprecated();
    if (!request.params.types) {
      throw APIError.InvalidRequest();
    }
    const bouncers = await getBouncers();
    var output = bouncers
      .filter(i => request.params.types!.split(",").includes(logo(i).slice(49, -4)))
      .map(i => [
        Number(i.latitude),
        Number(i.longitude),
        request.params.types!.split(",").indexOf(logo(i).slice(49, -4)),
        Number(i.munzee_id),
      ]);
    return {
      list: request.params.types!.split(","),
      keys: ["latitude", "longitude", "logo", "munzee_id"],
      data: output,
    };
  });
}
