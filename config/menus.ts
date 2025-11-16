import { DashBoard, Application, ClipBoard } from "@/components/svg";
import { Activity, Building, Calendar, DollarSign, ListOrdered, Target, Box, ShieldCheck, UserCog, Key, Users } from "lucide-react";

export interface MenuItemProps {
  title: string;
  icon: any;
  href?: string;
  child?: MenuItemProps[];
  megaMenu?: MenuItemProps[];
  multi_menu?: MenuItemProps[];
  nested?: MenuItemProps[];
  onClick: () => void;
}

export const menusConfig = {
  mainNav: [
    {
      title: "Dashboard",
      icon: DashBoard,
      child: [
        {
          title: "PS Performance",
          href: "/performance-dashboard",
          icon: Application,
        },
      ],
    },
  ],
  sidebarNav: {
    modern: [
      {
        title: "Dashboard",
        icon: DashBoard,
        child: [
          {
            title: "PS Performance",
            href: "/performance-dashboard",
            icon: Application,
          },
        ],
      },
    
      {
        title: "Application",
        icon: Application,
        child: [
          {
            title: "Capex Approval",
            icon: ClipBoard,
            nested: [
              {
                title: "Dashboard",
                icon: ClipBoard,
                href: "/capex/dashboard",
              },
              {
                title: "My Requests",
                icon: ClipBoard,
                href: "/capex/my-requests",
              },
              {
                title: "My Tasks",
                icon: ClipBoard,
                href: "/capex/my-tasks",
              },
              {
                title: "Types",
                icon: ClipBoard,
                href: "/capex/types",
              },
              {
                title: "Purposes",
                icon: ClipBoard,
                href: "/capex/purposes",
              },
              {
                title: "Approval Workflow",
                icon: ClipBoard,
                href: "/capex/approval-workflow",
              },
            ],
          },
        ],
      },
      {
        title: "Master",
        icon: ClipBoard,
        child: [
          {
            title: "Currencies",
            icon: DollarSign,
            href: "/currencies",
          },
          {
            title: "Companies",
            icon: Building,
            href: "/companies",
          },
          {
            title: "Departments",
            icon: ListOrdered,
            href: "/departments",
          },
          {
            title: "Divisions",
            icon: ListOrdered,
            href: "/divisions",
          },
        ],
      },
      {
        title: "Role and Permission",
        icon: ShieldCheck,
        child: [
          {
            title: "Modules",
            icon: Box,
            href: "/modules",
          },
          {
            title: "Roles",
            icon: UserCog,
            href: "/roles",
          },
          {
            title: "Permissions",
            icon: Key,
            href: "/permissions",
          },
          {
            title: "User Role",
            icon: Users,
            href: "/user-role-assignment",
          },
          {
            title: "User Permission",
            icon: ShieldCheck,
            href: "/user-permission-assignment",
          },
        ],
      },
      {
        title: "Profiling & Targeting",
        icon: Target,
        child: [
          {
            title: "Customer Profiling",
            href: "/customer-profiling/employee-listing-allowed",
            icon: Activity,
          },
          {
            title: "Manage Activity",
            href: "/manage-activities",
            icon: Calendar,
          },
        ],
      },
      
    ],
    classic: [
      {
        isHeader: true,
        title: "menu",
      },
      {
        title: "Dashboard",
        icon: DashBoard,
        href: "/performance-dashboard",
        child: [
          {
            title: "PS Performance",
            href: "/performance-dashboard",
            icon: Application,
          },
        ],
      },
    ],
  },
};

export type ModernNavType = (typeof menusConfig.sidebarNav.modern)[number];
export type ClassicNavType = (typeof menusConfig.sidebarNav.classic)[number];
export type MainNavType = (typeof menusConfig.mainNav)[number];
