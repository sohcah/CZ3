import { CuppaZeeApplication } from "../../context.js";
import { t } from "../../trpc.js";

export interface FlagCategory {
  title: string;
  description: string;
  hidden: boolean;
}

export const categories = createCategories({
  jokes: {
    title: "Jokes",
    description: "Jokes",
    hidden: true,
  },
});

function createCategories<T extends Record<string, FlagCategory>>(categories: T): T {
  return categories;
}

export interface FlagOptions {
  [key: string]: {
    title: string;
    description: string;
    hidden: boolean;
  };
}

export interface Flag<
  Options extends FlagOptions,
  Group extends keyof typeof categories,
  Apps extends CuppaZeeApplication
> {
  title: string;
  description: string;
  options: Options;
  default: keyof Options;
  group: Group;
  apps: Apps[];

  withTitle(title: string): this;

  withDescription(description: string): this;

  withOptions<NewOptions extends FlagOptions>(options: NewOptions): Flag<NewOptions, Group, Apps>;

  withDefault(defaultOption: keyof Options): this;

  withGroup<NewGroup extends keyof typeof categories>(
    group: NewGroup
  ): Flag<Options, NewGroup, Apps>;

  withApp<NewApp extends CuppaZeeApplication>(app: NewApp): Flag<Options, Group, Apps | NewApp>;
}

export const flags = createFlags({
  enableFalseAdvertisements: createFlag()
    .withTitle("Enable False Advertisements")
    .withDescription("Enable false advertisements")
    .withOptions({
      true: {
        title: "True",
        description: "Enable false advertisements",
        hidden: false,
      },
      false: {
        title: "False",
        description: "Disable false advertisements",
        hidden: false,
      },
    })
    .withDefault("true")
    .withGroup("jokes")
    .withApp(CuppaZeeApplication.AppV3),
});

export type ApplicationFlags = {
  [application in CuppaZeeApplication]: {
    [flag in keyof typeof flags as typeof flags[flag]["apps"] extends application[]
      ? flag
      : never]: typeof flags[flag];
  };
};

const flagsByApplication = new Map<CuppaZeeApplication, Record<string, Flag<any, any, any>>>();

for (const application of Object.values(CuppaZeeApplication)) {
  flagsByApplication.set(
    application,
    Object.fromEntries(
      Object.entries(flags).filter(([, flag]) => flag.apps.includes(application as any))
    )
  );
}

function createFlag(): Flag<any, "jokes", never> {
  const flag: Flag<any, "jokes", never> = {
    title: "",
    description: "",
    options: [],
    default: "",
    group: "jokes",
    apps: [],
    withTitle(title: string) {
      return { ...this, title };
    },
    withDescription(description: string) {
      return { ...this, description };
    },
    withOptions<NewOptions extends FlagOptions>(options: NewOptions) {
      return { ...(this as any), options, default: Object.keys(options)[0] as keyof NewOptions };
    },
    withDefault(defaultOption) {
      return { ...this, default: defaultOption };
    },
    withGroup<NewGroup extends keyof typeof categories>(group: NewGroup) {
      return { ...(this as any), group };
    },
    withApp<NewApp extends CuppaZeeApplication>(app: NewApp) {
      return { ...(this as any), apps: [...this.apps, app] };
    },
  };
  return flag;
}

function createFlags<T extends Record<string, Flag<any, any, any>>>(flags: T): T {
  return flags;
}

export const flagsRouter = t.router({
  list: t.procedure.query(async ({ ctx }) => {
    return { categories, flags: flagsByApplication.get(ctx.app)! };
  }),
});
