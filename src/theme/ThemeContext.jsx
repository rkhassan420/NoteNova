import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light-theme");

  const handleLightTheme = () => {

    if(theme === "dark-theme"){

      setTheme("light-theme");
      localStorage.setItem("theme", "light-theme");
      
    }

  }

  const handleDarkTheme = () => {

    if(theme === "light-theme"){

      setTheme("dark-theme");
      localStorage.setItem("theme", "dark-theme");
      
    }

  }

   

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);


  
  return (
    <ThemeContext.Provider value={{ theme,handleLightTheme, handleDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
