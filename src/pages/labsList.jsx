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
import { Formik, Field} from 'formik';
import * as Yup from 'yup';
import '../css/DataTableCrud.css';
import {levels} from '../data/dummy'
import {GetCategory, GetCategoryItem} from '../service/CategoryService';
import {GetCourseItem} from './../service/CourseService'
import {GetLabs, PutLabs, DelLabs} from '../service/LabsService';
import {Time, findIdCourse, findIdCategory, findIdChapiter} from '../helpers/convertTimeToMilliSec'
import {useStateContext} from '../contexts/ContextProvider'

const codelabs = () => {

    let emptyLab = {
        id: "",
        name: '',
        description: '',
        level:'',
        chapter: '',
        category:'',
        course:'',
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
    const [filters, setFilters] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [chapiters, setChapiters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [idCategory, setIdCategory] = useState("");
    const [idCourse, setIdCourse] = useState("");
    const {activeMenu, setActiveMenu} = useStateContext();

    useEffect(() => {
        GetCategory().then(data => setCategories(data));
        !idCategory ? setIdCategory(findIdCategory(codelab.category, categories)) : null;
        idCategory && GetCategoryItem(idCategory).then(data => setCourses(data));
        !idCourse ? setIdCourse(findIdCourse(codelab.course, courses)) : null;
        idCourse && GetCourseItem(idCourse).then(data => setChapiters(data));

        setIsLoading(true);
        async function fetchData(){
            try{
                let res = await GetLabs();
                if(res.ok){
                    let data = await res.json();
                    setCodelabs(data);
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
    }, [isDeleted, isEdited, idCategory, idCourse]); // eslint-disable-line react-hooks/exhaustive-deps


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
        setCodelabDialog(false);
        setActiveMenu(true)
    }

    const hideDeleteCodelabDialog = () => {
        setDeleteCodelabDialog(false);
    }

    const hideDeleteCodelabsDialog = () => {
        setDeleteCodelabsDialog(false);
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
        setActiveMenu(false)
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
        if(rowData.level === 1){
            return <span className={`lab-badger lab-status-Easy`}>Facile</span>
        }else if(rowData.level === 2){
            return  <span className={`lab-badger lab-status-Medium`}>Moyen</span>
        }else if(rowData.level === 3){
            return <span className={`lab-badger lab-status-Hard`}>Difficile</span>
        }
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
                    <DataTable ref={dt} value={codelabs} stripedRows removableSort selection={selectedCodelabs} onSelectionChange={(e) => setSelectedCodelabs(e.value)}
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
                <Dialog visible={CodelabDialog} style={{ width: '450px' }} header="Modifier le Lab" modal className="p-fluid" onHide={hideDialog}>
                <Formik
                    initialValues={{
                        name: codelab.name, 
                        duration: msToTime(codelab.duration), 
                        description: codelab.description, 
                        level: codelab.level,
                        category: findIdCategory(codelab.category, categories), 
                        course: findIdCourse(codelab.course, courses), 
                        chapter: findIdChapiter(codelab.chapter, chapiters)
                    }}
                    validationSchema={Yup.object({
                        name: Yup.string()
                        .max(45, 'Must be 15 characters or less'),
                        // .required('Required'),
                        description: Yup.string()
                        .max(250, 'Must be 250 characters or less'),
                        // .required('Required'),
                        duration: Yup.string(),
                        // .required('Required'),
                    })}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        let data = new FormData();
                        for (let value in values) {
                            if(value === "duration") values[value] = Time(values[value])
                            data.append(value, values[value]);
                        }
                        setSubmitting(true);

                        let requestOptions = {
                            method: 'PUT',
                            body: data,
                            redirect: 'follow'
                        };
                        
                        try{
                            let res = await PutLabs(codelab.id, requestOptions)
                            if (res.ok){
                                let d = await res.json();
                                toast.current.show({ severity: 'success', summary: 'Créé avec succès!', detail: "Le lab a été modifie avec succès", life: 3000 });
                                setIsEdited(preIsEdited => (!preIsEdited));
                                setCodelabDialog(false);
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
                    {formik => (
                        <form className="w-full" onSubmit={formik.handleSubmit}>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                                        Nom
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                        id="name" 
                                        type="text"
                                        placeholder="Nom de cours" 
                                        {...formik.getFieldProps('name')}
                                    />
                                    {formik.touched.name && formik.errors.name ? (
                                        <div className="text-red-500 text-xs italic">{formik.errors.name}</div>
                                    ) : null}
                                </div>
                            </div>
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
                                    {formik.touched.duration && formik.errors.duration ? (
                                        <div className="text-red-500 text-xs italic">{formik.errors.duration}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="justify-between w-full px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="level">
                                        Sélectionnez le Niveau
                                    </label>
                                    <Field 
                                        id="level" name="level" as="select" 
                                        value={formik.values.level ? formik.values.level : "Sélectionnez le Niveau"} onChange={(e) => {formik.setFieldValue("level", e.target.value)}}
                                        className="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                    >
                                        <option disabled>Sélectionnez le Niveau</option>
                                        {levels.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </Field>
                                    
                                    {formik.touched.level && formik.errors.level ? (
                                        <div className="text-red-500 text-xs italic">{formik.errors.level}</div>
                                    ) : null}
                                </div>
                            </div>
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
                                        {categories.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        )
                                        )}
                                    </Field>
                                    {formik.touched.category && formik.errors.category ? (
                                        <div className="text-red-500 text-xs italic">{formik.errors.category}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="justify-between w-full px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="course">
                                        Sélectionnez un Cours
                                    </label>
                                    
                                    <Field 
                                        id="course" name="course" as="select" 
                                        value={formik.values.course ? formik.values.course : "Sélectionnez un Cours"} onChange={(e) => {formik.setFieldValue("course", e.target.value); setIdCourse(e.target.value)}}
                                        className="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                    >
                                        <option disabled defaultValue>Sélectionnez un Cours</option>
                                        {courses.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </Field>
                                    
                                    {formik.touched.course && formik.errors.course ? (
                                        <div className="text-red-500 text-xs italic">{formik.errors.course}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="justify-between w-full px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="chapter">
                                        Sélectionnez un Chapiter
                                    </label>
                                    <Field 
                                        id="chapter" name="chapter" as="select" 
                                        value={formik.values.chapter ? formik.values.chapter : "Sélectionnez un Chapiter"} onChange={(e) => {formik.setFieldValue("chapter", e.target.value)}}
                                        className="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                    >
                                        <option disabled>Sélectionnez un Chapiter</option>
                                        {chapiters !== [] && chapiters.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </Field>
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">
                                        Description
                                    </label>
                                    <textarea 
                                        id="description"
                                        rows="5" 
                                        placeholder='Description'
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        {...formik.getFieldProps('description')}
                                    >
                                    </textarea>
                                    {formik.touched.description && formik.errors.description ? (
                                        <div className="text-red-500 text-xs italic">{formik.errors.description}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="flex justify-end w-full px-3">
                                    <button className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded" type="submit">
                                        {formik.isSubmitting ? "Updating..." : "Update"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>
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