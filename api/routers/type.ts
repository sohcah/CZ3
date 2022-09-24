import { z } from "zod";
import { meta } from "../utils/meta.js";
import Fuse from "fuse.js";
import { authenticateAnonymous } from "../utils/auth/index.js";
import { munzeeFetch } from "../utils/munzee.js";
import { t } from "../trpc.js";

export const typeRouter = t.router({
  suggest: t.procedure
    .input(
      z.object({
        input: z.string(),
      })
    )
    .query(async ({ input: { input } }) => {
      const fuse = new Fuse(meta.types, {
        keys: ["name", "id"],
      });
      return fuse.search(input).map(i => ({
        name: i.item.name,
        value: i.item.humanId,
      }));
    }),
  names: t.procedure
    .input(
      z.object({
        icons: z.string().array(),
      })
    )
    .query(async ({ input: { icons } }) => {
      return {
        names: Object.fromEntries(icons.map(i => [i, meta.get(i)?.name ?? meta.getIconId(i)])),
      };
    }),
  group: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input: { id } }) => {
      const group = meta.getGroup(id);
      if (!group) {
        return null;
      }

      return {
        name: group.name,
        id: group.humanId,
        types: group.types.map(type => ({
          name: type.name,
          id: type.humanId,
        })),
        icon: `https://images.cuppazee.app/types/64/${group.icon}.png`,
      };
    }),
  details: t.procedure
    .input(
      z.object({
        id: z.string(),
        username: z.string().optional(),
      })
    )
    .query(async ({ input: { id, username } }) => {
      const type = meta.get(id);
      if (!type) {
        return null;
      }
      let userUsername = null;
      let captures = null;

      if (username) {
        const token = await authenticateAnonymous();
        const response = await munzeeFetch({
          endpoint: "user",
          params: { username },
          token,
        });
        const data = await response.getMunzeeData();
        if (data.data) {
          userUsername = data.data.username;
          const capturesResponse = await munzeeFetch({
            endpoint: "user/specials",
            params: {
              user_id: data.data.user_id,
            },
            token,
          });
          const capturesData = await capturesResponse.getMunzeeData();
          captures = capturesData.data?.find(i => meta.get(i.logo) === type)?.count ?? null;
        }
      }

      return {
        name: type.name,
        id: type.humanId,
        groups: type.groups.map(group => ({
          name: group.name,
          id: group.humanId,
        })),
        icon: `https://images.cuppazee.app/types/64/${type.humanId}.png`,
        captures,
        username: userUsername,
      };
    }),
});
