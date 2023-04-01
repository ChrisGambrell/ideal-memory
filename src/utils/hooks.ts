import { useSession } from "next-auth/react";

export const useUser = () => {
  const session = useSession();
  if (!session.data) return new Error("useUser must be used within a protected route");
  return session.data.user;
};
