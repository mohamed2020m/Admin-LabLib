import React, {useState, useEffect} from 'react'
import {Helmet} from "react-helmet"

import {GetCategory} from '../service/CategoryService';
import {GetCourse} from '../service/CourseService';
import {GetChapiter} from '../service/ChapiterService';
import {GetLabs} from '../service/LabsService';
import {GetUsers} from '../service/UserService';

export default function Home(){
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [chapiters, setChapiters] = useState([]);
    const [labs, setLabs] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        GetCategory().then(data => setCategories(data));
        GetCourse().then(data => {setCourses(data)});

        async function fetchChapiterData(){
            try{
                let res = await GetChapiter();
                if(res.ok){
                    let data = await res.json();
                    setChapiters(data);
                }
                else{
                    let err = await res.json();
                    throw err[0].message
                }
            }
            catch (err){
                console.log(err);
                toast.current.show({ severity: 'error', summary: 'Failed', detail: err, life: 6000 });
            };
        }
        async function fetchLabsData(){
            try{
                let res = await GetLabs();
                if(res.ok){
                    let data = await res.json();
                    setLabs(data);
                }
                else{
                    let err = await res.json();
                    throw err[0].message
                }
            }
            catch (err){
                console.log(err);
                toast.current.show({ severity: 'error', summary: 'Failed', detail: err, life: 6000 });
            };
        }
        async function fetchUsersData(){
            try{
                let res = await GetUsers();
                if(res.ok){
                    let data = await res.json();
                    setUsers(data);
                }
                else{
                    let err = await res.json();
                    throw err[0].message
                }
            }
            catch (err){
                console.log(err);
                toast.current.show({ severity: 'error', summary: 'Failed', detail: err, life: 6000 });
            };
        }
        fetchChapiterData();
        fetchLabsData();
        fetchUsersData()
    },[])

    const NumberOfUsersRegisteredToday = () =>{
        const RegistedTodayUserList = users.filter(item => {
            const d = new Date(item.createdAt);
            const now = new Date();
            return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDay() === now.getDay()
        })
        return RegistedTodayUserList.length
    }

    const NumberOfUsersRegisteredLastMonth = () =>{
        const RegistedLastMonthUserList = users.filter(item => {
            const d = new Date(item.createdAt);
            const now = new Date();
            return d.getFullYear() === now.getFullYear() && d.getMonth() === (now.getMonth() - 1)
        })
        return RegistedLastMonthUserList.length
    }

    return(
        <>        
            <Helmet>
                <script>
                    document.title = "Home"
                </script>
            </Helmet>
            <div className='mt-3'>
                <div className='mt-4'>
                    <h2 className="border-l-4 border-l-indigo-500 p-2">Quelques détails généraux: </h2>
                </div>
                <div className='flex flex-wrap mt-3'>
                    <div className='grow border-4 border-indigo-500 m-3 p-3 w-40 rounded-md'>
                        <div className='text-5xl text-center'>{labs.length}</div>
                        <div className="text-center">Labs</div>
                    </div>
                    <div className='grow border-4 border-[#ff9966] m-3 p-3 w-40 rounded-md'>
                        <div className='text-5xl text-center'>{chapiters.length}</div>
                        <div className="text-center">Chapiter</div>
                    </div>
                    <div className='grow border-4 border-[#00cc00] m-3 p-3 w-40 rounded-md'>
                        <div className='text-5xl text-center'>{courses.length}</div>
                        <div className="text-center">Cours</div>
                    </div>
                    <div className='grow border-4 border-[#ff6666] m-3 p-3 w-40 rounded-md'>
                        <div className='text-5xl text-center'>{categories.length}</div>
                        <div className="text-center">Categories</div>
                    </div>
                </div>
                <div className='mt-4'>
                    <h2 className="border-l-4 border-l-indigo-500 p-2">Quelques détails sur les utilisateurs: </h2>
                </div>
                <div className='flex mt-3 flex-wrap'>
                    <div className='grow bg-indigo-500 hover:opacity-75 text-white m-3 p-3 w-40 rounded-md'>
                        <div className='text-5xl text-center'>{NumberOfUsersRegisteredToday()}</div>
                        <div className="text-center">Nombre d'utilisateurs rejoints aujourd'hui</div>
                    </div>
                    <div className='grow bg-[#ff9966] hover:opacity-75 text-white m-3 p-3 w-40 rounded-md'>
                        <div className='text-5xl text-center'>{NumberOfUsersRegisteredLastMonth()}</div>
                        <div className="text-center">Nombre d'utilisateurs rejoints le mois dernier</div>
                    </div>
                    <div className='grow bg-[#00cc00] hover:opacity-75 text-white m-3 p-3 w-40 rounded-md'>
                        <div className='text-5xl text-center'>0</div>
                        <div className="text-center">Nombre d'utilisateurs actifs</div>
                    </div>
                    <div className='grow bg-[#ff6666] hover:opacity-75 text-white m-3 p-3 w-40 rounded-md'>
                        <div className='text-5xl text-center'>{users.length}</div>
                        <div className="text-center">Le nombre total d'utilisateurs</div>
                    </div>
                </div>
            </div>
        </>
    )
}