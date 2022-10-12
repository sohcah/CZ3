import { Routes, Route, useNavigate, Navigate } from "react-router";
import { useEffect } from "react";
import { BackHandler } from "react-native";
import { PlayerScreen } from "../features/player";
import { PlayerAlternamythsScreen } from "@/features/player/alternamyths";
import { SettingsWrapper } from "../features/settings/wrapper";
import { SettingsEditor } from "@/features/settings/editor";
import { TourismSectionScreen } from "@/features/tourism/section";
import { TourismScreen } from "@/features/tourism";
import { PageHandler } from "@/page/handler";
import { InternalMissingScreen } from "@/features/internal/missing";

export function Navigation() {
  const navigate = useNavigate();
  useEffect(() => {
    const backAction = () => {
      navigate(-1);
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <PageHandler>
      <Routes>
        <Route path="/settings" element={<SettingsWrapper />}>
          <Route path=":section" element={<SettingsEditor />} />
        </Route>
        <Route path="/tourism" element={<TourismScreen />}>
          <Route path=":tourism" element={<TourismSectionScreen />} />
        </Route>
        <Route path="/internal">
          <Route path="missing" element={<InternalMissingScreen />} />
        </Route>
        <Route path="/player/:player" element={<PlayerScreen />}>
          <Route path="alternamyths" element={<PlayerAlternamythsScreen />} />
          {/*<Route path="uniqcorns" element={<PlayerUniqCornsScreen />} />*/}
        </Route>
        {/*<Route path="*" element={<Navigate to="/player/lynnslilypad/alternamyths" replace />} />*/}
        <Route path="*" element={<Navigate to="/tourism/golden_tickets" replace />} />
      </Routes>
    </PageHandler>
  );
}
