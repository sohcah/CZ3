import fetch from "node-fetch";
import { URLSearchParams } from "url";
import { APIError } from "../../api";
import config from "../config";
import { munzeeFetch } from "../munzee";
import Jwt from "jsonwebtoken";
import { prisma } from "../prisma";
import { FastifyReply } from "fastify";
import { unableToReadPage } from "./unableToRead";
import { invalidUsernamePage } from "./invalidUsername";
import { randomBytes } from "crypto";

export interface APIApplication {
  id: string;
  title: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  discord?: string;
}

export interface DeviceDetails {
  app: "express" | "max" | "create" | "browse" | "nomad";
  platform: "ios" | "android" | "web";
  redirect: string;
  /** @deprecated used for backwards compatibility with CuppaZee Max */
  max_alt?: boolean;
  /** @deprecated used for backwards compatibility with CuppaZee Express */
  ionic?: boolean;
  disableTeakens?: boolean;
}

export async function loginWithAuthorizationCode(
  apiApplication: APIApplication,
  authorizationCode: string,
  device: DeviceDetails,
  reply: FastifyReply,
  human: boolean = true,
  possiblyUseTeakens: boolean = false
) {
  const useTeakens = !device.disableTeakens && possiblyUseTeakens;
  const teaken = useTeakens ? randomBytes(20).toString("hex") : "";
  if (useTeakens && !device.app) device.app = "max";
  if (!["express", "max", "nomad", "shadow"].includes(device.app) || !apiApplication) {
    throw APIError.InvalidRequest();
  }

  const response = await fetch("https://api.munzee.com/oauth/login", {
    method: "POST",
    body: new URLSearchParams({
      client_id: apiApplication.client_id,
      client_secret: apiApplication.client_secret,
      grant_type: "authorization_code",
      code: authorizationCode,
      redirect_uri: apiApplication.redirect_uri,
    }),
    headers: {
      "User-Agent": "@cuppazee/api-server (+https://github.com/CuppaZee/CuppaZee)",
    },
  });

  const data = await response.getMunzeeData();

  if (!data.data?.token?.access_token) {
    if (human) {
      return reply.type("html").send(unableToReadPage);
    }
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

  const { username, user_id } = userData.data ?? {};

  if (!username) {
    if (human) {
      return reply.type("html").send(invalidUsernamePage);
    }
    throw APIError.MunzeeInvalid();
  }

  const playerDocument = await prisma.player.findFirst({
    where: { user_id: user_id },
  });
  const authDocument = await prisma.player_auth.findFirst({
    where: { api: apiApplication.id, user_id: user_id },
  });
  const appDocument = await prisma.player_app.findFirst({
    where: { app: device.app, user_id: user_id },
  });

  let userNumber = playerDocument?.user_number;
  let apiUserNumber = authDocument?.user_number;
  let appUserNumber = appDocument?.user_number;
  let userCount: number = 0;
  let apiUserCount: number = 0;
  let appUserCount: number = 0;

  await prisma.$transaction(async () => {
    userCount =
      (
        await prisma.player.aggregate({
          _max: {
            user_number: true,
          },
        })
      )._max.user_number ?? 0;
    apiUserCount =
      (
        await prisma.player_auth.aggregate({
          _max: {
            user_number: true,
          },
          where: {
            api: apiApplication.id,
          },
        })
      )._max.user_number ?? 0;
    appUserCount =
      (
        await prisma.player_app.aggregate({
          _max: {
            user_number: true,
          },
          where: {
            app: device.app,
          },
        })
      )._max.user_number ?? 0;
    await prisma.player.upsert({
      where: {
        user_id: user_id,
      },
      create: {
        user_id: user_id!,
        username: username!,
        user_number: userCount + 1,
      },
      update: {
        username: username,
      },
    });
    await prisma.player_auth.upsert({
      where: {
        user_id_api: {
          api: apiApplication.id,
          user_id: user_id!,
        },
      },
      update: {
        api: apiApplication.id,
        access_token: data.data.token.access_token,
        access_token_expires: new Date(data.data.token.expires * 1000),
        refresh_token: data.data.token.refresh_token,
        refresh_token_expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
      },
      create: {
        api: apiApplication.id,
        access_token: data.data.token.access_token,
        access_token_expires: new Date(data.data.token.expires * 1000),
        refresh_token: data.data.token.refresh_token,
        refresh_token_expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
        user_id: user_id!,
        user_number: apiUserCount + 1,
      },
    });
    await prisma.player_app.upsert({
      where: {
        user_id_app: {
          app: device.app,
          user_id: user_id!,
        },
      },
      update: {},
      create: {
        app: device.app,
        user_id: user_id!,
        user_number: appUserNumber ?? appUserCount + 1,
      },
    });
    if (teaken) {
      await prisma.player_teaken.create({
        data: {
          user_id: user_id!,
          teaken,
        },
      });
    }
    if (!userNumber) {
      userNumber = userCount + 1;
      userCount++;
    }
    if (!apiUserNumber) {
      apiUserNumber = apiUserCount + 1;
      apiUserCount++;
    }
    if (!appUserNumber) {
      appUserNumber = appUserCount + 1;
      appUserCount++;
    }
    return;
  });

  // Send Discord Message
  const platform =
    {
      android: "🤖",
      ios: "🍎",
      web: "🌐",
    }[device.platform] || `[${device.platform}] `;
  const platformName =
    {
      android: "Android",
      ios: "iOS",
      web: "Web",
    }[device.platform] || device.platform;
  const app = {
    express: "🔵",
    max: "🟢",
    create: "🟣",
    browse: "🟡",
    nomad: "🟠",
  }[device.app];
  const appColor = {
    express: 0x00b1d5,
    max: 0x00c35b,
    create: 0xaf4eff,
    browse: 0xffd95c,
    nomad: 0xff5500,
  }[device.app];
  const isNewToCuppaZee = !playerDocument;
  const isNewToApi = !authDocument;
  const isNewToApp = !appDocument;
  const discordEmbed: any = {
    title: `${username} has logged in!${isNewToCuppaZee ? " 🆕" : ""}`,
    thumbnail: {
      url: `https://munzee.global.ssl.fastly.net/images/avatars/ua${Number(user_id).toString(
        36
      )}.png`,
    },
    color: appColor,
    description: `
CuppaZee User #${userNumber} of ${userCount}
Platform: ${platform} ${platformName}
API: ${apiApplication.title}${isNewToApi ? " 🆕" : ""} [User #${apiUserNumber} of ${apiUserCount}]
App: ${device.app[0].toUpperCase()}${device.app.slice(1)}${
      isNewToApp ? " 🆕" : ""
    } [User #${appUserNumber} of ${appUserCount}]
`.trim(),
    timestamp: new Date().toISOString(),
  };
  let discordMessage = `${app}${platform}${isNewToApi ? "🆕" : "🔁"} ${username} | ${
    playerDocument ? `${userCount} Users [#${userNumber}]` : `User #${userNumber}`
  }`;
  const newTo = [];
  if (isNewToCuppaZee) {
    newTo.push("CuppaZee");
  } else if (isNewToApi) {
    newTo.push(apiApplication.id);
  } else if (isNewToApp) {
    newTo.push(`${device.app[0].toUpperCase()}${device.app.slice(1)}`);
  }
  if (newTo.length > 0) {
    discordMessage += ` | New to ${newTo.join(", ").replace(/, ([^,]+)$/, " and $1")}`;
  }

  if (apiApplication.discord) {
    await fetch(apiApplication.discord, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: discordMessage,
        embeds: [discordEmbed],
      }),
    });
  }
  if (config.discord?.all_auth) {
    await fetch(config.discord?.all_auth, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: discordMessage,
        embeds: [discordEmbed],
      }),
    });
  }

  if (teaken) {
    if (device.max_alt) {
      const v = `czlogin:${teaken}:${username}:${user_id}`;
      reply.type("html")
        .send(`<p>Please copy this text to your clipboard, and return to the CuppaZee Max app.</p><br/><textarea>${v}</textarea><br/><button onclick="call()">Copy to Clipboard</button><script>
              function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

const v = "${v}";

function call() {
  copyTextToClipboard(v);
}
            </script>`);
    } else if (device.ionic) {
      return reply.redirect(
        `${device.redirect}?access_token=${encodeURIComponent(
          `${teaken}/${username}/${user_id}`
        )}&state=${device.ionic}`
      );
    } else {
      return reply.redirect(
        `${device.redirect}?teaken=${encodeURIComponent(teaken)}&code=${encodeURIComponent(
          teaken
        )}&username=${username}&user_id=${user_id}&state=${encodeURIComponent(
          JSON.stringify(data)
        )}`
      );
    }
  }

  const token = Jwt.sign(
    {
      user_id,
      username,
      created_at: Date.now(),
    },
    config.jwtSecret
  );

  return reply.redirect(
    `${device.redirect}${device.redirect.includes("?") ? "&" : "?"}code=${encodeURIComponent(
      token
    )}`
  );
}

export interface MinimumAuthenticationResult {
  access_token: string;
}

export interface AuthenticationResult extends MinimumAuthenticationResult {
  access_token_expires: number;
}

export function verifyJwtToken(cuppazeeToken: string) {
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

  return jwtData;
}

export async function authenticateWithCuppaZeeToken(
  cuppazeeToken: string,
  application?: APIApplication
) {
  const jwtData = verifyJwtToken(cuppazeeToken);

  return await authenticateWithUserID(jwtData.user_id, application);
}

export async function authenticateWithUserID(
  user_id: string | number,
  apiApplication?: APIApplication
): Promise<AuthenticationResult> {
  const authDocument = await prisma.player_auth.findFirst({
    where: {
      api: apiApplication?.id,
      user_id: Number(user_id),
    },
  });

  if (!authDocument) {
    throw APIError.Authentication("Couldn't find authentication for this user.");
  }

  const apiApp = apiApplication ?? config.applications[authDocument.api];

  if (authDocument.access_token_expires.valueOf() > Date.now() + 1800000) {
    return {
      access_token: authDocument.access_token,
      access_token_expires: authDocument.access_token_expires.valueOf(),
    };
  }

  const response = await fetch("https://api.munzee.com/oauth/login", {
    method: "POST",
    body: new URLSearchParams({
      client_id: apiApp.client_id,
      client_secret: apiApp.client_secret,
      grant_type: "refresh_token",
      refresh_token: authDocument.refresh_token,
      redirect_uri: apiApp.redirect_uri,
    }),
    headers: {
      "User-Agent": "@cuppazee/api-server (+https://github.com/CuppaZee/CuppaZee)",
    },
  });

  const responseData = await response.getMunzeeData();

  if (!responseData.data?.token) {
    throw APIError.Authentication();
  }

  await prisma.player_auth.update({
    where: { user_id_api: { api: apiApp.id, user_id: Number(user_id) } },
    data: {
      api: apiApp.id,
      access_token: responseData.data.token.access_token,
      access_token_expires: new Date(responseData.data.token.expires * 1000),
      refresh_token: authDocument.refresh_token,
      refresh_token_expires: authDocument.refresh_token_expires,
    },
  });

  return {
    access_token: responseData.data.token.access_token,
    access_token_expires: new Date(responseData.data.token.expires * 1000).valueOf(),
  };
}

export function authenticateAnonymous(application?: APIApplication) {
  return authenticateWithUserID(125914, application);
}

export interface AuthHeaders {
  "x-munzee-token"?: string;
  "x-cuppazee-token"?: string;
}

export interface AuthenticateHeadersOptions {
  anonymous?: boolean;
  application?: APIApplication;
}

export async function authenticateHeaders(
  headers: AuthHeaders,
  options: AuthenticateHeadersOptions = {}
): Promise<MinimumAuthenticationResult> {
  if (headers["x-cuppazee-token"]) {
    return await authenticateWithCuppaZeeToken(headers["x-cuppazee-token"], options.application);
  }
  if (headers["x-munzee-token"]) {
    return { access_token: headers["x-munzee-token"] };
  }
  if (options?.anonymous) {
    return authenticateAnonymous(options.application);
  }
  throw APIError.Authentication("No authentication token provided.");
}

export async function authenticatedUser(token: string | MinimumAuthenticationResult) {
  const response = await munzeeFetch<any>({ endpoint: "user", params: {}, token });
  const data = await response.getMunzeeData();
  if (data.authenticated_entity_type !== "user") throw APIError.Authentication("Not a user.");
  return Number(data.authenticated_entity);
}
