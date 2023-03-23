"use client";
import Header from "@/components/Header";
import { PropsWithChildren } from "react";
import { QueryClientProvider } from "react-query";
import { QueryClient } from "react-query";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import Authorized from "./Authorized";
import SignIn from "./SignIn";
import { useSelectedLayoutSegments } from "next/navigation";

const queryClient = new QueryClient();

export interface MainProps {
  session: Session | null;
}

const Main: React.FC<PropsWithChildren<MainProps>> = ({
  children,
  session,
}) => {
  const segments = useSelectedLayoutSegments();

  // We skip authorization for the /s (shared) post route.
  if (segments[0] === "s") {
    return (
      <MainContent session={session}>
        <main className="mx-auto h-full">{children}</main>
      </MainContent>
    );
  }

  if (session == null) {
    return (
      <MainContent session={null}>
        <SignIn />
      </MainContent>
    );
  }

  return (
    <SessionProvider session={session}>
      <MainContent session={session}>
        <Authorized>
          <main className="mx-auto h-full">{children}</main>
        </Authorized>
      </MainContent>
    </SessionProvider>
  );
};

const MainContent: React.FC<PropsWithChildren<{ session: Session | null }>> = ({
  children,
  session,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Header session={session} />
      {children}
    </QueryClientProvider>
  );
};

export default Main;
