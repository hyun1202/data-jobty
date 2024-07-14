import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId
} from "typeorm";
import { Setting } from "../../detail/entities/detail.entity";
import { BlogMenuCategory } from "./blog-menu-category.entity";
import { Timestamped } from "../../../common/timestamped/time-stamped";
import { MenuType } from "./menu-type";
import { Builder } from "builder-pattern";
import { UpdateMenuDto } from "../dto/request/update-menu.dto";
import { CustomException } from "../../../common/exception/custom.exception";
import { ErrorCode, toErrorcodeById } from "../../../common/exception/error.code";

@Entity({ name : "menu" })
export class Menu extends Timestamped{
  @PrimaryGeneratedColumn({ name: "menu_id"})
  id : number
  @ManyToOne(() => Setting)
  @JoinColumn({name: "domain"})
  setting: Setting
  @ManyToOne(() => BlogMenuCategory)
  @JoinColumn({name: "blog_menu_category_id"})
  menuCategory: BlogMenuCategory
  @Column({ name: "sub_category_name" , nullable: true})
  subCategoryName: string
  @Column({ name: "menu_name" })
  menuName: string
  @Column({ name: "sort_no" })
  sortNo: number
  @Column({name: "type"})
  type: number
  @Column({name: "upper_menu_id", nullable: true})
  upperMenuId: number
  @ManyToOne(() => Menu, (menu) => menu.subs, {
    createForeignKeyConstraints: false
  })
  @JoinColumn({ name: "upper_menu_id", referencedColumnName: "id", })
  main: Menu
  @OneToMany(() => Menu, (menu) => menu.main)
  subs: Menu[]
  @Column({name: "group_no"})
  groupNo: number

  /**
   * 메뉴 생성
   * @param domain 도메인
   * @param type 메뉴 타입 (대메뉴, 소메뉴)
   * @param menuCategory 대메뉴 정보
   * @param upperMenuId 상위메뉴 정보
   */
  createMenu(domain: string, type: number, menuCategory: BlogMenuCategory, upperMenuId?: number) {
    this.checkMainCategory(menuCategory, type);
    this.setting = Builder(Setting)
      .domain(domain)
      .build();
    this.type = type;
    this.menuCategory = menuCategory;
    if (upperMenuId !== null) {
      this.upperMenuId = upperMenuId;
    }
  }

  updateMenu(menuCategory: BlogMenuCategory, updateMenuDto: UpdateMenuDto) {
    if (updateMenuDto.menu_type === MenuType.MAIN) {
      this.checkMainCategory(menuCategory, updateMenuDto.menu_type);
      this.updateMainMenu(menuCategory, updateMenuDto.menu_name, updateMenuDto.group_no);
    } else {
      this.updateSubMenu(updateMenuDto.upper_menu_id, updateMenuDto.menu_name, updateMenuDto.menu_name, updateMenuDto.sort_no);
    }
  }

  /**
   * 대메뉴 단건 업데이트
   * @param menuCategory 대메뉴
   * @param menuName 메뉴명
   */
  private updateMainMenu(menuCategory: BlogMenuCategory, menuName: string, groupNo: number) {
    this.menuCategory = menuCategory;
    this.menuName = menuName;
    this.subCategoryName = null;
    this.type = MenuType.MAIN;
    this.groupNo = groupNo;
    this.upperMenuId = null;
  }

  /**
   * 소메뉴 단건 업데이트
   * @param subMenuName 소메뉴 카테고리(사용자 지정)
   * @param menuName 매뉴명
   */
  private updateSubMenu(upperMenuId: number, subCategoryName: string, menuName: string, sortNo: number) {
    this.upperMenuId = upperMenuId;
    this.subCategoryName = subCategoryName;
    this.menuName = menuName;
    this.type = MenuType.SUB;
    this.sortNo = sortNo;
  }

  /**
   * 메인 카테고리 데이터 확인
   * @param menuCategory 메인 카테고리
   */
  private checkMainCategory(menuCategory: BlogMenuCategory, type) {
    if (type === MenuType.MAIN && (menuCategory === null || menuCategory === undefined)) {
      throw new CustomException(toErrorcodeById(ErrorCode.INCORRECT_MAIN_CATEGORY, this.id));
    }
  }
}
