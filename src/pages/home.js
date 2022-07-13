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
        </>
    )
}