import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Main from "./pages/App";
import {CG_BUS} from "./pages/cg_bus";
import {CG_GRAPH} from "./pages/cg_graph";
import {CG_CLASS} from "./pages/cg_class";

export const router = createBrowserRouter([
  { path: "/", element: <Main /> },
  { path: "cg_bus", element: <CG_BUS /> },
  { path: "cg_graph", element: <CG_GRAPH /> },
  { path: "cg_class", element: <CG_CLASS /> },
]);