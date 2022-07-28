import { SafeAreaProvider } from "react-native-safe-area-context";

import { QueryClient, QueryClientProvider } from "react-query";

import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { createAsyncStoragePersistor } from "react-query/createAsyncStoragePersistor-experimental";
import { Router } from "./navigation/router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox, Platform, useColorScheme } from "react-native";

import localizedFormat from "dayjs/plugin/localizedFormat";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";

import Tamagui from "./tamagui.config";
import { Navigation } from "./navigation";
import { Theme, YStack } from "@cz3/app_ui";
import { ReactNode, useState } from "react";
import { mmkv } from "./common/storage/mmkv";
import { useAtomValue } from "jotai";
import { themeAtom } from "./common/storage/atoms";
import { trpc } from "./common/trpc/trpc";
import superjson from "superjson";
import { CMDK } from "@cz3/app/cmdk/cmdk";

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

const asyncStoragePersistor = createAsyncStoragePersistor({
  storage: {
    getItem: async key => {
      const value = mmkv.getString(key);
      return value ?? null;
    },
    setItem: async (key, value) => {
      mmkv.set(key, value);
    },
    removeItem: async key => {
      mmkv.delete(key);
    },
  },
});

persistQueryClient({
  queryClient,
  persistor: asyncStoragePersistor,
});

function ThemeProvider({ children }: { children: ReactNode }) {
  const selectedTheme = useAtomValue(themeAtom);
  const colorScheme = useColorScheme() ?? "light";
  const theme = selectedTheme === "system" ? colorScheme : selectedTheme;
  return (
    <Tamagui.Provider>
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
    </Tamagui.Provider>
  );
}

export default function App() {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: "https://api.cuppazee.app/trpc",
      // url: "http://localhost/trpc",
      // optional
      headers() {
        return {
          // authorization: getAuthCookie(),
        };
      },
      transformer: superjson,
    })
  );

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
