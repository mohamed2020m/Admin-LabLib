import React, {useState} from 'react'
import {Helmet} from "react-helmet"

export default function Settings(){
    return(
        <>        
            <Helmet>
                <script>
                    document.title = "Settings"
                </script>
            </Helmet>
            <div className='mt-3'>
                This is Your settings
            </div>
        </>
    )
}