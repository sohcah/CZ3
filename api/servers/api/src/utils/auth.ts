import fetch from "node-fetch";
import { URLSearchParams } from "url";
import { APIError } from "../api";
import config from "./config";
import mongo, { Counter } from "./mongo";
import { munzeeFetch } from "./munzee";
import Jwt from "jsonwebtoken";

export interface APIApplication {
  name: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  discord?: string;
}

export interface DeviceDetails {
  app: "express" | "max" | "create" | "browse";
  platform: "ios" | "android" | "web";
}

export async function loginWithAuthorizationCode(
  application: APIApplication,
  authorizationCode: string,
  device: DeviceDetails
) {
  if (!["express","max"].includes(device.app) || !application) {
    throw APIError.InvalidRequest();
  }

  const response = await fetch("https://api.munzee.com/oauth/login", {
    method: "POST",
    body: new URLSearchParams({
      client_id: application.client_id,
      client_secret: application.client_secret,
      grant_type: "authorization_code",
      code: authorizationCode,
      redirect_uri: application.redirect_uri,
    }),
    headers: {
      "User-Agent": "@cuppazee/api-server (+https://github.com/CuppaZee/CuppaZee)",
    },
  });

  const data = await response.getMunzeeData();

  if (!data.data?.token?.access_token) {
    throw APIError.Authentication();
  }

  const userRequest = await munzeeFetch({
    endpoint: "user",
    params: {
      user_id: data.data.user_id,
    },
    token: data.data.token.access_token,
  });

  const userData = await userRequest.getMunzeeData();

  console.log(userData);

  const { username, user_id } = userData.data ?? {};

  if (!username) {
    throw APIError.MunzeeInvalid();
  }

  const authDocument = await mongo()
    .collection("auth")
    .findOne({ application: application.name, user_id: user_id });

  let userNumber = authDocument?.user_number;
  let userCount: number;

  if (authDocument) {
    userCount = (
      await mongo().collection<Counter>("counters").findOne({ id: "auth_" + application.name })
    ).value;
    await mongo().collection("auth").updateOne(
      {
        application: application.name,
        user_id: user_id,
      },
      {
        $set: {
          application: application.name,
          token: data.data.token,
          user_id,
          username,
          [device.app]: true,
        },
      }
    );
  } else {
    const count = await mongo()
      .collection("counters")
      .findOneAndUpdate({ id: "auth_" + application.name }, { $inc: { value: 1 } });
    userNumber = (count.value?.value ?? -2) + 1;
    userCount = userNumber;
    await mongo().collection("auth").insertOne({
      application: application.name,
      token: data.data.token,
      user_id,
      username,
      [device.app]: true,
      user_number: userNumber,
    });
  }

  // Send Discord Message
  const platform =
    {
      android: "🤖",
      ios: "🍎",
      web: "🌐",
    }[device.platform] || `[${device.platform}] `;
  const app = {
    express: "🔵",
    max: "🟢",
    create: "🟣",
    browse: "🟡",
  }[device.app];
  const isNew = !authDocument?.[device.app];
  let discordmessage;
  if (authDocument) {
    discordmessage = `${app}${platform}🔁 ${username} | ${userCount} Users [#${userNumber}]${
      isNew ? ` | New to ${device.app}` : ""
    }`;
  } else {
    discordmessage = `${app}${platform}🆕 ${username} | User #${userNumber} | New to CuppaZee`;
  }

  if (application.discord) {
    await fetch(application.discord, {
      method: "POST",
      body: new URLSearchParams({
        content: discordmessage,
      }),
    });
  }


  const token = Jwt.sign({
    user_id,
    created_at: Date.now(),
  }, config.jwtSecret);

  return token;
}

export interface AuthenticationResult {

}

export async function authenticateWithCuppaZeeToken(cuppazeeToken: string, application: APIApplication = config.applications.scan) {
  const jwtParse = Jwt.verify(cuppazeeToken, config.jwtSecret);
  if (!jwtParse) {
    throw APIError.InvalidRequest();
  }
  let jwtData;
  try {
    jwtData = typeof jwtParse === "object" ? (jwtParse as any) : JSON.parse(jwtParse.toString());
  } catch {
    throw APIError.InvalidRequest();
  }
  
  return await authenticateWithUserID(jwtData.user_id, application);
}

export async function authenticateWithUserID(
  user_id: string | number,
  application: APIApplication = config.applications.scan
) {
  const authDocument = await mongo()
    .collection("auth")
    .findOne({ application: application.name, user_id: Number(user_id) });

  if (!authDocument) {
    throw APIError.Authentication("Couldn't find authentication for this user.");
  }

  if (authDocument.token.expires * 1000 > Date.now() + 1800000) {
    const { refresh_token: _, ...token } = authDocument.token;
    return token;
  }

  const response = await fetch("https://api.munzee.com/oauth/login", {
    method: "POST",
    body: new URLSearchParams({
      client_id: application.client_id,
      client_secret: application.client_secret,
      grant_type: "refresh_token",
      refresh_token: authDocument.token.refresh_token,
      redirect_uri: application.redirect_uri,
    }),
    headers: {
      "User-Agent": "@cuppazee/api-server (+https://github.com/CuppaZee/CuppaZee)",
    },
  });

  const responseData = await response.getMunzeeData();

  if (!responseData.data?.token) {
    throw APIError.Authentication();
  }

  await mongo()
    .collection("auth")
    .updateOne(
      { application: application.name, user_id: Number(user_id) },
      { $set: { token: { ...authDocument.token, ...responseData.data.token } } }
    );

  const { refresh_token: _, ...token } = responseData.data.token;
  return token;
}