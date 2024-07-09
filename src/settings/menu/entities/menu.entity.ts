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
    this.setting = Builder(Setting)
      .domain(domain)
      .build();
    this.type = type;
    this.menuCategory = menuCategory;
    if (upperMenuId !== null) {
      this.upperMenuId = upperMenuId;
    }
  }

  /**
   * 대메뉴 단건 업데이트
   * @param menuCategory 대메뉴
   * @param menuName 메뉴명
   */
  updateMainMenu(menuCategoryId: number, menuName: string, groupNo: number) {
    this.menuCategory = Builder(BlogMenuCategory)
      .id(menuCategoryId)
      .build();
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
  updateSubMenu(upperMenuId: number, subCategoryName: string, menuName: string, sortNo: number) {
    this.upperMenuId = upperMenuId;
    this.subCategoryName = subCategoryName;
    this.menuName = menuName;
    this.type = MenuType.SUB;
    this.sortNo = sortNo;
  }

  remove(menuId: number) {
    this.deleteDt
  }
}
