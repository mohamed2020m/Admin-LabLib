import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { BreadCrumb } from 'primereact/breadcrumb';

import { Navbar, Sidebar } from './components';
import Footer from "./components/Footer";

import Home from "./pages/home";
import Users from './pages/users';
import NewCategorie from "./pages/newCategorie";
import Categories from "./pages/Categories";
import NewCodeLabs from "./pages/CodeLabs";
import CodeLabs from "./pages/CodelabsList";
import NewChapiter from "./pages/newChapiter";
import Chapiter from "./pages/ChapiterList";
import NewCours from "./pages/newCourse";
import Cours from "./pages/Cours";
import NoPage from "./pages/nopage";

import './css/App.css';

import { useStateContext } from './contexts/ContextProvider';

const App = () => {
    const {pathname, activeMenu, setPathName} = useStateContext();

    // useEffect(() => {
    //     const currentPath = localStorage.getItem('currentPath');
    //     if (currentPath) {
    //         setPathName([{label: currentPath}]);
    //     };
        
    // }, []);

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
                        <div className="static navbar w-full bg-white">
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
                                <Route path="NewCodelab" element={<NewCodeLabs />} />
                                <Route path="codelabs" element={<CodeLabs />} />
                                <Route path="NewChapiter" element={<NewChapiter />} /> 
                                <Route path="chapiters" element={<Chapiter />} />
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