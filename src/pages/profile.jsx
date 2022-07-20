import React, {useState} from 'react'
import {Helmet} from "react-helmet"


export default function Profile(){
    return(
        <>        
            <Helmet>
                <script>
                    document.title = "Profile"
                </script>
            </Helmet>
            <div className='mt-3'>
                This is Your profile
            </div>
        </>
    )
}