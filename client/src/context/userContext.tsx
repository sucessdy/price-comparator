

import { createContext } from "react";
import type { UserContextType } from "./user.types";

export const UserContext =
  createContext<UserContextType | undefined>(undefined)