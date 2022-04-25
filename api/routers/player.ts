import dayjs from "dayjs";
import { z } from "zod";
import { authenticateAnonymous, authenticateWithUserID } from "../utils/auth/index.js";
import { getPlayerActivity, getPlayerActivityOverview } from "../utils/data/activity.js";
import { munzeeFetch } from "../utils/munzee.js";
import { createRouter } from "./index.js";

export const playerRouter = createRouter()
  .query("activity", {
    input: z.object({
      userId: z.number(),
      date: z.string().optional(),
    }),
    async resolve({ input: { userId, date } }) {
      const token = await authenticateWithUserID(userId);
      const response = await munzeeFetch({
        endpoint: "statzee/player/day",
        params: { day: date ?? dayjs.mhqNow().format("YYYY-MM-DD") },
        token,
      });
      const data = await response.getMunzeeData();

      const activity = getPlayerActivity("sohcah", data.data);
      const overview = getPlayerActivityOverview(activity);

      return {
        activity,
        overview,
      };
    },
  })
  .query("profile", {
    input: z
      .object({
        username: z.string(),
      })
      .or(
        z.object({
          userId: z.number(),
        })
      ),
    async resolve({ input }) {
      const token = await authenticateAnonymous();
      const response = await munzeeFetch({
        endpoint: "user",
        params: "userId" in input ? { user_id: input.userId } : { username: input.username },
        token,
      });
      const data = await response.getMunzeeData();

      if (!data.data) {
        return null;
      }

      return {
        username: data.data.username,
        titles: data.data.titles,
        avatar: data.data.avatar,
        start: new Date(data.data.join_time),
        clan: data.data.clan
          ? {
              name: data.data.clan.name,
              id: data.data.clan.id,
            }
          : null,
      };
    },
  });
