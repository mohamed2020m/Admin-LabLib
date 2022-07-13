import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import {links, SiteLogo} from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  return (
    <div className="ml-3 h-screen hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-center items-center">
            <Link to="/" onClick={handleCloseSideBar} className="items-center gap-3 mt-4 flex font-extrabold tracking-tight">
              <SiteLogo />
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="absolute top-0 right-3 text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <AiOutlineClose />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10 ">
            {links.map((item) => (
              <div key={item.title}>
                <p className="text-gray-400 pl-2 dark:text-gray-400 m-3 mt-4 uppercase border-l-4 border-500">
                  {item.title}
                </p>
                {item.links.map((link) => (
                  <NavLink
                    to={link.url ? `/${link.url}` : "/"}
                    key={link.name}
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    {link.icon}
                    <span className="capitalize ">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
