import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { BreadCrumb } from 'primereact/breadcrumb';

import { Navbar, Sidebar } from './components';
import Footer from "./components/Footer";

import Home from "./pages/home";
import Users from './pages/users';
import NewCategorie from "./pages/newCategorie";
import Categories from "./pages/Categories";
import NewCours from "./pages/newCourse";
import Cours from "./pages/Cours";
import NewChapiter from "./pages/newChapiter";
import Chapiter from "./pages/ChapiterList";
import NewLab from "./pages/newLab";
import Steps from "./pages/stepsList";
import NewStep from "./pages/newStep";
import Labs from "./pages/labsList";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import NoPage from "./pages/nopage";

import './css/App.css';

import { useStateContext } from './contexts/ContextProvider';

const App = () => {
    const [path, setPath] = useState([{label: window.location.pathname.substring(1)}]);
    const {activeMenu} = useStateContext();

    useEffect(() => {
        setPath([{label: window.location.pathname.substring(1)}]);        
    }, []);

    const home = { icon: 'pi pi-home', url: 'https://admin-lablib.herokuapp.com'}

    return (
        <div>
            <BrowserRouter>
                <div className="flex relative w-100">
                    {activeMenu ? (
                        <div className="flex-1 w-72 fixed sidebar bg-white ">
                            <Sidebar />
                        </div>
                    ) : (
                        <div className="w-0">
                            <Sidebar />
                        </div>
                    )}
                    <div
                        className={
                        activeMenu
                            ? 'bg-main-bg min-h-screen md:ml-72 w-full overflow-hidden'
                            : 'bg-main-bg  w-full min-h-screen flex-2 '
                        }
                    >
                        <div className="navbar w-full bg-white shadow-lg sticky top-0 z-50">
                            <Navbar />
                        </div>
                        <div className='m-3 p-4'>
                            <div className="card">
                                <BreadCrumb model={path} home={home}/>
                            </div>

                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="users" element={<Users />} />
                                <Route path="NewCategorie" element={<NewCategorie />} />
                                <Route path="categories" element={<Categories />} />
                                <Route path="NewCours" element={<NewCours />} />
                                <Route path="cours" element={<Cours />} />
                                <Route path="NewChapiter" element={<NewChapiter />} /> 
                                <Route path="chapiters" element={<Chapiter />} />
                                <Route path="NewLab" element={<NewLab />} />
                                <Route path="labs" element={<Labs />} />
                                <Route path="steps" element={<Steps />} />
                                <Route path="NewStep" element={<NewStep />} />
                                <Route path="profile" element={<Profile />} />
                                <Route path="settings" element={<Settings />} />
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