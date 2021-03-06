import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

const initialState = {
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [pathname, setPathName] = useState();

  const setPath = () => {
    const pathName = window.location.pathname.substring(1);
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
    <StateContext.Provider value={{ pathname, currentColor, activeMenu, screenSize, setPath, setScreenSize, setPathName, handleClick, isClicked, initialState, setIsClicked, setActiveMenu}}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
