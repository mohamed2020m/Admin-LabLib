import React from 'react';
import { BreadCrumb } from 'primereact/breadcrumb';

const BreadcrumbCop = ({item}) => {
    const home = { icon: 'pi pi-home', url: 'https://admin-lablib.herokuapp.com'};

    return (
        <BreadCrumb model={item} home={home}/>
    );
};

export default BreadcrumbCop;