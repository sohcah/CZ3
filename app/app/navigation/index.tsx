import { Routes, Route, useNavigate, Navigate } from "react-router";
import { useEffect } from "react";
import { BackHandler } from "react-native";
import { H1 } from "@cz3/app_ui";
import { PlayerScreen } from "../features/player";
import { PlayerAlternamythsScreen } from "@cz3/app/features/player/alternamyths";

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
      <Route path="/settings" element={<H1>Hello/Hello</H1>} />
      <Route
        path="/player/:player"
        element={
          <PlayerScreen />
        }
      >
        <Route path="alternamyths" element={<PlayerAlternamythsScreen />} />
      </Route>
      <Route path="*" element={<Navigate to="/settings" replace />} />
    </Routes>
  );
}
