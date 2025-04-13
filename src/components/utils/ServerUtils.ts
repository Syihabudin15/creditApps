import { ERole } from "@prisma/client";
import moment from "moment";
import { NextRequest } from "next/server";
import React from "react";

export enum EAccess {
  Read,
  Write,
  Update,
  Delete,
  Upload,
}

export interface GetProps {
  page: number;
  pageSize: number;
  name?: string;
  tanggal: string[];
  active?: string;
  status?: string;
  role?: ERole;
}

export type UserPropsGet = {
  page: number;
  pageSize: number;
};

export type ModalMessageProps = {
  type: "error" | "success";
  title: string;
  desc: string | React.ReactNode;
  show: boolean;
};

export const defaultPage = 1;
export const defaultPageSize = 50;

export const getQueryUrl = (req: NextRequest) => {
  const temp = req.nextUrl.searchParams.get("rangeDate");
  const defaultDate = `${moment()
    .set("date", 1)
    .format("YYYY-MM-DD")},${moment()
    .set("date", moment().daysInMonth())
    .format("YYYY-MM-DD")}`;
  const tempTgl = temp ? temp.split(",") : defaultDate.split(",");

  return {
    page: <number>(
      parseInt(req.nextUrl.searchParams.get("page") || defaultPage.toString())
    ),
    pageSize: <number>(
      parseInt(
        req.nextUrl.searchParams.get("pageSize") || defaultPageSize.toString()
      )
    ),
    name: req.nextUrl.searchParams.get("name") || "",
    active: req.nextUrl.searchParams.get("active") || "",
    status: "",
    role: req.nextUrl.searchParams.get("role") || "ADMIN",
    tanggal: [
      moment(tempTgl[0]).format("YYYY/MM/DD"),
      moment(tempTgl[1]).format("YYYY/MM/DD"),
    ],
  } as GetProps;
};
