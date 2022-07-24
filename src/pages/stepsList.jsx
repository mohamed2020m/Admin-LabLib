// prime css
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
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Steps } from 'primereact/steps';
import { Editor } from 'primereact/editor';
import { Formik, Field} from 'formik';
import * as Yup from 'yup';
import {StepsBar} from '../data/dummy'
import {useStateContext} from '../contexts/ContextProvider'
import '../css/DataTableCrud.css';
import {Time, findIdCourse, findIdCategory, findIdChapiter} from '../helpers/convertTimeToMilliSec'
import {GetSteps, PutSteps, DelSteps} from '../service/StepsService';
import {GetCategory, GetCategoryItem} from '../service/CategoryService';
import {GetCourseItem} from './../service/CourseService'
import {GetChapiterItem} from './../service/ChapiterService'

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
    const [filters, setFilters] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [displayMaximizable, setDisplayMaximizable] = useState(false);
    const [showContent, setShowContent] = useState("");
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [chapiters, setChapiters] = useState([]);
    const [labs, setLabs] = useState([]);
    const [idCategory, setIdCategory] = useState("");
    const [idCourse, setIdCourse] = useState("");
    const [idChapiter, setIdChapiter] = useState("");
    const [currentBox, setCurrentBox] = useState(0);
    const {activeMenu, setActiveMenu} = useStateContext();

    useEffect(() => {
        GetCategory().then(data => setCategories(data));
        !idCategory ? setIdCategory(findIdCategory(step.category, categories)) : null;
        idCategory && GetCategoryItem(idCategory).then(data => setCourses(data));
        !idCourse ? setIdCourse(findIdCourse(step.course, courses)) : null;
        idCourse && GetCourseItem(idCourse).then(data => setChapiters(data));
        !idChapiter ? setIdChapiter(findIdChapiter(step.course, chapiters)) : null;
        idChapiter && GetChapiterItem(idChapiter).then(data => setLabs(data));
        setIsLoading(true);
        async function fetchData(){
            try{
                let res = await GetSteps();
                if(res.ok){
                    let data = await res.json();
                    setSteps(data);
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
        fetchData();
        initFilters();
    }, [isDeleted, isEdited, idCategory, idCourse, idChapiter]); // eslint-disable-line react-hooks/exhaustive-deps

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
        setStepDialog(false);
        setActiveMenu(true)
    }

    const hideDeleteStepDialog = () => {
        setDeleteStepDialog(false);
    }

    const hideDeleteStepsDialog = () => {
        setDeleteStepsDialog(false);
    }

    const confirmDeleteStep = (step) => {
        setStep(step);
        setDeleteStepDialog(true);
    }

    const deleteStep = async () => {
        let _Steps = steps.filter(val => val.id !== step.id);
        try{
            let res = await DelSteps(step.id);
            if (!res.ok){
                if(Array.isArray(res) && res.length === 0) return "error";
                let r = await res.json()
                throw r[0].message;
            }
            else{
                toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'le Step supprimé avec succès', life: 3000 });
                setSteps(_Steps);
            }
        }
        catch (err){
            toast.current.show({ severity: 'error', summary: 'Failed', detail: err, life: 3000 });
        } 
        setIsDeleted(preIsDeleted => (!preIsDeleted))
        setDeleteStepDialog(false);
        setStep(emptyStep);
    }

    const editStep = (step) => {
        setStep({...step});
        setStepDialog(true);
        setActiveMenu(false)
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


    const confirmDeleteSelected = () => {
        setDeleteStepsDialog(true);
    }

    const deleteSelectedSteps = async () => {
        let allDelelted = 0;
        let _Steps = steps.filter(val => !selectedSteps.includes(val));
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
        allDelelted === selectedSteps.length &&  setSteps(_Steps); toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'les Steps supprimés avec succès', life: 3000 });
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
        return <Button label="Preview" icon="pi pi-external-link" onClick={() => onClick('displayMaximizable', undefined ,rowData)} />
    }

    const dialogFuncMap = {
        'displayMaximizable': setDisplayMaximizable,
    }

    const onClick = (name, position, rowData) => {
        dialogFuncMap[`${name}`](true);
        setActiveMenu(false)
        setShowContent(rowData);
        if (position) {
            setPosition(position);
        }
    }

    const onHide = (name) => {
        setActiveMenu(true)
        dialogFuncMap[`${name}`](false);
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Close" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
            </div>
        );
    }

    const PreviewContent = (rowData) => {
        return  rowData.content
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
                    <DataTable ref={dt} value={steps} stripedRows removableSort selection={selectedSteps} onSelectionChange={(e) => setSelectedSteps(e.value)}
                        dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Montrant {first} à {last} des {totalRecords} steps"
                        globalFilter={globalFilter} filters={filters} filterDisplay="menu" header={header} emptyMessage="Aucun step trouvé." responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '0rem' }} exportable={false}></Column>
                        <Column field="id" header="Id" sortable style={{ minWidth: '0rem' }}></Column>
                        <Column field="name" header="Title" sortable body={titleBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                        <Column field="content" header="Content" body={contentBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                        <Column field="lab" header="Lab" sortable body={labBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                        <Column field="rang" header="Rang" body={rangBodyTemplate} style={{ minWidth: '0rem' }}></Column>
                        <Column field="createdAt" header="Créé à" body={createdDateBodyTemplate} style={{ minWidth: '13rem' }}></Column>
                        <Column field="updatedAt" header="Modifié à"  body={updatedDateBodyTemplate} style={{ minWidth: '13rem' }}></Column>
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
                <Dialog header="Aperçu le Step" visible={displayMaximizable} maximizable modal style={{ width: '70vw', height:'50vw'}} baseZIndex={2000000000000} footer={renderFooter('displayMaximizable')} onHide={() => onHide('displayMaximizable')}>
                    <iframe className='previewStep' srcDoc={PreviewContent(showContent)} height="100%" width="100%"></iframe>
                </Dialog>
                <Dialog visible={StepDialog} style={{ width: '750px' }} header="Modifier le Step" modal className="p-fluid" onHide={hideDialog}>
                <Formik
                    initialValues={{
                        name: step.name, 
                        demo:null, 
                        rang:1, 
                        duration: msToTime(step.duration), 
                        lab: step.lab, 
                        content:step.content, 
                        name: step.name, 
                        description: step.description, 
                        category: findIdCategory(step.category, categories), 
                        course: findIdCourse(step.course, courses), 
                        chapter: findIdChapiter(step.chapter, chapiters)
                    }}
                    validationSchema={Yup.object({
                        name: Yup.string()
                        .max(45, 'Must be 15 characters or less'),
                        // .required('Required'),
                        duration: Yup.string(),
                        // .required('Required'),
                        lab: Yup.string(),
                        chapter: Yup.string(),
                        course: Yup.string(),
                        category: Yup.string()
                        })
                    }
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        let data = new FormData();
                        for (let value in values) {
                            if(value === "duration") values[value] = Time(values[value])
                            data.append(value, values[value]);
                        }
                        setSubmitting(true);

                        var requestOptions = {
                            method: 'PUT',
                            body: data,
                            redirect: 'follow'
                        };
                        
                        try{
                            let res = await PutSteps(step.id, requestOptions)
                            if (res.ok){
                                let d = await res.json();
                                toast.current.show({ severity: 'success', summary: 'Updated!', detail: "Le Step a été modifier avec succès", life: 3000 });
                                resetForm();
                            }
                            else{
                                if(Array.isArray(res) && res.length === 0) return "error";
                                let r = await res.json()
                                throw r[0].message;
                            }
                        }
                        catch (err){
                            console.log("err: ", err);
                            toast.current.show({ severity: 'error', summary: 'Failed', detail: err, life: 3000 });
                        } 
                        setSubmitting(false);
                    }}
                >
                    {(formik) => (
                        <>
                            <div className='pb-3 mb-3'>
                                <Steps model={StepsBar} activeIndex={currentBox}  style={{marginBottom: '20px' }}/>
                            </div>
                            <div className='mt-3'>
                            <form className="w-full" onSubmit={formik.handleSubmit} encType="multipart/form-data">
                                
                                {currentBox === 0 &&
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full px-3 mb-6 md:mb-0">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                                            Titre
                                        </label>
                                        <input
                                            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                            id="name" 
                                            type="text"
                                            placeholder="Le Titre de Step" 
                                            {...formik.getFieldProps('name')}
                                        />
                                        {formik.touched.name && formik.errors.name ? (
                                            <div className="text-red-500 text-xs italic">{formik.errors.name}</div>
                                        ) : null}
                                    </div>
                                </div>
                                }
                                {currentBox === 1 &&
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full px-3">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="duration">
                                            Duration
                                        </label>
                                        <input 
                                            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                            id="duration" 
                                            type="text"
                                            placeholder="Example: 01:45" 
                                            {...formik.getFieldProps('duration')}
                                        />
                                        {formik.touched.description && formik.errors.description ? (
                                            <div className="text-red-500 text-xs italic">{formik.errors.description}</div>
                                        ) : null}
                                    </div>
                                </div>
                                }
                                {currentBox === 2 &&
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="justify-between w-full px-3">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="category">
                                            Sélectionnez une Catégorie
                                        </label>
                                        <Field 
                                            id="category" name="category" as="select" 
                                            value={formik.values.category ? formik.values.category : "Sélectionnez une Catégorie"} onChange={(e) => {formik.setFieldValue("category", e.target.value); setIdCategory(e.target.value)}}
                                            className="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                        >
                                            <option disabled>Sélectionnez une Catégorie</option>
                                            {categories && categories.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </Field>
                                        {formik.touched.category && formik.errors.category ? (
                                            <div className="text-red-500 text-xs italic">{formik.errors.category}</div>
                                        ) : null}
                                    </div>
                                </div>
                                }
                                {currentBox === 2 &&
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="justify-between w-full px-3">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="course">
                                            Sélectionnez un Cours
                                        </label>
                                        {idCategory ?
                                        <Field 
                                            id="course" name="course" as="select" 
                                            value={formik.values.course ? formik.values.course : "Sélectionnez un Cours"} onChange={(e) => {formik.setFieldValue("course", e.target.value); setIdCourse(e.target.value)}}
                                            className="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                        >
                                            <option disabled>Sélectionnez un Cours</option>
                                            {courses && courses.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </Field>
                                        :
                                        <Field 
                                            id="course" name="course" as="select" disabled
                                            className="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                        >
                                            <option disabled>Sélectionnez un Cours</option>
                                        </Field>
                                        }
                                        {formik.touched.course && formik.errors.course ? (
                                            <div className="text-red-500 text-xs italic">{formik.errors.course}</div>
                                        ) : null}
                                    </div>
                                </div>
                                }
                                {currentBox === 2 &&
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="justify-between w-full px-3">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="chapter">
                                            Sélectionnez un Chapiter
                                        </label>
                                        {idCourse ?
                                        <Field 
                                            id="chapter" name="chapter" as="select" 
                                            value={formik.values.chapter ? formik.values.chapter : "Sélectionnez un Chapiter"} onChange={(e) => {formik.setFieldValue("chapter", e.target.value); setIdChapiter(e.target.value)}}
                                            className="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                        >
                                            <option disabled>Sélectionnez un Chapiter</option>
                                            {chapiters !== [] && chapiters.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </Field>
                                        :
                                        <Field 
                                            id="chapter" name="chapter" as="select" disabled
                                            className="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                        >
                                            <option disabled>Sélectionnez un Chapiter</option>
                                        </Field>
                                        }
                                        {formik.touched.chapter && formik.errors.chapter ? (
                                            <div className="text-red-500 text-xs italic">{formik.errors.chapter}</div>
                                        ) : null}
                                    </div>
                                </div>
                                }
                                {currentBox === 2 &&
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="justify-between w-full px-3">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="lab">
                                            Sélectionnez un Lab
                                        </label>
                                        {idChapiter ?
                                        <Field 
                                            id="lab" name="lab" as="select" 
                                            value={formik.values.lab ? formik.values.lab : "Sélectionnez un Lab"} onChange={(e) => {formik.setFieldValue("lab", e.target.value)}}
                                            className="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                        >
                                            <option disabled>Sélectionnez un Lab</option>
                                            {labs !== [] && labs.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </Field>
                                        :
                                        <Field 
                                            id="lab" name="lab" as="select" disabled
                                            className="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                        >
                                            <option disabled>Sélectionnez un Lab</option>
                                        </Field>
                                        }
                                        {formik.touched.lab && formik.errors.lab ? (
                                            <div className="text-red-500 text-xs italic">{formik.errors.lab}</div>
                                        ) : null}
                                    </div>
                                </div>
                                }
                                {currentBox === 3 &&
                                <div className='my-3'>
                                    <Editor 
                                        id="content" style={{ height: '320px' }} name="content"
                                        value={formik.values.content} onTextChange={(e) => formik.setFieldValue("content", e.htmlValue)} 
                                        placeholder="Commencer à écrire le Step"
                                    />
                                </div>
                                }
                                {/* {currentBox === 4 &&
                                <div className='my-3'>
                                    That's it Click now on Create step and it's done.
                                </div>
                                } */}
                                <div className="flex  mb-6">
                                    {currentBox !== 0 && 
                                    <div className="flex justify-start w-full px-3">
                                        <button className="shadow bg-slate-600 hover:bg-slate-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded" 
                                        type="button"
                                        onClick={() => setCurrentBox(currentBox-1)}
                                        >
                                            prev
                                        </button>
                                    </div>
                                    }
                                    { currentBox !== 4 &&
                                    <div className="flex justify-end w-full px-3">
                                        <button className="shadow bg-green-700 hover:bg-green-400  focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded" 
                                        type="button"
                                        onClick={() => setCurrentBox(currentBox+1)}
                                        >
                                            Suivant
                                        </button>
                                    </div>
                                    }
                                    {currentBox === 4 &&
                                    <div className="flex justify-end w-full px-3">
                                        <button className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded" 
                                        type="submit"
                                        disabled={formik.isSubmitting}
                                        >
                                            {formik.isSubmitting ? "Updating..." : "Update"}
                                        </button>
                                    </div>
                                    }  
                                </div>
                            </form>
                            </div>
                        </>
                    )}
                </Formik>
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