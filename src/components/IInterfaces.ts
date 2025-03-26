import { Dapem, JePem, ProPem, User, UserMenu } from "@prisma/client";
import React from "react";

export interface IServiceResponse<T> {
  msg: string;
  code: number;
  data?: T;
}

export interface FindAllProps {
  page: number;
  pageSize: number;
  filters?: any;
  includes?: any;
  orderBy?: string;
}

export interface ICardDashboard {
  name: string;
  icon: string | React.ReactNode;
  total: string;
}
interface IMenu {
  title: string;
  label: string;
  access: string[];
  key: string;
  checked: boolean;
  icon?: string | React.ReactNode;
  style?: object;
}
export interface IMenuList extends IMenu {
  children?: IMenu[];
}

export interface IUser extends User {
  UserMenu: UserMenu[];
}

export interface IProPem extends ProPem {}
export interface IJePem extends JePem {}
export interface ISimulation extends Dapem {
  nama: string;
  nik: string;
  alamat: string;
  ProPem: IProPem;
  JePem: IJePem;
}
export interface IDapem extends Dapem {
  ProPem: IProPem;
  JePem: IJePem;
}
