import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Portfolio } from "./pages/Portfolio";
import { Store } from "./pages/Store";
import { Contact } from "./pages/Contact";
import { Success } from "./pages/Success";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "portfolio", Component: Portfolio },
      { path: "store", Component: Store },
      { path: "contact", Component: Contact },
      { path: "success", Component: Success },
    ],
  },
]);
