import { ReactNode, useEffect } from "react";
import { PageState, usePageContext } from "@/page/handler";

export function Page({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

Page.Map = function (props: PageState["map"][0]) {
  const context = usePageContext();
  useEffect(() => {
    context(state => ({ ...state, map: [...state.map, props] }));
    return () => {
      context(state => ({ ...state, map: state.map.filter(c => c !== props) }));
    };
  });
  return null;
};

Page.LeftPanel = function (props: PageState["leftPanel"][0]) {
  const context = usePageContext();
  useEffect(() => {
    context(state => ({ ...state, leftPanel: [...state.leftPanel, props] }));
    return () => {
      context(state => ({ ...state, leftPanel: state.leftPanel.filter(c => c !== props) }));
    };
  });
  return null;
};

Page.RightPanel = function (props: PageState["rightPanel"][0]) {
  const context = usePageContext();
  useEffect(() => {
    context(state => ({ ...state, rightPanel: [...state.rightPanel, props] }));
    return () => {
      context(state => ({ ...state, rightPanel: state.rightPanel.filter(c => c !== props) }));
    };
  });
  return null;
};
