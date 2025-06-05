"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { store } from "@/lib/store";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";

type Props = {
  children: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      <Provider store={store}>
        <SidebarProvider>{children}</SidebarProvider>
      </Provider>
    </SessionProvider>
  );
};
