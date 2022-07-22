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

import {GetSteps, PutSteps, DelSteps} from '../service/StepsService';

const steps = () => {

    let emptyStep = {
        id: "",
        name: '',
        content:"",
        lab: '',
        rang:"",
        createdAt:null,
        updatedAt:null
    };

    const [steps, setSteps] = useState(null);
    const [StepDialog, setStepDialog] = useState(false);
    const [deleteStepDialog, setDeleteStepDialog] = useState(false);
    const [deleteStepsDialog, setDeleteStepsDialog] = useState(false);
    const [step, setStep] = useState(emptyStep);
    const [selectedSteps, setSelectedSteps] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [filters, setFilters] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        GetSteps().then(data =>{
            setSteps(data);
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

    const hideDeleteStepDialog = () => {
        setDeleteStepDialog(false);
    }

    const hideDeleteStepsDialog = () => {
        setDeleteStepsDialog(false);
    }

    const saveStep = () => {
        setSubmitted(true);

        if (step.name.trim()) {
            let _Steps = [...steps];
            let _Step = {...step};
            if (step.id) {
                const index = findIndexById(step.id);

                _Steps[index] = _Step;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'step Updated', life: 3000 });
            }
            else {
                _Step.id = createId();
                _Step.image = 'step-placeholder.svg';
                _Steps.push(_Step);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'step Created', life: 3000 });
            }

            setSteps(_Steps);
            // setUserDialog(false);
            setStep(emptyStep);
        }
    }

    const confirmDeleteStep = (step) => {
        setStep(step);
        setDeleteStepDialog(true);
    }

    const deleteStep = async () => {
        let _Steps = steps.filter(val => val.id !== step.id);
        setSteps(_Steps);
        try{
            let res = await DelSteps(step.id);
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
        setDeleteStepDialog(false);
        setStep(emptyStep);
        toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'Le Lab supprimé avec succès', life: 3000 });
    }

    const editStep = (step) => {
        setStep({...step});
        setStepDialog(true);
    }

    const confirmDeleteSelected = () => {
        setDeleteStepsDialog(true);
    }

    const deleteSelectedSteps = async () => {
        let allDelelted = 0;
        let _Steps = codelabs.filter(val => !selectedSteps.includes(val));
        setSteps(_Steps);
        for(let item of selectedSteps){
            try{
                let res = await DelSteps(item.id);
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
        setDeleteStepsDialog(false);
        setSelectedSteps(null);
        allDelelted === selectedSteps.length &&  toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'les labs supprimés avec succès', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _Steps = {...step};
        _Steps[`${name}`] = val;

        setStep(_Steps);
    }

    
    const titleBodyTemplate = (rowData) => {
        return <span>{rowData.name}</span>
    }

    const labBodyTemplate = (rowData) => {
        return <span>{rowData.lab}</span>
    }

    const rangBodyTemplate = (rowData) => {
        return <span>{rowData.rang}</span>
    }

    const contentBodyTemplate = (rowData) => {
        return <span>{rowData.content}</span>
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
    //     return <span className={`step-badge status-${rowData.status}`}>{rowData.status}</span>;
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editStep(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteStep(rowData)} />
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
                    <Button type="button" icon="pi pi-trash" label="Supprimer" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedSteps || !selectedSteps.length}  />
                </div>
            </div>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} onChange={onGlobalFilterChange} placeholder="Chercher par nom..." />
            </span>
        </div>
    );
    const StepDialogFooter = (
        <React.Fragment>
            <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Sauvegarder" icon="pi pi-check" className="p-button-text" onClick={saveStep} />
        </React.Fragment>
    );
    const deleteStepDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteStepDialog} />
            <Button label="Oui" icon="pi pi-check" className="p-button-text" onClick={deleteStep} />
        </React.Fragment>
    );
    const deleteStepsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteStepsDialog} />
            <Button label="Oui" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedSteps} />
        </React.Fragment>
    );

    return (
        <>
            <Helmet>
                <script>
                    document.title = "Steps"
                </script>
            </Helmet>
            <div className="datatable-crud">
                <Toast ref={toast} />
                {!isLoading ?
                <div className="card">
                    <DataTable ref={dt} value={steps} selection={selectedSteps} onSelectionChange={(e) => setSelectedSteps(e.value)}
                        dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Montrant {first} à {last} des {totalRecords} steps"
                        globalFilter={globalFilter} filters={filters} filterDisplay="menu" header={header} emptyMessage="Aucun step trouvé." responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '0rem' }} exportable={false}></Column>
                        <Column field="id" header="Id" sortable style={{ minWidth: '0rem' }}></Column>
                        <Column field="name" header="Title" sortable body={titleBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                        <Column field="content" header="Content" body={contentBodyTemplate} style={{ minWidth: '35rem' }}></Column>
                        <Column field="lab" header="Lab" sortable body={labBodyTemplate} style={{ minWidth: '0rem' }}></Column>
                        <Column field="rang" header="Rang" body={rangBodyTemplate} style={{ minWidth: '10rem' }}></Column>
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
                <Dialog visible={StepDialog} style={{ width: '450px' }} header="step Details" modal className="p-fluid" footer={StepDialogFooter} onHide={hideDialog}>
                    {step.image && <img src={`images/step/${step.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={step.image} className="step-image block m-auto pb-3" />}
                    <div className="field">
                        <label htmlFor="name">Name</label>
                        <InputText id="name" value={step.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !step.name })} />
                        {submitted && !step.name && <small className="p-error">Name is required.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="description">Description</label>
                        <InputTextarea id="description" value={step.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                    </div>
                </Dialog> 

                <Dialog visible={deleteStepDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteStepDialogFooter} onHide={hideDeleteStepDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                        {step && <span>Êtes-vous sûr de vouloir supprimer <b>{step.title}</b>?</span>}
                    </div>
                </Dialog>

                <Dialog visible={deleteStepsDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteStepsDialogFooter} onHide={hideDeleteStepsDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                        {step && <span>Êtes-vous sûr de vouloir supprimer les steps sélectionnés?</span>}
                    </div>
                </Dialog>
            </div>
        </>
    );
}
                
export default steps;