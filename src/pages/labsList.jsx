// prime css
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';

import React, { useState, useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import Helmet from "react-helmet"

import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

import '../css/DataTableCrud.css';

import {GetLabs, PutLabs, DelLabs} from '../service/LabsService';

const codelabs = () => {

    let emptyLab = {
        id: "",
        name: '',
        description: '',
        level:'',
        chapter: '',
        steps:"",
        createdAt:null,
        updatedAt:null
    };

    const [codelabs, setCodelabs] = useState(null);
    const [CodelabDialog, setCodelabDialog] = useState(false);
    const [deleteCodelabDialog, setDeleteCodelabDialog] = useState(false);
    const [deleteCodelabsDialog, setDeleteCodelabsDialog] = useState(false);
    const [codelab, setCodelab] = useState(emptyLab);
    const [selectedCodelabs, setSelectedCodelabs] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [filters, setFilters] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        GetLabs().then(data =>{
            setCodelabs(data);
            initFilters();
            setIsLoading(false);
        })
    }, [isDeleted]); // eslint-disable-line react-hooks/exhaustive-deps

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
            // 'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            // 'status': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        });
        setGlobalFilter('');
    }

    const hideDialog = () => {
        setSubmitted(false);
        // setUserDialog(false);
    }

    const hideDeleteCodelabDialog = () => {
        setDeleteCodelabDialog(false);
    }

    const hideDeleteCodelabsDialog = () => {
        setDeleteCodelabsDialog(false);
    }

    const saveLab = () => {
        setSubmitted(true);

        if (codelab.name.trim()) {
            let _Users = [...codelabs];
            let _User = {...codelab};
            if (codelab.id) {
                const index = findIndexById(codelab.id);

                _Users[index] = _User;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'codelab Updated', life: 3000 });
            }
            else {
                _User.id = createId();
                _User.image = 'codelab-placeholder.svg';
                _Users.push(_User);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'codelab Created', life: 3000 });
            }

            setCodelabs(_Users);
            // setUserDialog(false);
            setCodelab(emptyLab);
        }
    }

    const confirmDeleteCodelab = (codelab) => {
        setCodelab(codelab);
        setDeleteCodelabDialog(true);
    }

    const deleteCodelab = async () => {
        let _Codelabs = codelabs.filter(val => val.id !== codelab.id);
        setCodelabs(_Codelabs);
        try{
            let res = await DelLabs(codelab.id);
            if (!res.ok){
                if(Array.isArray(res) && res.length === 0) return "error";
                let r = await res.json()
                throw r[0].message;
            }
            else{
                toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'le Lab supprimé avec succès', life: 3000 });
            }
        }
        catch (err){
            toast.current.show({ severity: 'error', summary: 'Failed', detail: err, life: 3000 });
        } 
        setIsDeleted(preIsDeleted => (!preIsDeleted))
        setDeleteCodelabDialog(false);
        setCodelab(emptyLab);
        toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'Le Lab supprimé avec succès', life: 3000 });
    }

    const editCodelab = (codelab) => {
        setCodelab({...codelab});
        setCodelabDialog(true);
    }

    const confirmDeleteSelected = () => {
        setDeleteCodelabsDialog(true);
    }

    const deleteSelectedCodelabs = async () => {
        let allDelelted = 0;
        let _Codelabs = codelabs.filter(val => !selectedCodelabs.includes(val));
        setCodelabs(_Codelabs);
        for(let item of selectedCodelabs){
            try{
                let res = await DelLabs(item.id);
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
                break;
            }
        }
        setDeleteCodelabsDialog(false);
        setSelectedCodelabs(null);
        allDelelted === selectedCodelabs.length &&  toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'les labs supprimés avec succès', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _User = {...codelab};
        _User[`${name}`] = val;

        setCodelab(_User);
    }

    
    const titleBodyTemplate = (rowData) => {
        return <span>{rowData.name}</span>
    }

    const durationBodyTemplate = (rowData) => {
        return <span>{msToTime(rowData.duration)}</span>
    }

    function msToTime(duration) {
        let milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
        
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }

    const levelBodyTemplate = (rowData) => {
        return <span className={`lab-badger lab-status-${rowData.level}`}>{rowData.level}</span>
    }

    const chapterBodyTemplate = (rowData) => {
        return <span>{rowData.chapter}</span>
    }

    const stepsBodyTemplate = (rowData) => {
        return <span>{rowData.steps}</span>
    }

    const descriptionBodyTemplate = (rowData) => {
        return <span>{rowData.description || "Empty!"}</span>
    }
    const filterApplyTemplate = (options) => {
        return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} className="p-button-success"></Button>
    }

    const filterClearTemplate = (options) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} className="p-button-secondary"></Button>;
    }

    const coursBodyTemplate = (rowData) => {
        return <span>{rowData.cours}</span>;
    }

    const chapiterBodyTemplate = (rowData) => {
        return  <span>{rowData.chapiter}</span>
    }
    
    // const statusFilterTemplate = (options) => {
    //     return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Sélectionnez un statut" className="p-column-filter"/>;
    // }

    // const statusItemTemplate = (option) => {
    //     return <span className={`customer-badge status-${option}`}>{option}</span>;
    // }
    
    // const statusBodyTemplate = (rowData) => {
    //     return <span className={`codelab-badge status-${rowData.status}`}>{rowData.status}</span>;
    // }

    const createdDateBodyTemplate = (rowData) => {
        return formatDate(new Date(rowData.createdAt));
    }

    const updatedDateBodyTemplate = (rowData) => {
        return formatDate(new Date(rowData.updatedAt));
    }

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editCodelab(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteCodelab(rowData)} />
            </React.Fragment>
        );
    }

    // let num =  filters !== null && Object.keys(filters).length > 0 ? Object.keys(filters).length : ""

    const header = (
        <div className="table-header">
            <div className='flex'>
                <div className="mt-2 mb-3 mx-1 p-0">
                    <Button type="button" icon="pi pi-filter-slash" className=" m-0 p-button-outlined" onClick={clearFilter} />
                </div>
                <div className="mt-2 mb-3 mx-1 p-0">
                    <Button type="button" icon="pi pi-trash" label="Supprimer" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedCodelabs || !selectedCodelabs.length}  />
                </div>
            </div>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} onChange={onGlobalFilterChange} placeholder="Chercher par nom..." />
            </span>
        </div>
    );
    const CodelabDialogFooter = (
        <React.Fragment>
            <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Sauvegarder" icon="pi pi-check" className="p-button-text" onClick={saveLab} />
        </React.Fragment>
    );
    const deleteCodelabDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCodelabDialog} />
            <Button label="Oui" icon="pi pi-check" className="p-button-text" onClick={deleteCodelab} />
        </React.Fragment>
    );
    const deleteCodelabsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCodelabsDialog} />
            <Button label="Oui" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedCodelabs} />
        </React.Fragment>
    );

    return (
        <>
            <Helmet>
                <script>
                    document.title = "Labs"
                </script>
            </Helmet>
            <div className="datatable-crud">
                <Toast ref={toast} />
                {!isLoading ?
                <div className="card">
                    <DataTable ref={dt} value={codelabs} selection={selectedCodelabs} onSelectionChange={(e) => setSelectedCodelabs(e.value)}
                        dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Montrant {first} à {last} des {totalRecords} codelabs"
                        globalFilter={globalFilter} filters={filters} filterDisplay="menu" header={header} emptyMessage="Aucun codelab trouvé." responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '0rem' }} exportable={false}></Column>
                        <Column field="id" header="Id" sortable style={{ minWidth: '0rem' }}></Column>
                        <Column field="name" header="Title" sortable body={titleBodyTemplate} style={{ minWidth: '13rem' }}></Column>
                        <Column field="duration" header="Durée" body={durationBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                        <Column field="level" header="Niveau" body={levelBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                        <Column field="chapter" header="Chapiter" sortable body={chapterBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                        <Column field="steps" header="Step" body={stepsBodyTemplate} style={{ minWidth: '1=0rem' }}></Column>
                        <Column field="description" header="Description"  body={descriptionBodyTemplate} style={{ minWidth: '15rem' }}></Column>
                        <Column field="createdAt" header="Créé à" filterField="createdAt" body={createdDateBodyTemplate} style={{ minWidth: '13rem' }}
                            filter filterElement={dateFilterTemplate} ></Column>
                        <Column field="updatedAt" header="Modifié à" filterField="updatedAt" body={updatedDateBodyTemplate} style={{ minWidth: '13rem' }}
                            filter filterElement={dateFilterTemplate} ></Column>
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
                <Dialog visible={CodelabDialog} style={{ width: '450px' }} header="codelab Details" modal className="p-fluid" footer={CodelabDialogFooter} onHide={hideDialog}>
                    {codelab.image && <img src={`images/codelab/${codelab.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={codelab.image} className="codelab-image block m-auto pb-3" />}
                    <div className="field">
                        <label htmlFor="name">Name</label>
                        <InputText id="name" value={codelab.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !codelab.name })} />
                        {submitted && !codelab.name && <small className="p-error">Name is required.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="description">Description</label>
                        <InputTextarea id="description" value={codelab.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                    </div>
                </Dialog> 

                <Dialog visible={deleteCodelabDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteCodelabDialogFooter} onHide={hideDeleteCodelabDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                        {codelab && <span>Êtes-vous sûr de vouloir supprimer <b>{codelab.title}</b>?</span>}
                    </div>
                </Dialog>

                <Dialog visible={deleteCodelabsDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteCodelabsDialogFooter} onHide={hideDeleteCodelabsDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                        {codelab && <span>Êtes-vous sûr de vouloir supprimer les codelabs sélectionnés?</span>}
                    </div>
                </Dialog>
            </div>
        </>
    );
}
                
export default codelabs;