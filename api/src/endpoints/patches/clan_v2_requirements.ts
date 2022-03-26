import { FastifyInstance } from "fastify";
import { munzeeFetch } from "../../utils/munzee";

interface FakeLevelParams {
  individual: { [key: number]: number };
  group: { [key: number]: number };
}

function generateFakeLevel(fakeLevelParams: FakeLevelParams) {
  return {
    completed: 0,
    individual: Object.entries(fakeLevelParams.individual).map(
      i =>
        ({
          id: Number(i[0]) + 100000,
          task_id: Number(i[0]),
          name: `Fake Requirement ${i[0]}`,
          amount: i[1],
          description: "Fake Requirement Description",
          logo: "https://fake.com/fake.png",
          data: {},
          completed: 0,
          percent_completed: 0,
        } as const)
    ),
    group: Object.entries(fakeLevelParams.group).map(
      i =>
        ({
          id: Number(i[0]) + 100000,
          task_id: Number(i[0]),
          name: `Fake Requirement ${i[0]}`,
          amount: i[1],
          description: "Fake Requirement Description",
          logo: "https://fake.com/fake.png",
          data: {},
          value: 0,
          completed: 0,
          percent_completed: 0,
        } as const)
    ),
    percent_completed: 0,
  } as const;
}

enum ClanRequirement {
  DaysOfActivity = 1,
  TotalCaptures = 2,
  TotalPoints = 3,
  TotalDeploys = 6,
  DestinationPoints = 7,
  GreenieCaptures = 9,
  DeployPoints = 10,
  EvoPoints = 12,
  PlacesCaptures = 13,
  JewelActivity = 14,
  EvoActivity = 17,
  JewelPoints = 19,
  WeaponDeploys = 20,
  UrbanFitActivity = 22,
  WeaponPoints = 23,
  BouncerCaptures = 24,
  MysteryActivity = 25,
  WeaponActivity = 26,
  ZodiacActivity = 27,
  FlatPoints = 28,
  ElementalPoints = 29,
  ResellerActivity = 30,
  GamingPoints = 31,
  GamingActivity = 32,
  RenovateDestination = 33,
  MysteryPoints = 34,
  QRewZeeCaptures = 35,
  CardPoints = 36,
  QRatesClaimed = 37,
  kDay1 = 1038,
  kDay2 = 2038,
  kDay3 = 3038,
  kDay4 = 4038,
  kDay5 = 5038,
  kDay6 = 6038,
  kDay7 = 7038,
  kDay8 = 8038,
  kDay9 = 9038,
  kDay10 = 10038,
}

