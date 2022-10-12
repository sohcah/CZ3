import "expo-dev-client";
import "./translations";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { Router } from "./navigation/router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox, Platform, useColorScheme } from "react-native";

import localizedFormat from "dayjs/plugin/localizedFormat";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";

import config from "./tamagui.config";
import { Navigation } from "./navigation";
import { TamaguiProvider, Theme, YStack } from "tamagui";
import { ReactNode, useState } from "react";
import { mmkv } from "./common/storage/mmkv";
import { useAtomValue } from "jotai";
import { themeAtom } from "./common/storage/atoms";
import { trpc } from "./common/trpc/trpc";
import superjson from "superjson";
import { CMDK } from "@/cmdk/cmdk";
import { httpBatchLink } from "@trpc/client";
import { useFonts } from "expo-font";

LogBox.ignoreLogs(["PropType will be removed from React Native"]);

dayjs.extend(localizedFormat);
dayjs.locale("en-GB");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const syncStoragePersister = createSyncStoragePersister({
  storage: {
    getItem: key => {
      const value = mmkv.getString(key);
      return value ?? null;
    },
    setItem: (key, value) => {
      mmkv.set(key, value);
    },
    removeItem: key => {
      mmkv.delete(key);
    },
  },
});

persistQueryClient({
  queryClient,
  persister: syncStoragePersister,
});

function ThemeProvider({ children }: { children: ReactNode }) {
  const selectedTheme = useAtomValue(themeAtom);
  const colorScheme = useColorScheme() ?? "light";
  const theme = selectedTheme === "system" ? colorScheme : selectedTheme;
  return (
    <TamaguiProvider themeClassNameOnRoot config={config}>
      <Theme name={theme}>
        <YStack
          bc="$background"
          width={Platform.OS === "web" ? "100vw" : "100%"}
          overflow="hidden"
          minHeight={Platform.OS === "web" ? "100vh" : "100%"}
          flex={1}
        >
          <Theme name="green">{children}</Theme>
        </YStack>
      </Theme>
    </TamaguiProvider>
  );
}

export default function App() {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          // url: "https://api.cuppazee.app/trpc",
          url: "http://mba.sh.2b.io/trpc",
          headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],
      transformer: superjson,
    })
  );

  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <Router>
              <ThemeProvider>
                {Platform.OS === "web" && (
                  <style>
                    {`a:not(.external-link) {
                  text-decoration: none;
                }`}
                  </style>
                )}
                {typeof window === "undefined" ? null : (
                  <>
                    <Navigation />

                    <CMDK />
                  </>
                )}
              </ThemeProvider>
            </Router>
          </QueryClientProvider>
        </trpc.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
