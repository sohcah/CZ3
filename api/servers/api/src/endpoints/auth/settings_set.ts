import { FastifyInstance } from "fastify";
import { APIError } from "../../api";
import { verifyJwtToken } from "../../utils/auth";
import mongo from "../../utils/mongo";

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

export default function AuthSettingsSet(fastify: FastifyInstance) {
  fastify.post<{
    Querystring: {
      token?: string;
    };
    Body: string
  }>("/auth/settings/set", async (request, reply) => {
    console.log(request);
    let body: { settings?: string };
    try {
      body = JSON.parse(request.body);
    } catch {
      throw APIError.InvalidRequest();
    }
    if (!request.query.token || !body.settings) {
      throw APIError.InvalidRequest();
    }
    const { user_id } = await verifyJwtToken(request.query.token);
    await mongo()
      .collection<Partial<UserSettings> & { _id: unknown; user_id: unknown }>("user_settings")
      .updateOne({ user_id: Number(user_id) }, { $set: { ...JSON.parse(body.settings), user_id: Number(user_id) } });
    return true;
  });
}
