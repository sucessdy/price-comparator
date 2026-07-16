import { createContext, useContext, useEffect, useState, type ReactNode} from "react";
export interface UserPreferences {
  budget: number;
  currency: string;
  dietary: "veg" | "non-veg" | "vegan" | "any";
  location?: string;
}
export interface User {
  id?: string | number;
  name: string;
  email?: string;
  avatar?: string;
  preferences: UserPreferences;
}

interface UserContextType  { 
    user : User, 
    setUser : React.Dispatch<React.SetStateAction< User> >   ,
   updateUser : (data : Partial<User>) => void, 
   loading : boolean 

}
const defaultUser: User = {
  name: "Guest",
  email: "",
  preferences: {
    budget: 800,
    currency: "₹",
    dietary: "any",
  },
};
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider  : React.FC<{children : ReactNode}>  =  ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser =  localStorage.getItem("user");
        if (savedUser) { 
            setUser(JSON.parse(savedUser)) ; 

        }
      } catch (error) {
        console.error("Failed to load user", error) ;
      }
      finally { 
  setLoading(false) ; 

      }
    };
    loadUser() ;  
  }, []);

  const updateUser  = (data : Partial<User>) => {
    setUser ( prev => { 
const update = {...prev , ...data} ; 
 localStorage.setItem('user', JSON.stringify(update)) ; 
 return update ; 
    })
  }

  return( <UserContext.Provider value={{ user, setUser,  updateUser , loading}}> 
{children}
  </UserContext.Provider>)
};


export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};