
// prime css
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
// import 'primeflex/primeflex.css';
// import '../css/App.css';

import React, { useState, useEffect, useRef } from 'react';
import Helmet from "react-helmet"
// import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { UserService } from '../service/UserService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
// import { FileUpload } from 'primereact/fileupload';
// import { Rating } from 'primereact/rating';
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';
// import { InputTextarea } from 'primereact/inputtextarea';
// import { RadioButton } from 'primereact/radiobutton';
// import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import '../css/DataTableCrud.css';


const Users = () => {

    let emptyUser = {
        code: null,
        usesrname: '',
        name: '',
        email: '',
        hash: '',
        image: null,
        status:'',
        country:'',
        dateOfCreation:null
    };

    const [users, setUsers] = useState(null);
    // const [UserDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [user, setUser] = useState(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState(null);
    // const [submitted, setSubmitted] = useState(false);
    const [filters, setFilters] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    const statuses = [
        'online', 'offline'
    ];

    const userService = new UserService();


    useEffect(() => {
        userService.getUsers().then(data => setUsers(updateDateUsers(data)));
        initFilters();

    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    
    const updateDateUsers = (rowData) => {
        return [...rowData || []].map(d => {
            d.dateOfCreation = new Date(d.dateOfCreation);
            return d;
        });
    }

    const formatDate = (value) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }
    
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters( _filters);
        setGlobalFilter(value);
    }
    
    const clearFilter = () => {
        initFilters();
    }
    
    const initFilters = () => {
        setFilters({
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS }, 
            'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            'status': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        });
        setGlobalFilter('');
    }

    // const hideDialog = () => {
    //     setSubmitted(false);
    //     setUserDialog(false);
    // }

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    }

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    }

    // const saveUser = () => {
    //     setSubmitted(true);

    //     if (user.name.trim()) {
    //         let _Users = [...users];
    //         let _User = {...user};
    //         if (user.id) {
    //             const index = findIndexById(user.id);

    //             _Users[index] = _User;
    //             toast.current.show({ severity: 'success', summary: 'Successful', detail: 'user Updated', life: 3000 });
    //         }
    //         else {
    //             _User.id = createId();
    //             _User.image = 'user-placeholder.svg';
    //             _Users.push(_User);
    //             toast.current.show({ severity: 'success', summary: 'Successful', detail: 'user Created', life: 3000 });
    //         }

    //         setUsers(_Users);
    //         setUserDialog(false);
    //         setUser(emptyUser);
    //     }
    // }

    const confirmDeleteUser = (user) => {
        setUser(user);
        setDeleteUserDialog(true);
    }

    const deleteUser = () => {
        let _Users = users.filter(val => val.id !== user.id);
        setUsers(_Users);
        setDeleteUserDialog(false);
        setUser(emptyUser);
        toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'Utilisateur supprimé avec succès', life: 3000 });
    }

    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    }

    const deleteSelectedUsers = () => {
        let _Users = users.filter(val => !selectedUsers.includes(val));
        setUsers(_Users);
        setDeleteUsersDialog(false);
        setSelectedUsers(null);
        toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'Utilisateurs supprimés avec succès', life: 3000 });
    }
    
    const usernameBodyTemplate = (rowData) => {
        return <span>{rowData.username}</span>
    }

    const countryBodyTemplate = (rowData) => {
        
        return (
            <React.Fragment>
                {/* <img alt="flag" src="/images/flag/flag_placeholder.png" onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className={`flag flag-${rowData.country.code}`} width={30} /> */}
                <span className="image-text">{rowData.country.name}</span>
            </React.Fragment>
        )
    }

    const filterApplyTemplate = (options) => {
        return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} className="p-button-success"></Button>
    }

    const filterClearTemplate = (options) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} className="p-button-secondary"></Button>;
    }

    const hashBodyTemplate = (rowData) => {
        return <span>{rowData.hash}</span>;
    }

    const imageBodyTemplate = (rowData) => {
        return <img src={`images/user/${rowData.image}`} onError={(e) => e.target.src='https://www.citypng.com/public/uploads/preview/png-round-blue-contact-user-profile-icon-11639786938sxvzj5ogua.png'} alt={rowData.image} className="user-image" />
    }

    const emailBodyTemplate = (rowData) => {
        return  <span>{rowData.email}</span>
    }
    
    const statusFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Sélectionnez un statut" className="p-column-filter"/>;
    }

    const statusItemTemplate = (option) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    }
    
    const statusBodyTemplate = (rowData) => {
        return <span className={`user-badge status-${rowData.status}`}>{rowData.status}</span>;
    }

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.dateOfCreation);
    }

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteUser(rowData)} />
            </React.Fragment>
        );
    }

    let num =  filters !== null && Object.keys(filters).length > 0 ? Object.keys(filters).length : ""

    const header = (
        <div className="table-header">
            <div className='flex'>
                <div className="mt-2 mb-3 mx-1 p-0">
                    <Button type="button" icon="pi pi-filter-slash" label="Effacer les filtres" className=" m-0 p-button-outlined" onClick={clearFilter} />
                </div>
                <div className="mt-2 mb-3 mx-1 p-0">
                    <Button type="button" icon="pi pi-trash" label="Supprimer" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length}  />
                </div>
            </div>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} onChange={onGlobalFilterChange} placeholder="Chercher par nom..." />
            </span>
        </div>
    );
    // const UserDialogFooter = (
    //     <React.Fragment>
    //         <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
    //         <Button label="Sauvegarder" icon="pi pi-check" className="p-button-text" onClick={saveUser} />
    //     </React.Fragment>
    // );
    const deleteUserDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUserDialog} />
            <Button label="Oui" icon="pi pi-check" className="p-button-text" onClick={deleteUser} />
        </React.Fragment>
    );
    const deleteUsersDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUsersDialog} />
            <Button label="Oui" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedUsers} />
        </React.Fragment>
    );

    return (
        <>
            <Helmet>
                <script>
                    document.title = "Users"
                </script>
            </Helmet>
            
            <div className="datatable-crud">
                <Toast ref={toast} />
                <div className="card">
                    <DataTable ref={dt} value={users} selection={selectedUsers} onSelectionChange={(e) => setSelectedUsers(e.value)}
                        dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Montrant {first} à {last} des {totalRecords} utilisateurs"
                        globalFilter={globalFilter} filters={filters} filterDisplay="menu" header={header} emptyMessage="Aucun utilisateur trouvé." responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '0rem' }} exportable={false}></Column>
                        <Column field="id" header="Id" style={{ minWidth: '0rem' }}></Column>
                        <Column field="username" header="Username" body={usernameBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                        <Column field="country" filterField="country.name" header="Country" body={countryBodyTemplate} style={{ minWidth: '8rem' }} filter filterPlaceholder="Recherche par pays"
                            filterClear={filterClearTemplate} filterApply={filterApplyTemplate}></Column>
                        <Column field="name" header="Nom" sortable style={{ minWidth: '0rem' }}></Column>
                        <Column field="email" header="Email" body={emailBodyTemplate} style={{ minWidth: '0rem' }}></Column>
                        <Column field="hash" header="Hash" body={hashBodyTemplate}  style={{ minWidth: '0rem' }}></Column>
                        <Column field="image" header="Image" body={imageBodyTemplate}></Column>
                        <Column field="status" header="Status" body={statusBodyTemplate} filterMenuStyle={{boxShadow:'0px 1px 6px rgb(180, 178, 178)', width: '14rem' }} 
                            style={{ minWidth: '0rem' }} filter filterElement={statusFilterTemplate}></Column>
                        <Column field="dateOfCreation" header="Date de creation" dataType="date" filterField="dateOfCreation" body={dateBodyTemplate} style={{ minWidth: '0rem' }}
                            filter filterElement={dateFilterTemplate} ></Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                </div>

                <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                        {user && <span>Êtes-vous sûr de vouloir supprimer <b>{user.name}</b>?</span>}
                    </div>
                </Dialog>

                <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                        {user && <span>Êtes-vous sûr de vouloir supprimer les utilisateurs sélectionnés?</span>}
                    </div>
                </Dialog>
            </div>
        </>
    );
}
                
export default Users;