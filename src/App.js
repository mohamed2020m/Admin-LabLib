import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { BreadCrumb } from 'primereact/breadcrumb';

import { Navbar, Sidebar } from './components';

import Home from "./pages/home";
import Footer from "./components/Footer";
import Users from './pages/users.js';
import NewCategorie from "./pages/newCategorie";
import Categories from "./pages/Categories";
import NewCodeLabs from "./pages/CodeLabs";
import CodeLabs from "./pages/CodelabsList";
import Chapiter from "./pages/ChapiterList";
import NewChapiter from "./pages/newChapiter";
import Cours from "./pages/CoursList";
import NewCours from "./pages/newCourse";
import NoPage from "./pages/nopage";

import './css/App.css';

import { useStateContext } from './contexts/ContextProvider';

const App = () => {
    const {pathname, setCurrentMode, currentMode, activeMenu, themeSettings, setThemeSettings } = useStateContext();

    useEffect(() => {
        const currentThemeMode = localStorage.getItem('themeMode');
        if (currentThemeMode) {
            setCurrentMode(currentThemeMode);
        };
        
    });

    const home = { icon: 'pi pi-home', url: 'http://localhost:3000/' }

    return (
        <div className={currentMode === 'Dark' ? 'dark' : ''}>
            <BrowserRouter>
                <div className="flex relative dark:bg-main-dark-bg w-100">
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
                        <div className='m-3 p-4'>
                            <div className="card">
                                <BreadCrumb model={pathname} home={home}/>
                            </div>

                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="users" element={<Users />} />
                                <Route path="NewCategorie" element={<NewCategorie />} />
                                <Route path="categories" element={<Categories />} />
                                {/* <Route path="NewCodelab" element={<NewCodeLabs />} /> */}
                                <Route path="codelabs" element={<CodeLabs />} />
                                {/* <Route path="NewChapiter" element={<NewChapiter />} /> */}
                                {/* <Route path="chapiters" element={<Chapiter />} /> */}
                                <Route path="NewCours" element={<NewCours />} />
                                <Route path="cours" element={<Cours />} />
                                <Route path="*" element={<NoPage />} />    
                            </Routes>
                        </div>
                        <Footer />
                    </div>
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;