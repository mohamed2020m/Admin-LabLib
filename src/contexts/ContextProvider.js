import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

const initialState = {
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentMode, setCurrentMode] = useState('Light');
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [pathname, setPathName] = useState();

  const setMode = (prevMode) => {
    const nextMode = prevMode === 'Light' ? 'Dark' : 'Light';
    setCurrentMode(nextMode);
    localStorage.setItem('themeMode', nextMode);
  };
  
  const setPath = () => {
    const pathName = window.location.pathname.substr(1);
    setPathName(() => {
      return ( [
          {label: pathName},
      ])
    })
    localStorage.setItem('currentPath', pathName);
  }

  //currentColor
  const currentColor = '#03C9D7';
  
  const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider value={{ pathname, currentColor, currentMode, activeMenu, screenSize, setPath, setScreenSize, setPathName, handleClick, isClicked, initialState, setIsClicked, setActiveMenu, setCurrentMode, setMode, themeSettings, setThemeSettings }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
