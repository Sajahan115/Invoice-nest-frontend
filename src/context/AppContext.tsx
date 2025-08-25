import { createContext, useState } from "react";
import { AppContextType, printType, userType } from "../utils/interfaces";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userDetails, setUserDetails] = useState<userType>();
  const [printContext, setPrintContext] = useState<printType | null>(null);

  const handleLoading = (
    isLoading: boolean,
    message: string = "Please wait..."
  ) => {
    setLoading(isLoading);
    setMessage(message);
  };

  return (
    <AppContext.Provider
      value={{
        loading,
        message,
        handleLoading,
        userDetails,
        setUserDetails,
        printContext,
        setPrintContext,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
