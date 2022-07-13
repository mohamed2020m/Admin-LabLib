import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Navbar, Sidebar, ThemeSettings } from './components';

import Home from "./pages/home";
import Users from './pages/users.js';
import NewCodeLabs from "./pages/CodeLabs";
import CodeLabs from "./pages/CodelabsList";
import Chapiter from "./pages/ChapiterList";
import NewChapiter from "./pages/Chapiter";
import Cours from "./pages/CoursList";
import NewCours from "./pages/Cours";
import NoPage from "./pages/nopage";

import './css/App.css';

import { useStateContext } from './contexts/ContextProvider';

const App = () => {
    const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();

    useEffect(() => {
        const currentThemeColor = localStorage.getItem('colorMode');
        const currentThemeMode = localStorage.getItem('themeMode');
        if (currentThemeColor && currentThemeMode) {
        setCurrentColor(currentThemeColor);
        setCurrentMode(currentThemeMode);
        }
    }, []);

    return (
        <div className={currentMode === 'Dark' ? 'dark' : ''}>
            <BrowserRouter>
                <div className="flex relative dark:bg-main-dark-bg w-100">
                    <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
                        <TooltipComponent
                            content="Settings"
                            position="Top"
                        >
                        <button
                            type="button"
                            onClick={() => setThemeSettings(true)}
                            style={{ background: currentColor, borderRadius: '50%' }}
                            className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
                        >
                            <FiSettings />
                        </button>

                        </TooltipComponent>
                    </div>
                    {activeMenu ? (
                        <div className="flex-1 w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                        <Sidebar />
                        </div>
                    ) : (
                        <div className="w-0 dark:bg-secondary-dark-bg">
                            <Sidebar />
                        </div>
                    )}
                    <div
                        className={
                        activeMenu
                            ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full overflow-hidden'
                            : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
                        }
                    >
                        <div className="static dark:bg-main-dark-bg navbar w-full bg-white">
                            <Navbar />
                        </div>
                        <div className='p-3'>
                            {themeSettings && (<ThemeSettings />)}

                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="users" element={<Users />} />
                                <Route path="newcodelab" element={<NewCodeLabs />} />
                                <Route path="codelabs" element={<CodeLabs />} />
                                <Route path="chapiters" element={<Chapiter />} />
                                <Route path="newchapiter" element={<NewChapiter />} />
                                <Route path="cours" element={<Cours />} />
                                <Route path="newcours" element={<NewCours />} />
                                <Route path="*" element={<NoPage />} />    
                            </Routes>
                        </div>
                        {/* <Footer /> */}
                    </div>
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;