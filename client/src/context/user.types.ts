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
 
 export interface UserContextType  { 
     user : User, 
     setUser : React.Dispatch<React.SetStateAction< User> >   ,
    updateUser : (data : Partial<User>) => void, 
    loading : boolean 
 
 }

 export const defaultUser: User = {
   name: "Guest",
   email: "",
   preferences: {
     budget: 800,
     currency: "₹",
     dietary: "any",
   },
 };