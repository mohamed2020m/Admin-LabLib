import React, {useState} from 'react'
import {Helmet} from "react-helmet"

export default function Home(){
    return(
        <>        
            <Helmet>
                <script>
                    document.title = "Home"
                </script>
            </Helmet>
            <div className='mt-3'>
                <div className='mt-4'>
                    <h2 className="border-l-4 border-l-indigo-500 p-2">Some General Details: </h2>
                </div>
                <div className='flex flex-wrap mt-3'>
                    <div className='grow border-4 border-indigo-500 m-3 p-3 w-40 rounded-md'>
                        <div className='text-5xl text-center'>78</div>
                        <div className="text-center">CodeLabs</div>
                    </div>
                    <div className='grow border-4 border-[#ff9966] m-3 p-3 w-40 rounded-md'>
                        <div className='text-5xl text-center'>55</div>
                        <div className="text-center">Chapiter</div>
                    </div>
                    <div className='grow border-4 border-[#00cc00] m-3 p-3 w-40 rounded-md'>
                        <div className='text-5xl text-center'>28</div>
                        <div className="text-center">Cours</div>
                    </div>
                    <div className='grow border-4 border-[#ff6666] m-3 p-3 w-40 rounded-md'>
                        <div className='text-5xl text-center'>10</div>
                        <div className="text-center">Categories</div>
                    </div>
                </div>
                <div className='mt-4'>
                    <h2 className="border-l-4 border-l-indigo-500 p-2">Some Details About Users: </h2>
                </div>
                <div className='flex mt-3 flex-wrap'>
                    <div className='grow bg-indigo-500 hover:opacity-75 text-white m-3 p-3 w-40 rounded-md'>
                        <div className='text-5xl text-center'>30</div>
                        <div className="text-center">Number of users Joined Today</div>
                    </div>
                    <div className='grow bg-[#ff9966] hover:opacity-75 text-white m-3 p-3 w-40 rounded-md'>
                        <div className='text-5xl text-center'>150</div>
                        <div className="text-center">Number of users Joined Last Monady</div>
                    </div>
                    <div className='grow bg-[#00cc00] hover:opacity-75 text-white m-3 p-3 w-40 rounded-md'>
                        <div className='text-5xl text-center'>80</div>
                        <div className="text-center">Number of Active users</div>
                    </div>
                    <div className='grow bg-[#ff6666] hover:opacity-75 text-white m-3 p-3 w-40 rounded-md'>
                        <div className='text-5xl text-center'>2000</div>
                        <div className="text-center">The Total of users</div>
                    </div>
                </div>
            </div>
        </>
    )
}