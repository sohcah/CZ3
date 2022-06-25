import { OpsZeeopsStatus, OpsZeeopsTutorialsStatus } from "./ops/zeeops";
import { User } from "./user/main";
import { UserDeploys, UserDeploysMap } from "./user/deploys";
import { UserUndeploys, UserUndeploysCount } from "./user/undeploys";
import { UserArchived } from "./user/archived";
import { UserCapturesSpecial, UserCaptures } from "./user/captures";
import { UserCredits, UserCreditsHistory } from "./user/credits";
import { UserBoostersActive, UserBoostersCredits } from "./user/boosters";
import { UserFind } from "./user/find";
import { StatzeePlayerDay } from "./statzee/player/day";
import { StatzeePlayerCaptures, StatzeePlayerCapturesTypes } from "./statzee/player/captures";
import { StatzeePlayerDeploys, StatzeePlayerDeploysTypes } from "./statzee/player/deploys";
import { ClanV2 } from "./clan/main";
import { ClanV2List, ClanV2Search, ClanV2Random } from "./clan/list";
import { ClanV2Leaderboard } from "./clan/leaderboard";
import { ClanV2Requirements } from "./clan/requirements";
import { ClanV2Challenges } from "./clan/challenges";
import { Munzee } from "./munzee/main";
import { MunzeeHascaptured } from "./munzee/hascaptured";
import {
  MunzeeSpecials,
  MunzeeSpecialsBouncers,
  MunzeeSpecialsFlat,
  MunzeeSpecialsMythological,
  MunzeeSpecialsPouchCreatures,
  MunzeeSpecialsRetired,
} from "./munzee/specials";
import { MunzeeBouncers } from "./munzee/bouncers";
import { MapBoundingboxV4 } from "./map/v4";
import { AssetsNews } from "./assets/news";
import { UserSpecials } from "./user/specials";
import { UserCubimals } from "./user/cubimals";
import { QRates } from "./user/qrates";
import { UserZeeqrew } from "./user/zeeqrew";

export type AllEndpoints =
  | AssetsNews
  | ClanV2
  | ClanV2Challenges
  | ClanV2Leaderboard
  | ClanV2List
  | ClanV2Random
  | ClanV2Requirements
  | ClanV2Search
  | MapBoundingboxV4
  | Munzee
  | MunzeeHascaptured
  | MunzeeSpecials
  | MunzeeBouncers
  | MunzeeSpecialsBouncers
  | MunzeeSpecialsFlat
  | MunzeeSpecialsMythological
  | MunzeeSpecialsPouchCreatures
  | MunzeeSpecialsRetired
  | OpsZeeopsStatus
  | OpsZeeopsTutorialsStatus
  | StatzeePlayerCaptures
  | StatzeePlayerCapturesTypes
  | StatzeePlayerDay
  | StatzeePlayerDeploys
  | StatzeePlayerDeploysTypes
  | User
  | UserArchived
  | UserBoostersActive
  | UserBoostersCredits
  | UserCaptures
  | UserCapturesSpecial
  | UserCredits
  | UserCreditsHistory
  | UserDeploys
  | UserDeploysMap
  | UserFind
  | UserSpecials
  | UserUndeploys
  | UserUndeploysCount
  | UserCubimals
  | UserZeeqrew
  | QRates;

export type EndpointPath = AllEndpoints["path"];
type InternalEndpoint<Endpoints, Path> = 0 extends 1 & Path
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  : Endpoints extends infer T & { path: Path }
  ? T
  : never;
export type Endpoint<Path extends EndpointPath> = InternalEndpoint<AllEndpoints, Path>;
export type EndpointParams<Path extends EndpointPath> = Endpoint<Path>["params"];
export type EndpointResponse<Path extends EndpointPath> = Endpoint<Path>["response"];
