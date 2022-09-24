import dayjs from "dayjs";
import { z } from "zod";
import {
  authenticateAnonymous,
  authenticatedUser,
  authenticateWithCuppaZeeToken,
  authenticateWithUserID,
} from "../utils/auth/index.js";
import { getPlayerActivity, getPlayerActivityOverview } from "../utils/data/activity.js";
import { munzeeFetch } from "../utils/munzee.js";
import { alternamythRouter } from "./player/alternamyth.js";
import { t } from "../trpc.js";

export const playerRouter = t.router({
  activity: t.procedure
    .input(
      z.object({
        userId: z.number(),
        date: z.string().optional(),
      })
    )
    .query(async ({ input: { userId, date } }) => {
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
    }),
  profile: t.procedure
    .input(
      z
        .object({
          username: z.string(),
        })
        .or(
          z.object({
            userId: z.number(),
          })
        )
        .or(
          z.object({
            cuppazeeToken: z.string(),
          })
        )
    )
    .query(async ({ ctx, input }) => {
      const token =
        "cuppazeeToken" in input
          ? await authenticateWithCuppaZeeToken(input.cuppazeeToken)
          : await authenticateAnonymous();
      const response = await munzeeFetch({
        endpoint: "user",
        params:
          "cuppazeeToken" in input
            ? { user_id: (await authenticatedUser(token))! }
            : "userId" in input
            ? { user_id: input.userId }
            : { username: input.username },
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
        premium: !!data.data.premium,
        mhq: data.data.titles.includes("MHQ"),
        id: data.data.user_id,
      };
    }),
  alternamyth: alternamythRouter,
});
