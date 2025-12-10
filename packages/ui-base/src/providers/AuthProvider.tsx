import { createContext, PropsWithChildren } from "react";
import { IAuthentication } from "@liberfi/core";

/**
 * Register the authentication strategy
 */
export const AuthContext = createContext<IAuthentication>({} as IAuthentication);

export function AuthProvider({
  authentication,
  children,
}: PropsWithChildren<{ authentication: IAuthentication }>) {
  return <AuthContext.Provider value={authentication}>{children}</AuthContext.Provider>;
}
