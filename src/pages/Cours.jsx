// prime css
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';

import React, { useState, useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import Helmet from "react-helmet"

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { FileUpload } from 'primereact/fileupload';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import '../css/DataTableCrud.css';


import {GetCourse, PostCourse, PutCourse, DelCourse} from '../service/CourseService';

const Cours = () => {
    const url = 'https://lablib-api.herokuapp.com/api/v1/image';
    let emptyCourse = {
        id: null,
        name: '',
        level: '',
        category: '',
        description: '',
        dateOfCreation:null
    };

    const [courses, setCourses] = useState(null);
    const [CourseDialog, setCourseDialog] = useState(false);
    const [deleteCourseDialog, setDeleteCourseDialog] = useState(false);
    const [deleteCoursesDialog, setDeleteCoursesDialog] = useState(false);
    const [course, setCourse] = useState(emptyCourse);
    const [selectedCourses, setSelectedCourses] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [filters, setFilters] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    // const [file, setFile] = useState(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const dt = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        GetCourse().then(data => {
            setCourses(data);
            setIsLoading(false);
        });
        initFilters();
    }, [isDeleted]); // eslint-disable-line react-hooks/exhaustive-deps

    // const updateDateCategory = (rowData) => {
    //     return [...rowData || []].map(d => {
    //         d.dateOfCreation = new Date(d.dateOfCreation);
    //         return d;
    //     });
    // }

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

    // const openNew = () => {
    //     setCourse(emptyCourse);
    //     setSubmitted(false);
    //     setCourseDialog(true);
    // }

    const hideDialog = () => {
        setSubmitted(false);
        setCourseDialog(false);
    }

    const hideDeleteCategoryDialog = () => {
        setDeleteCourseDialog(false);
    }

    const hideDeleteCategoriesDialog = () => {
        setDeleteCoursesDialog(false);
    }

    const saveCategory = async (File) => {
        setSubmitted(true);

        if (course.name.trim()) {
            let _Categories = [...courses];
            let _Category = {...course};

            if (course.id) {
                const index = findIndexById(course.id);
                _Categories[index] = _Category;
                try{
                    let res = await PutCourse(course.id, _Category);
                    if (res.ok){
                        let d = await res.json();
                        toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'Categorie modifier avec succès', life: 3000 });
                    }
                    else{
                        if(Array.isArray(res) && res.length === 0) return "error";
                        let r = await res.json()
                        throw r[0].message;
                    }
                }
                catch (err){
                    toast.current.show({ severity: 'error', summary: 'Failed', detail: err, life: 3000 });
                } 
            }
            else {
                // this block is not used yet! by leeuw
                // console.log("creating... ")
                // let res = await PostCourse(formData)
                // console.log("finished!");
                console.log("res: ", res);
                _Categories.push(_Category);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Category Created', life: 3000 });
            }
            setCourses(_Categories);
            setCourseDialog(false);
            setCourse(emptyCourse);
        }
    }

    const editCategory = (course) => {
        setCourse({...course});
        setCourseDialog(true);
    }

    const confirmDeleteCategory = (course) => {
        setCourse(course);
        setDeleteCourseDialog(true);
    }

    const deleteCategory = async () => {
        let _courses = courses.filter((val) => {
            val.id !== course.id;
        });
        setCourses(_courses);
        try{
            let res = await DelCourse(course.id)
            if (!res.ok){
                if(Array.isArray(res) && res.length === 0) return "error";
                let r = await res.json()
                throw r[0].message;
            }
            else{
                toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'Le Cours supprimé avec succès', life: 3000 });
            }
        }
        catch (err){
            toast.current.show({ severity: 'error', summary: 'Failed', detail: err, life: 3000 });
        } 
        setIsDeleted(preIsDeleted => (!preIsDeleted));
        setDeleteCourseDialog(false);
        setCourse(emptyCourse);
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < courses.length; i++) {
            if (courses[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    const confirmDeleteSelected = () => {
        setDeleteCoursesDialog(true);
    }

    const deleteSelectedCategories = async () => {
        let allDelelted = 0;
        let _courses = courses.filter(val => !selectedCourses.includes(val));
        setCourses(_courses);
        for(let item of selectedCourses){
            try{
                let res = await DelCourse(item.id);
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
        setDeleteCoursesDialog(false);
        setSelectedCourses(null);
        allDelelted === selectedCourses.length && toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'les courses supprimés avec succès', life: 3000 });
    }

    const onInputFileChange = (e, name) => {
        console.log("image: ", e);
        const val = (e.files && e.files[0].name) || '';
        let _Category = {...course};
        _Category[`${name}`] = val;
        setCourse(_Category);
    }
    
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _Category = {...course};
        _Category[`${name}`] = val;
        setCourse(_Category);
    }

    const titleBodyTemplate = (rowData) => {
        return <span>{rowData.name}</span>
    }

    const levelBodyTemplate = (rowData) => {
        return <span>{rowData.level || "None"}</span>
    }

    const nchapitersBodyTemplate = (rowData) => {
        return <span>{rowData.chapters || 0}</span>
    }
    
    const categoryBodyTemplate = (rowData) => {
        return <span>{rowData.category || "None"}</span>
    }
    
    const descriptionBodyTemplate = (rowData) => {
        return <span>{rowData.description || "Empty!"}</span>
    }
    
    const imageBodyTemplate = (rowData) => {
        return <img src={`${url}/${rowData.image}`} onError={(e) => e.target.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAABmJLR0QA/wD/AP+gvaeTAAAE9ElEQVRoge2Ze2xTVRzHP/f2tmtHH2u3sQePhQ3lsYSgPEJC1EEIiCivgRgICzImI0wIExAVNJI4EzATGTrCIwoBIYIhIcFACCgKiCAvN2JiEGGQzbCtZYy+H9c/yupK260bhULS7z899/f7nfP73HNOT36nFQaMnqzD66sUoBAw8uTLAuxXqDXl0n3wBfEm6oKMQInXYUcUYHq8abqpQgkwtT2VyhZyfS4ADotajgs9ABjUy0rZy3UAuDwCy3YMDIzgfQkwCgAItTLi1ceEDiap/VOuz0U+TgAuoA7YdRoPQ3JaAT98e8npIPf0txXXBUB+hLzBEh9bpkegoJk/LGoDM17TbuZvmdVsO9YbAI8veObFWgG0/tkWGoJ9j1rCwFGvPr51jrGe7m0zVHbEm6HbEv4eMSSxbeKhBHy8lICPlxLw8VJ08IKAZuQoEKMLV6Snk/xiAT0KxqLsm9MFGtGfR4iuRpI6DwHDrNmklq+kYVEx9vO/R86tN5D27gdox40PAnBcPE/jJx/jrrvRYR5j8UKMJaXcmj0T19W/Hh5eYUjBuGAh7uvXcFy+FBlcqyV7y9eocvOwnjiO7cRPyE4H6uEj0U+ZTvb2ndQXF0V8ASkjk5S583D+eQXXtehuNJ3CmxYvQdQbuL3mPWSPJ2KcceFiVLl5NH++npY9uwL2e0ePYD12lKyN1aS//yH1pcVh+6cuW4GgUtG0rgJ8vqjgO9zESQMGops8DeuJH7H9eipinCBJ6CZNxllbQ8ve3SF++9kz3D2wH/Xzw1H26Rvi1wwbQY+x42g9dBDnldqowDuGFwRSy1cie72YN1aiMJrQvTYlbKiUkYmo1WK/cA7k8HWe7fRJAFT9n3mAQCT1nZX4bFbM1VVIGZloJ7zycPDa8RNRPzeMll07cN+sQztxEulr1qLs3Sf0PdX+W5fXYomYSLbb/bEaTZBdP2MWqv7PYtm6GW9TE7pphfRcW4Go03cPXlCrMS1egqfxNnd2bPfbJKXfKUV1QEUlUW/AWFKK+2Ydd/ftvZ9HAkHwf3bWP5zR+GYJUmYW5qoN+Gy2mME+KNOiMhSGFJor1yG7XF3uHwKv7NUbw5y5OGouc+/IDzGBDCdVbh66qYXYTv6M7dQv3RojZG1Mby9DUCUhSBIZFesCdmVOPwDSylfgs1oB8DQ3Y97wWbcSpy5fhaBQIOr1ZHy6PmBv+0Knr/4osBru+nrMmzaEHAYh8ApTKgBJg/JJGpQfklQzanSg7bWYubNtc+BcFhQd7NO20sLrj1WkpgGgHjI0bHjyCwWBtuffBixbq5EdwfftkGz1b80LO1hK0XxMZUu5+fpU3Nf/CfLJPhlkGVVuXkT2tlPK29QIwK1Z08LGmcqWklI0nxsTxuC1mCOOBzGqKn13W3BeqSW5YAxSVnaIX1CrMcwpwtfaiqPmj1ikBGJYEpurqxDVGrK++JKkwf9vNykrm8zKKpR9+mLZ8hWyyxmrlNFVldHIfu43GivWkrZqNb2++RZ33Q1ktxtVv1wQRVp276Tluz2xSgd0Ad5x8Tz2M6fxNNRHjGk9eADHpQvoZ75B0uB8BKWK1kMH/fYOKtL2sp87izKnH96WO53GJn50ipcS8PFSAj5eSsDHS089fMel25MrsyjD9/Gm6JYEeZ/ktHnLNcmSLCPPoN1f+U+wzAjyPofVt/w/cSyJn0mj7McAAAAASUVORK5CYII="} alt={rowData.image} className="course-image" />
    }

    const filterApplyTemplate = (options) => {
        return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} className="p-button-success"></Button>
    }

    const filterClearTemplate = (options) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} className="p-button-secondary"></Button>;
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

    const dateBodyTemplate = (rowData) => {
        return formatDate(new Date(rowData.createdAt));
    }

    const dateUpdatedBodyTemplate = (rowData) => {
        return formatDate(new Date(rowData.updatedAt));
    }

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-3" onClick={() => editCategory(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteCategory(rowData)} />
            </React.Fragment>
        );
    }

    // let num =  filters !== null && Object.keys(filters).length > 0 ? Object.keys(filters).length : ""

    const header = (
        <div className="table-header">
            <div className='flex'>
                {/* <div className="mt-2 mb-3 mx-1 p-0">
                    <Button type="button" icon="pi pi-plus" label="New" className="p-button-success " onClick={openNew}/>
                </div> */}
                <div className="mt-2 mb-3 mx-1 p-0">
                    <Button type="button" icon="pi pi-filter-slash"  className=" m-0 p-button-outlined" onClick={clearFilter} />
                </div>
                <div className="mt-2 mb-3 mx-1 p-0">
                    <Button type="button" icon="pi pi-trash" label="Supprimer" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedCourses || !selectedCourses.length}  />
                </div>
            </div>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} onChange={onGlobalFilterChange} placeholder="Chercher par nom..." />
            </span>
        </div>
    );
    const CategoryDialogFooter = (
        <React.Fragment>
            <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Sauvegarder" icon="pi pi-check" className="p-button-text" onClick={saveCategory} />
        </React.Fragment>
    );
    const deleteCategoryDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCategoryDialog} />
            <Button label="Oui" icon="pi pi-check" className="p-button-text" onClick={deleteCategory} />
        </React.Fragment>
    );
    const deleteCategoriesDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCategoriesDialog} />
            <Button label="Oui" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedCategories} />
        </React.Fragment>
    );


    // Uploading file
    
    const onTemplateSelect = (e) => {
        console.log("e: ", e.files[0]);
        let _totalSize = e.files[0].size || 0;
        setTotalSize(_totalSize);
    }

    const onTemplateUpload = (e) => {
        let _totalSize = e.files[0].size || 0;

        setTotalSize(_totalSize);
        toast.current.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
    }

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    }

    const onTemplateClear = () => {
        setTotalSize(0);
    }

    const headerTemplate = (options) => {
        const { className, chooseButton} = options;
        const value = totalSize/10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{backgroundColor: 'transparent', display: 'flex', alignItems: 'center'}}>
                <div style={{width:"40px", heigth:"20px"}}>
                    {chooseButton}
                </div>
                <ProgressBar value={value} displayValueTemplate={() => `${formatedValue} / 1 MB`} style={{width: '300px', height: '20px', marginLeft: 'auto'}}></ProgressBar>
            </div>
        );
    }

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{width: '90%'}}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <div className='flex flex-grow-1'>
                        <div style={{width: '100%'}}>
                            <div className="text-left ml-3">
                                {file.name}
                            </div>
                            <div className="text-left ml-3">
                                <small>{new Date().toLocaleDateString()}</small>
                            </div>
                            <div className="text-left ml-3">
                                <Tag value={props.formatSize} severity="warning" className="px-3 py-2"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Button type="button" icon="pi pi-times" className="w-8 h-8 p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
                </div>
            </div>
        )
    }

    const emptyTemplate = () => {
        return (
            <div className="flex flex-column justify-center items-center">
                <div className='flex items-center justify-content-center'>
                    <i className="pi pi-image mt-3 p-5" style={{'fontSize': '3em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)'}}></i>
                </div>
                <div className='flex items-center justify-center'>
                    <span style={{'fontSize': '1.2em', color: 'var(--text-color-secondary)'}} className="my-5 ml-2">Faites glisser et déposez l'image ici</span>
                </div>
            </div>
        )
    }

    const chooseOptions = {icon: 'pi pi-fw pi-images', iconOnly: true, className: 'w-16 h-16 custom-choose-btn p-button-rounded p-button-outlined'};
    const uploadOptions = {icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'};
    const cancelOptions = {icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'};

    const myUploader = (e) => {
        const file = e.files[0];
        console.log("Files: ", e.files[0], " file: ", file);
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            console.log("inside the myUploader, e: ", e.target.result);
            saveCategory(e.target.result);
        };
        fileReader.readAsDataURL(file);
    };
    //End uploading File
    return (
        <>
        <Helmet>
            <script>
                document.title = "Cours"
            </script>
        </Helmet>
        <div className="datatable-crud">
            <Toast ref={toast} />
            {!isLoading ?
            <div className="card">
                <DataTable ref={dt} value={courses} stripedRows removableSort selection={selectedCourses}
                    onSelectionChange={(e) => setSelectedCourses(e.value)}
                    dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Montrant {first} à {last} des {totalRecords} course"
                    globalFilter={globalFilter} filters={filters} filterDisplay="menu" header={header} 
                    emptyMessage="Aucun Cours trouvé." responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '0rem' }} exportable={false}></Column>
                    <Column field="id" sortable header="Id" style={{ minWidth: '0rem' }}></Column>
                    <Column field="name" sortable header="Nom" body={titleBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                    <Column field="image" header="Image" body={imageBodyTemplate}></Column>
                    {/* <Column field="level" header="Niveau" body={levelBodyTemplate} style={{ minWidth: '10rem' }}></Column> */}
                    <Column field="Nchapiters" header="Nombre de Chapiter" body={nchapitersBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                    <Column field="category" header="Categorie" body={categoryBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                    <Column field="description" header="Description"  body={descriptionBodyTemplate} style={{ minWidth: '15rem' }}></Column>
                    <Column field="createdAt" header="Date de creation" filterField="createdAt" body={dateBodyTemplate} style={{ minWidth: '0rem' }}
                        filter filterElement={dateFilterTemplate} ></Column>
                    <Column field="updatedAt" header="Date de modification" filterField="updatedAt" body={dateUpdatedBodyTemplate} style={{ minWidth: '0rem' }}
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
            <Dialog visible={CourseDialog} style={{ width: '650px' }} header="Category Details" modal className="p-fluid" footer={CategoryDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name">Titre</label>
                    <InputText id="name" value={course.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !course.name })} />
                    {submitted && !course.name && <small className="p-error">Name is required.</small>}
                </div>
                {/* <div className="field">
                    <label htmlFor="image">Upload Image</label>
                    <FileUpload id="image" ref={fileUploadRef} name="image"
                        accept="image/*" maxFileSize={1000000}
                        onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                        headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                        chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions}   
                        className={classNames({ 'p-invalid': submitted && !course.image })}
                        customUpload uploadHandler={myUploader} onChange={(e) => onInputFileChange(e, 'image')} required
                    />
                    {submitted && !course.image && <small className="p-error">image is required.</small>}
                </div> */}
                <div className="field">
                    <label htmlFor="description">Description</label>
                    <InputTextarea id="description" value={course.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !course.description })}/>
                    {submitted && !course.description && <small className="p-error">Description is required.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteCourseDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteCategoryDialogFooter} onHide={hideDeleteCategoryDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {course && <span>Êtes-vous sûr de vouloir supprimer <b>{course.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteCoursesDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteCategoriesDialogFooter} onHide={hideDeleteCategoriesDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {course && <span>Êtes-vous sûr de vouloir supprimer les course sélectionnés?</span>}
                </div>
            </Dialog>
        </div>
        </>
    );
}
                
export default Cours;