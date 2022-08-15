import { Routes, Route, useNavigate, Navigate } from "react-router";
import { useEffect } from "react";
import { BackHandler } from "react-native";
import { PlayerScreen } from "../features/player";
import { PlayerAlternamythsScreen } from "@cz3/app/features/player/alternamyths";
import { SettingsWrapper } from "../features/settings/wrapper";
import { SettingsEditor } from "@cz3/app/features/settings/editor";
import { TourismSectionScreen } from "@cz3/app/features/tourism/section";
import { TourismScreen } from "@cz3/app/features/tourism";

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
    <Routes>
      <Route path="/settings" element={<SettingsWrapper />}>
        <Route path=":section" element={<SettingsEditor />} />
      </Route>
      <Route path="/tourism/" element={<TourismScreen />}>
        <Route path=":tourism" element={<TourismSectionScreen />} />
      </Route>
      <Route path="/player/:player" element={<PlayerScreen />}>
        <Route path="alternamyths" element={<PlayerAlternamythsScreen />} />
        {/*<Route path="uniqcorns" element={<PlayerUniqCornsScreen />} />*/}
      </Route>
      <Route path="*" element={<Navigate to="/settings" replace />} />
    </Routes>
  );
}
