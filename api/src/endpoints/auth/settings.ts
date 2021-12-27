import { FastifyInstance } from "fastify";
import { APIError } from "../../api";
// import { verifyJwtToken } from "../../utils/auth";
// import mongo from "../../utils/mongo";

export interface UserSettingsUser {
  user_id: number;
  username: string;
}
export interface UserSettingsClan {
  clan_id: number;
  name: string;
  tagline: string;
}

export interface UserSettings {
  users: UserSettingsUser[];
  clans: UserSettingsClan[];
  rootCategories: string[];
  colours: { [name: string]: string };
}

export default function AuthSettings(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: {
      token?: string;
    };
  }>("/auth/settings/get", async (request, reply) => {
    if (!request.query.token) {
      throw APIError.InvalidRequest();
    }
    // const { user_id } = await verifyJwtToken(request.query.token);
    // const settings = await mongo()
    //   .collection<Partial<UserSettings> & { _id: unknown; user_id: unknown }>("user_settings")
    //   .findOne({ user_id: Number(user_id) });
    const settings = null;
    const {
      _id: _1,
      user_id: _2,
      ...s
    } = (settings ?? {}) as Partial<UserSettings> & { _id: unknown; user_id: unknown };
    const validSettings: UserSettings = {
      users: [],
      clans: [],
      rootCategories: [],
      ...s,
      colours: {
        "clan-level-6": "#0cf4af",
        "clan-level-5": "#55f40b",
        "clan-level-4": "#bfe913",
        "clan-level-3": "#fcd302",
        "clan-level-2": "#fa9102",
        "clan-level-1": "#ef6500",
        "clan-level-0": "#eb0000",
        ...(s.colours ?? {}),
      },
    };
    return validSettings;
  });
}
