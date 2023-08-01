import {
  getServerSession,
  type DefaultSession,
} from "next-auth";
import { authOptions } from "./options";


export const getServerSessionRsc = () => getServerSession(authOptions)


declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}


// export const getServerAuthSession = (ctx: {
//   req: GetServerSidePropsContext["req"];
//   res: GetServerSidePropsContext["res"];
// }) => {
//   return getServerSession(ctx.req, ctx.res, authOptions);
// };

// for now
export const getServerAuthSession = () => {
  return getServerSession(authOptions);
};

