import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AuthorityLayout from "../layouts/AuthorityLayout";

// Public Pages
import Home from "../pages/public/Home";
import WaterCheck from "../pages/public/WaterCheck";
import NearbySources from "../pages/public/NearbySources";
import Warnings from "../pages/public/Warnings";
import MyChecks from "../pages/public/MyChecks";
import PublicSource from "../pages/public/PublicSource";

// User Pages
import UserLayout from "../layouts/UserLayout";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import Activate from "../pages/user/Activate";
import UserDashboard from "../pages/user/UserDashboard";
import UserCheckWater from "../pages/user/UserCheckWater";
import UserDevices from "../pages/user/UserDevices";
import UserHistory from "../pages/user/UserHistory";

// Authority Pages
import CommandCenter from "../pages/authority/CommandCenter";
import WaterSources from "../pages/authority/WaterSources";
import LiveMonitoring from "../pages/authority/LiveMonitoring";
import Alerts from "../pages/authority/Alerts";
import Incidents from "../pages/authority/Incidents";
import Inspections from "../pages/authority/Inspections";
import Laboratory from "../pages/authority/Laboratory";
import WaterMap from "../pages/authority/WaterMap";
import Analytics from "../pages/authority/Analytics";
import StationDetail from "../pages/authority/StationDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/public" replace />,
  },
  {
    path: "/public",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "check-water",
        element: <WaterCheck />,
      },
      {
        path: "sources",
        element: <NearbySources />,
      },
      {
        path: "warnings",
        element: <Warnings />,
      },
      {
        path: "my-checks",
        element: <MyChecks />,
      },
      {
        path: "source/:stationId",
        element: <PublicSource />,
      }
    ],
  },
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/user/dashboard" replace />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "activate",
        element: <Activate />,
      },
      {
        path: "dashboard",
        element: <UserDashboard />,
      },
      {
        path: "check-water",
        element: <UserCheckWater />,
      },
      {
        path: "devices",
        element: <UserDevices />,
      },
      {
        path: "history",
        element: <UserHistory />,
      }
    ],
  },
  {
    path: "/authority",
    element: <AuthorityLayout />,
    children: [
      {
        index: true,
        element: <CommandCenter />,
      },
      {
        path: "sources",
        element: <WaterSources />,
      },
      {
        path: "monitoring",
        element: <LiveMonitoring />,
      },
      {
        path: "alerts",
        element: <Alerts />,
      },
      {
        path: "incidents",
        element: <Incidents />,
      },
      {
        path: "inspections",
        element: <Inspections />,
      },
      {
        path: "laboratory",
        element: <Laboratory />,
      },
      {
        path: "map",
        element: <WaterMap />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "stations/:stationId",
        element: <StationDetail />,
      }
    ],
  },
  {
    path: "*",
    element: <Navigate to="/public" replace />,
  },
]);
