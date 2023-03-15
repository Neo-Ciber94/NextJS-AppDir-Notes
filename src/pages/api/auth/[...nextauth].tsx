import { environment } from "@/lib/shared/env";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: environment.GOOGLE_CLIENT_ID,
      clientSecret: environment.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GithubProvider({
      clientId: environment.GITHUB_CLIENT_ID,
      clientSecret: environment.GITHUB_CLIENT_SECRET,
    }),
    AzureADB2CProvider({
      tenantId: environment.AZURE_AD_B2C_TENANT_NAME,
      clientId: environment.AZURE_AD_B2C_CLIENT_ID,
      clientSecret: environment.AZURE_AD_B2C_CLIENT_SECRET,
      primaryUserFlow: environment.AZURE_AD_B2C_PRIMARY_USER_FLOW,
      authorization: { params: { scope: "offline_access openid" } },
    }),
  ],
  pages: {
    signIn: "/",
  },
};

export default NextAuth(authOptions);
