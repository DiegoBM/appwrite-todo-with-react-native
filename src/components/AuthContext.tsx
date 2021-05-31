import {createContext} from 'react';

export type AppUserType = {
  $id: string;
};

export type AuthContextType = {
  user: AppUserType | null;
  signIn: (loggedInUser: AppUserType) => void;
  signOut: () => void;
};

export default createContext<AuthContextType>({
  user: null,
  signIn: () => {},
  signOut: () => {},
});