export default function clan_v2_requirements(fastify: FastifyInstance) {
  fastify.post<{
    Body: {
      data: string;
      access_token: string;
    };
  }>("/patches/clan/v2/requirements", async request => {
    const requestParams = JSON.parse(request.body.data);
    const response = await munzeeFetch({
      endpoint: "clan/v2/requirements",
      params: requestParams,
      token: request.body.access_token,
    });
    const result = await response.getMunzeeData();

    if (result.data && Object.keys(result.data.data.levels ?? {}).length === 0) {
      result.data.data.levels = {
        "1": generateFakeLevel({
          individual: {
            [ClanRequirement.DaysOfActivity]: 5,
            [ClanRequirement.kDay3]: 3,
            [ClanRequirement.TotalPoints]: 23_000,
            [ClanRequirement.TotalCaptures]: 25,
            [ClanRequirement.TotalDeploys]: 10,
            [ClanRequirement.EvoActivity]: 2,
            [ClanRequirement.BouncerCaptures]: 20,
            [ClanRequirement.PlacesCaptures]: 10,
            [ClanRequirement.DestinationPoints]: 250,
          },
          group: {
            [ClanRequirement.TotalPoints]: 100_000,
            [ClanRequirement.CardPoints]: 500,
            [ClanRequirement.FlatPoints]: 500,
            [ClanRequirement.ResellerActivity]: 5,
            [ClanRequirement.WeaponActivity]: 10,
            [ClanRequirement.RenovateDestination]: 5,
            [ClanRequirement.QRatesClaimed]: 2,
          },
        }),
        "2": generateFakeLevel({
          individual: {
            [ClanRequirement.DaysOfActivity]: 12,
            [ClanRequirement.kDay5]: 5,
            [ClanRequirement.TotalPoints]: 50_000,
            [ClanRequirement.TotalCaptures]: 50,
            [ClanRequirement.TotalDeploys]: 20,
            [ClanRequirement.EvoActivity]: 4,
            [ClanRequirement.BouncerCaptures]: 45,
            [ClanRequirement.PlacesCaptures]: 20,
            [ClanRequirement.DestinationPoints]: 500,
          },
          group: {
            [ClanRequirement.TotalPoints]: 250_000,
            [ClanRequirement.CardPoints]: 1000,
            [ClanRequirement.FlatPoints]: 1300,
            [ClanRequirement.ResellerActivity]: 15,
            [ClanRequirement.WeaponActivity]: 20,
            [ClanRequirement.RenovateDestination]: 10,
            [ClanRequirement.QRatesClaimed]: 4,
          },
        }),
        "3": generateFakeLevel({
          individual: {
            [ClanRequirement.DaysOfActivity]: 17,
            [ClanRequirement.kDay6]: 7,
            [ClanRequirement.TotalPoints]: 75_000,
            [ClanRequirement.TotalCaptures]: 77,
            [ClanRequirement.TotalDeploys]: 37,
            [ClanRequirement.EvoActivity]: 4,
            [ClanRequirement.BouncerCaptures]: 60,
            [ClanRequirement.PlacesCaptures]: 50,
            [ClanRequirement.DestinationPoints]: 1_000,
            [ClanRequirement.ResellerActivity]: 1,
          },
          group: {
            [ClanRequirement.TotalPoints]: 450_000,
            [ClanRequirement.CardPoints]: 2_000,
            [ClanRequirement.FlatPoints]: 2_500,
            [ClanRequirement.EvoActivity]: 15,
            [ClanRequirement.ResellerActivity]: 25,
            [ClanRequirement.WeaponActivity]: 50,
            [ClanRequirement.RenovateDestination]: 15,
            [ClanRequirement.QRatesClaimed]: 6,
          },
        }),
        "4": generateFakeLevel({
          individual: {
            [ClanRequirement.DaysOfActivity]: 23,
            [ClanRequirement.kDay7]: 7,
            [ClanRequirement.TotalPoints]: 125_000,
            [ClanRequirement.TotalCaptures]: 115,
            [ClanRequirement.TotalDeploys]: 57,
            [ClanRequirement.EvoActivity]: 4,
            [ClanRequirement.BouncerCaptures]: 80,
            [ClanRequirement.PlacesCaptures]: 80,
            [ClanRequirement.DestinationPoints]: 2_000,
            [ClanRequirement.ResellerActivity]: 5,
            [ClanRequirement.QRatesClaimed]: 1,
          },
          group: {
            [ClanRequirement.TotalPoints]: 700_000,
            [ClanRequirement.CardPoints]: 5_000,
            [ClanRequirement.FlatPoints]: 5_000,
            [ClanRequirement.EvoActivity]: 30,
            [ClanRequirement.ResellerActivity]: 40,
            [ClanRequirement.WeaponActivity]: 65,
            [ClanRequirement.RenovateDestination]: 20,
            [ClanRequirement.QRatesClaimed]: 8,
          },
        }),
        "5": generateFakeLevel({
          individual: {
            [ClanRequirement.DaysOfActivity]: 25,
            [ClanRequirement.kDay8]: 10,
            [ClanRequirement.TotalPoints]: 200_000,
            [ClanRequirement.TotalCaptures]: 250,
            [ClanRequirement.TotalDeploys]: 100,
            [ClanRequirement.EvoActivity]: 4,
            [ClanRequirement.BouncerCaptures]: 175,
            [ClanRequirement.PlacesCaptures]: 125,
            [ClanRequirement.DestinationPoints]: 2_500,
            [ClanRequirement.ResellerActivity]: 10,
            [ClanRequirement.QRatesClaimed]: 2,
          },
          group: {
            [ClanRequirement.TotalPoints]: 950_000,
            [ClanRequirement.CardPoints]: 7_500,
            [ClanRequirement.FlatPoints]: 7_500,
            [ClanRequirement.EvoActivity]: 60,
            [ClanRequirement.ResellerActivity]: 80,
            [ClanRequirement.WeaponActivity]: 130,
            [ClanRequirement.RenovateDestination]: 25,
            [ClanRequirement.QRatesClaimed]: 10,
          },
        }),
      };
    }

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
