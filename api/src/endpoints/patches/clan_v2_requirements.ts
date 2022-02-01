import { FastifyInstance } from "fastify";
import { munzeeFetch } from "../../utils/munzee";

export default function clan_v2_requirements(fastify: FastifyInstance) {
  fastify.post<{
    Body: {
      data: string;
      access_token: string;
    };
  }>("/patches/clan/v2/requirements", async request => {
    const response = await munzeeFetch({
      endpoint: "clan/v2/requirements",
      params: JSON.parse(request.body.data),
      token: request.body.access_token,
    });
    const result = await response.json() as Awaited<ReturnType<typeof response.getMunzeeData>>;

    if (result.data?.data?.levels) {
      if (!Array.isArray(result.data.data.levels)) {
        for (const level of Object.keys(result.data.data.levels).sort()) {
          const levelData = result.data.data.levels[level];
          if (levelData?.individual) {
            levelData.individual = levelData.individual.map(i => {
              const n = Number(i.name.match(/with ([0-9]+),000 Points/i)?.[1]);
              if (Number(i?.task_id) === 38) {
                return {
                  ...i,
                  task_id: n * 1000 + Number(i.task_id),
                };
              }
              return i;
            });
          }
          if (levelData?.group) {
            levelData.group = levelData.group.map(i => {
              const n = Number(i.name.match(/with ([0-9]+),000 Points/i)?.[1]);
              if (Number(i?.task_id) === 38) {
                return {
                  ...i,
                  task_id: n * 1000 + Number(i.task_id),
                };
              }
              return i;
            });
          }
        }
      }
    }

    return { __raw: result };
  });
}
