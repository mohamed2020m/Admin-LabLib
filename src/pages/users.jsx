import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import React, { useState, useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import Helmet from "react-helmet"
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import '../css/DataTableCrud.css';

import { GetUsers, DelUser } from '../service/UserService';

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
    const [filters, setFilters] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);

    const statuses = [
        'online', 'offline'
    ];

    useEffect(() => {
        setIsLoading(true);
        async function fetchUsersData(){
            try{
                let res = await GetUsers();
                if(res.ok){
                    let data = await res.json();
                    setUsers(data);
                    setIsLoading(false);
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
        fetchUsersData()
        initFilters();

    }, [isDeleted]); // eslint-disable-line react-hooks/exhaustive-deps

    const url = 'https://lablib-api.herokuapp.com/api/v1/image';

    const updateDateUsers = (rowData) => {
        return [...rowData || []].map(d => {
            d.dateOfCreation = new Date(d.dateOfCreation);
            return d;
        });
    }

    const formatDate = (value) => {
        if(value){
            return value.toLocaleString('en-US');
        }
        return 
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

    const confirmDeleteUser = (user) => {
        setUser(user);
        setDeleteUserDialog(true);
    }

    const deleteUser = async () => {
        let _Users = users.filter(val => val.id !== user.id);
        setUsers(_Users);
        try{
            let res = await DelUser(user.id)
            if (!res.ok){
                if(Array.isArray(res) && res.length === 0) return "error";
                let r = await res.json()
                throw r[0].message;
            }
            else{
                toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'L\'Utilisateur est supprimé avec succès', life: 3000 });
            }
        }
        catch (err){
            toast.current.show({ severity: 'error', summary: 'Failed', detail: err, life: 3000 });
        } 
        setIsDeleted(preIsDeleted => (!preIsDeleted));
        setDeleteUserDialog(false);
        setUser(emptyUser);
    }

    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    }

    const deleteSelectedUsers = async () => {
        let allDelelted = 0;
        let _Users = users.filter(val => !selectedUsers.includes(val));
        setUsers(_Users);
        for(let item of selectedUsers){
            try{
                let res = await DelUser(item.id);
                if (!res.ok){
                    if(Array.isArray(res) && res.length === 0) return "error";
                    let r = await res.json()
                    throw r[0].message;
                }
                else{
                    allDelelted += 1;
                }
            }
            catch (err){
                toast.current.show({ severity: 'error', summary: 'Failed', detail: err, life: 3000 });
                return
            } 
        }
        setDeleteUsersDialog(false);
        setIsDeleted(preIsDeleted => (!preIsDeleted));
        setSelectedUsers(null);
        allDelelted === selectedUsers.length && toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'les utilisateurs sont supprimés avec succès', life: 3000 });
    }
    
    // const usernameBodyTemplate = (rowData) => {
    //     return <span>{rowData.username}</span>
    // }

    const firstnameBodyTemplate = (rowData) => {
        return <span>{rowData.firstname}</span>
    }
    const lastnameBodyTemplate = (rowData) => {
        return <span>{rowData.lastname}</span>
    }
    const countryBodyTemplate = (rowData) => {
        
        return (
            <React.Fragment>
                {/* <img alt="flag" src="/images/flag/flag_placeholder.png" onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className={`flag flag-${rowData.country.code}`} width={30} /> */}
                <span className="image-text">{}</span>
            </React.Fragment>
        )
    }

    const filterApplyTemplate = (options) => {
        return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} className="p-button-success"></Button>
    }

    const filterClearTemplate = (options) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} className="p-button-secondary"></Button>;
    }

    // const hashBodyTemplate = (rowData) => {
    //     return <span>{rowData.hash}</span>;
    // }

    const imageBodyTemplate = (rowData) => {
        return <img src={`${url}${rowData.image}`} onError={(e) => e.target.src='https://www.citypng.com/public/uploads/preview/png-round-blue-contact-user-profile-icon-11639786938sxvzj5ogua.png'} alt={rowData.image} className="user-image" />
    }

    const emailBodyTemplate = (rowData) => {
        return  <span>{rowData.email}</span>
    }

    const roleBodyTemplate = (rowData) => {
        return  <span>{rowData.role}</span>
    }
    
    const activeBodyTemplate = (rowData) => {
        return  <span>{formatDate(new Date(rowData.active))}</span>
    }

    const MFABodyTemplate = (rowData) => {
        return  <span>{rowData.MFA}</span>
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
        return formatDate(new Date(rowData.createdAt));
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

    const header = (
        <div className="table-header">
            <div className='flex'>
                <div className="mt-2 mb-3 mx-1 p-0">
                    <Button type="button" icon="pi pi-filter-slash" className=" m-0 p-button-outlined" onClick={clearFilter} />
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
                {!isLoading ?
                <div className="card">
                    <DataTable ref={dt} value={users} selection={selectedUsers} onSelectionChange={(e) => setSelectedUsers(e.value)}
                        dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Montrant {first} à {last} des {totalRecords} utilisateurs"
                        globalFilter={globalFilter} filters={filters} filterDisplay="menu" header={header} emptyMessage="Aucun utilisateur trouvé." responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '0rem' }} exportable={false}></Column>
                        <Column field="id" header="Id" style={{ minWidth: '0rem' }}></Column>
                        <Column field="firstname" header="FirstName" body={firstnameBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                        <Column field="lastname" header="LastName" body={lastnameBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                        <Column field="email" header="Email" body={emailBodyTemplate} style={{ minWidth: '0rem' }}></Column>
                        <Column field="image" header="Image" body={imageBodyTemplate}></Column>
                        <Column field="role" header="Role" body={roleBodyTemplate}  style={{ minWidth: '0rem' }}></Column>
                        {/* <Column field="name" header="Nom" sortable style={{ minWidth: '0rem' }}></Column> */}
                        <Column field="country" filterField="country.name" header="Country" body={countryBodyTemplate} style={{ minWidth: '8rem' }} filter filterPlaceholder="Recherche par pays"
                            filterClear={filterClearTemplate} filterApply={filterApplyTemplate}></Column>
                        <Column field="status" header="Status" body={statusBodyTemplate} filterMenuStyle={{boxShadow:'0px 1px 6px rgb(180, 178, 178)', width: '14rem' }} 
                            style={{ minWidth: '0rem' }} filter filterElement={statusFilterTemplate}></Column>
                        <Column field="MFA" header="MFA" body={MFABodyTemplate}  style={{ minWidth: '0rem' }}></Column>
                        <Column field="active" header="Active" body={activeBodyTemplate}  style={{ minWidth: '13rem' }}></Column>
                        <Column field="createdAt" header="Date de creation" dataType="date" body={dateBodyTemplate} style={{ minWidth: '13rem' }}></Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                </div>
                :
                <div className="card py-4">
                    <div className="flex flex-wrap justify-between mb-3">
                        <div className='flex'>
                            <div className='mr-3'>
                                <Skeleton width={100} height={50}/>
                            </div>
                            <div>
                                <Skeleton width={100} height={50}/>
                            </div>
                        </div>
                        <div className='pr-3'>
                            <Skeleton width={150} height={50}/>
                        </div>
                    </div>
                    <Skeleton height={30}/>
                    <Skeleton count={8} height={25}/>
                </div>
                }
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