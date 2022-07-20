import React from 'react'
import Helmet from "react-helmet"
import nocontent from "../data/notFound.png"

export default function NoPage(){
    return(
        <div>
            <Helmet>
                <script>
                    document.title = "Not Found!"
                </script>
            </Helmet>
            <div className='flex justify-center align-center p-3 m-3'>
                <img src={nocontent} alt="page dones't exist"/>
            </div>
        </div>
    )
}