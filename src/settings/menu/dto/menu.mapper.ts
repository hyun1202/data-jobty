import { Builder } from "builder-pattern";
import { CreateMenuDto } from "./request/create-menu.dto";
import { UpdateMenuDto } from "./request/update-menu.dto";

export const updateDtoToCreateDto = (menu: UpdateMenuDto) => {
  return Builder(CreateMenuDto)
    .category_id(menu.category_id)
    .menu_type(menu.menu_type)
    .menu_name(menu.menu_name)
    .upper_menu_id(menu.upper_menu_id)
    .sub_category_name(menu.sub_category_name)
    .group_no(menu.group_no)
    .sort_no(menu.sort_no)
    .build();
}