import { type Router, type RouteLocationNormalizedLoaded } from "vue-router";
import { type Menu } from "@/stores/menu";

export interface Route extends RouteLocationNormalizedLoaded {
  forceActiveMenu?: string;
}

export interface FormattedMenu extends Menu {
  active?: boolean;
  activeDropdown?: boolean;
  subMenu?: FormattedMenu[];
}

export type ProvideForceActiveMenu = (pageName: string) => void;

const forceActiveMenu = (route: Route, pageName: string) => {
  route.forceActiveMenu = pageName;
};

const findActiveMenu = (subMenu: Menu[], route: Route): boolean => {
  let match = false;
  subMenu.forEach((item) => {
    if (
      ((route.forceActiveMenu !== undefined &&
          item.pageName === route.forceActiveMenu) ||
        (route.forceActiveMenu === undefined &&
          item.pageName === route.name)) &&
      !item.ignore
    ) {
      match = true;
    } else if (!match && item.subMenu) {
      match = findActiveMenu(item.subMenu, route);
    }
  });
  return match;
};

const nestedMenu = (menu: Array<Menu | "divider">, route: Route) => {
  const formattedMenu: Array<FormattedMenu | "divider"> = [];
  menu.forEach((item) => {
    if (typeof item !== "string") {
      const menuItem: FormattedMenu = {
        icon: item.icon,
        title: item.title,
        pageName: item.pageName,
        subMenu: item.subMenu,
        ignore: item.ignore,
        id: item.id,
        route: item.route
      };
      menuItem.active =
        ((route.forceActiveMenu !== undefined &&
            menuItem.pageName === route.forceActiveMenu) ||
          (route.forceActiveMenu === undefined &&
            menuItem.pageName === route.name) ||
          (menuItem.subMenu && findActiveMenu(menuItem.subMenu, route))) &&
        !menuItem.ignore;

      if (menuItem.subMenu) {
        menuItem.activeDropdown = findActiveMenu(menuItem.subMenu, route);

        const subMenu: Array<FormattedMenu> = [];
        nestedMenu(menuItem.subMenu, route).map(
          (menu) => typeof menu !== "string" && subMenu.push(menu)
        );
        menuItem.subMenu = subMenu;
      }

      formattedMenu.push(menuItem);
    } else {
      formattedMenu.push(item);
    }
  });

  return formattedMenu;
};

const linkTo = (menu: FormattedMenu, router: Router) => {
  if (menu.subMenu?.length) {
    menu.activeDropdown = !menu.activeDropdown;
  } else if (menu.pageName) {
    if (menu.pageName.startsWith('/')) {
      router.push({ path: menu.pageName }).catch(() => {});
    } else {
      if (router.hasRoute(menu.pageName)) {
        router.push({ name: menu.pageName }).catch(() => {});
      }
    }
  }
};

export { nestedMenu, linkTo, forceActiveMenu };