import { BrowserRouter } from "react-router-dom";
// import { StaticRouter } from "react-router-dom/server";
export const Router = typeof document === "undefined" ? () => null : BrowserRouter;

