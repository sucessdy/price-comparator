import { useEffect, useState, type ReactNode } from "react";
import { defaultUser, type User } from "./user.types";
import { UserContext } from "./userContext";

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Failed to load user", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      const update = { ...prev, ...data };
      localStorage.setItem("user", JSON.stringify(update));
      return update;
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
