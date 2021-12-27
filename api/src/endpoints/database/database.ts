import { FastifyInstance } from "fastify";
import { database } from "../../database";

export default function Database(fastify: FastifyInstance) {
  // fastify.get("/database", async () => {
  //   return {
  //     types: database.types.types.map(i => i.toJSON()),
  //   };
  // });
  fastify.get("/database" ,async (_, response) => {
    // response.send({
    //   types: database.types.types.map(i => i.toCZD()).join("|"),
    // });
    // return {__raw: }
    response.send(database.types.types.map(i => i.toCZD()).join("\n"));
  });
}
