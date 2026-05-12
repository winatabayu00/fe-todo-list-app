import { type Menu } from "@/stores/menu";

const menu: Array<Menu | "divider"> = [
  { icon: "Home", pageName: "dashboard", title: "Dashboard", route: "/dashboard" },
  { icon: "Grid", pageName: "workspaces", title: "Workspaces", route: "/workspaces" },
  { icon: "Folder", pageName: "projects", title: "Projects", route: "/projects" },
  { icon: "CheckSquare", pageName: "tasks", title: "Tasks", route: "/tasks" },
  { icon: "Tag", pageName: "tags", title: "Tags", route: "/tags" },
  { icon: "Clock", pageName: "time-tracking", title: "Time Tracking", route: "/time-tracking" }
];

export default menu;