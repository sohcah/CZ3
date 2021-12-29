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
    const result = await response.json();

    if (result.data?.data?.levels) {
      for (const level of Object.keys(result.data.data.levels).sort()) {
        const levelData = result.data.data.levels[level];
        if (levelData?.individual) {
          levelData.individual = levelData.individual.map((i: any) => {
            if (Number(i?.task_id) === 38) {
              return {
                ...i,
                task_id: (Math.min(Number(level), 4) + 1) * 1000 + Number(i.task_id),
              };
            }
            return i;
          })
        }
        if (levelData?.group) {
          levelData.group = levelData.group.map((i: any) => {
            if (Number(i?.task_id) === 38) {
              return {
                ...i,
                task_id: (Math.min(Number(level), 4) + 1) * 1000 + Number(i.task_id),
              };
            }
            return i;
          });
        }
      }
    }
    
    return {__raw: result};
  });
}
