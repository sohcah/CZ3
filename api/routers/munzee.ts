import { z } from "zod";
import { meta } from "../utils/meta.js";
import { createRouter } from "./index.js";
import { authenticateAnonymous } from "../utils/auth/index.js";
import { munzeeFetch } from "../utils/munzee.js";

export const munzeeRouter = createRouter().query("details", {
  input: z
    .object({
      munzeeId: z.number(),
    })
    .or(
      z.object({
        username: z.string(),
        code: z.string(),
      })
    ),
  async resolve({ input }) {
    const params =
      "munzeeId" in input
        ? { munzee_id: input.munzeeId }
        : { url: `/m/${input.username}/${input.code}` };

    const token = await authenticateAnonymous();
    const response = await munzeeFetch({
      endpoint: "munzee",
      token,
      params,
    });
    const { data } = await response.getMunzeeData();

    if (!data) {
      return null;
    }

    const type = meta.get(data.pin_icon);
    return {
      name: data.friendly_name,
      id: data.munzee_id,
      url: `https://www.munzee.com${data.url}`,
      creator: {
        username: data.creator_username,
      },
      type: type?.apiOverview,
      icon: meta.getIcon(data.pin_icon),
    };
  },
});
