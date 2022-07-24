// prime css
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import React, { useState, useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import Helmet from "react-helmet"
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Formik} from 'formik';
import * as Yup from 'yup';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import {useStateContext} from '../contexts/ContextProvider'

import '../css/DataTableCrud.css';

import {GetCategory, PutCategory, DelCategory} from '../service/CategoryService';

const Categories = () => {
    const url = 'https://lablib-api.herokuapp.com/api/v1/image';
    let emptyCategory = {
        id: null,
        name: '',
        description: '',
    };

    const [categories, setCategories] = useState(null);
    const [CategoryDialog, setCategoryDialog] = useState(false);
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
    const [deleteCategoriesDialog, setDeleteCategoriesDialog] = useState(false);
    const [category, setCategory] = useState(emptyCategory);
    const [selectedCategories, setSelectedCategories] = useState(null);
    const [filters, setFilters] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [file, setFile] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);
    const {activeMenu, setActiveMenu} = useStateContext();

    useEffect(() => {
        setIsLoading(true);
        GetCategory().then(data => setCategories(data));
        setIsLoading(false);
        initFilters();
        let fileReader, isCancel = false;
        if (file) {
            fileReader = new FileReader();
            fileReader.onload = (e) => {
                const { result } = e.target;
                if (result && !isCancel) {
                setFileDataURL(result)
                }
            }
            fileReader.readAsDataURL(file);
        }
        return () => {
            isCancel = true;
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort();
            }
        }
    }, [isDeleted, isEdited, file]); // eslint-disable-line react-hooks/exhaustive-deps

    const imageMimeType = /image\/(png|jpg|jpeg)/i;

    const inputRef = useRef(null);

    const resetFileInput = () => {
        inputRef.current.value = null;
    };


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
            'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        });
        setGlobalFilter('');
    }

    const hideDialog = () => {
        setCategoryDialog(false);
        setActiveMenu(true)
    }

    const hideDeleteCategoryDialog = () => {
        setDeleteCategoryDialog(false);
    }

    const hideDeleteCategoriesDialog = () => {
        setDeleteCategoriesDialog(false);
    }

    const editCategory = (category) => {
        setCategory({...category});
        setCategoryDialog(true);
        setFileDataURL(false);
        setActiveMenu(false)
    }

    const confirmDeleteCategory = (category) => {
        setCategory(category);
        setDeleteCategoryDialog(true);
    }

    const deleteCategory = async () => {
        let _categories = categories.filter((val) => {
            val.id !== category.id;
        });
        setCategories(_categories);
        try{
            let res = await DelCategory(category.id)
            if (!res.ok){
                if(Array.isArray(res) && res.length === 0) return "error";
                let r = await res.json()
                throw r[0].message;
            }
            else{
                toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'Category supprimé avec succès', life: 3000 });
            }
        }
        catch (err){
            toast.current.show({ severity: 'error', summary: 'Failed', detail: err, life: 3000 });
        } 
        setIsDeleted(preIsDeleted => (!preIsDeleted));
        setDeleteCategoryDialog(false);
        setCategory(emptyCategory);
    }

    const confirmDeleteSelected = () => {
        setDeleteCategoriesDialog(true);
    }

    const deleteSelectedCategories = async () => {
        let allDelelted = 0;
        let _categories = categories.filter(val => !selectedCategories.includes(val));
        setCategories(_categories);
        for(let item of selectedCategories){
            try{
                let res = await DelCategory(item.id);
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
        setDeleteCategoriesDialog(false);
        setSelectedCategories(null);
        allDelelted === selectedCategories.length && toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'les categories supprimés avec succès', life: 3000 });
    }

    const titleBodyTemplate = (rowData) => {
        return <span>{rowData.name}</span>
    }
    
    const descriptionBodyTemplate = (rowData) => {
        return <span>{rowData.description || "Empty!"}</span>
    }
    
    const imageBodyTemplate = (rowData) => {
        return <img src={`${url}/${rowData.image}`}  onError={(e) => e.target.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAABmJLR0QA/wD/AP+gvaeTAAAE9ElEQVRoge2Ze2xTVRzHP/f2tmtHH2u3sQePhQ3lsYSgPEJC1EEIiCivgRgICzImI0wIExAVNJI4EzATGTrCIwoBIYIhIcFACCgKiCAvN2JiEGGQzbCtZYy+H9c/yupK260bhULS7z899/f7nfP73HNOT36nFQaMnqzD66sUoBAw8uTLAuxXqDXl0n3wBfEm6oKMQInXYUcUYHq8abqpQgkwtT2VyhZyfS4ADotajgs9ABjUy0rZy3UAuDwCy3YMDIzgfQkwCgAItTLi1ceEDiap/VOuz0U+TgAuoA7YdRoPQ3JaAT98e8npIPf0txXXBUB+hLzBEh9bpkegoJk/LGoDM17TbuZvmdVsO9YbAI8veObFWgG0/tkWGoJ9j1rCwFGvPr51jrGe7m0zVHbEm6HbEv4eMSSxbeKhBHy8lICPlxLw8VJ08IKAZuQoEKMLV6Snk/xiAT0KxqLsm9MFGtGfR4iuRpI6DwHDrNmklq+kYVEx9vO/R86tN5D27gdox40PAnBcPE/jJx/jrrvRYR5j8UKMJaXcmj0T19W/Hh5eYUjBuGAh7uvXcFy+FBlcqyV7y9eocvOwnjiO7cRPyE4H6uEj0U+ZTvb2ndQXF0V8ASkjk5S583D+eQXXtehuNJ3CmxYvQdQbuL3mPWSPJ2KcceFiVLl5NH++npY9uwL2e0ePYD12lKyN1aS//yH1pcVh+6cuW4GgUtG0rgJ8vqjgO9zESQMGops8DeuJH7H9eipinCBJ6CZNxllbQ8ve3SF++9kz3D2wH/Xzw1H26Rvi1wwbQY+x42g9dBDnldqowDuGFwRSy1cie72YN1aiMJrQvTYlbKiUkYmo1WK/cA7k8HWe7fRJAFT9n3mAQCT1nZX4bFbM1VVIGZloJ7zycPDa8RNRPzeMll07cN+sQztxEulr1qLs3Sf0PdX+W5fXYomYSLbb/bEaTZBdP2MWqv7PYtm6GW9TE7pphfRcW4Go03cPXlCrMS1egqfxNnd2bPfbJKXfKUV1QEUlUW/AWFKK+2Ydd/ftvZ9HAkHwf3bWP5zR+GYJUmYW5qoN+Gy2mME+KNOiMhSGFJor1yG7XF3uHwKv7NUbw5y5OGouc+/IDzGBDCdVbh66qYXYTv6M7dQv3RojZG1Mby9DUCUhSBIZFesCdmVOPwDSylfgs1oB8DQ3Y97wWbcSpy5fhaBQIOr1ZHy6PmBv+0Knr/4osBru+nrMmzaEHAYh8ApTKgBJg/JJGpQfklQzanSg7bWYubNtc+BcFhQd7NO20sLrj1WkpgGgHjI0bHjyCwWBtuffBixbq5EdwfftkGz1b80LO1hK0XxMZUu5+fpU3Nf/CfLJPhlkGVVuXkT2tlPK29QIwK1Z08LGmcqWklI0nxsTxuC1mCOOBzGqKn13W3BeqSW5YAxSVnaIX1CrMcwpwtfaiqPmj1ikBGJYEpurqxDVGrK++JKkwf9vNykrm8zKKpR9+mLZ8hWyyxmrlNFVldHIfu43GivWkrZqNb2++RZ33Q1ktxtVv1wQRVp276Tluz2xSgd0Ad5x8Tz2M6fxNNRHjGk9eADHpQvoZ75B0uB8BKWK1kMH/fYOKtL2sp87izKnH96WO53GJn50ipcS8PFSAj5eSsDHS089fMel25MrsyjD9/Gm6JYEeZ/ktHnLNcmSLCPPoN1f+U+wzAjyPofVt/w/cSyJn0mj7McAAAAASUVORK5CYII="} alt={rowData.image} className="category-image" />
    }

    const courseBodyTemplate = (rowData) => {
        return <span>{rowData.courses || "Empty!"}</span>
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

    const header = (
        <div className="table-header">
            <div className='flex'>
                <div className="mt-2 mb-3 mx-1 p-0">
                    <Button type="button" icon="pi pi-filter-slash" className=" m-0 p-button-outlined" onClick={clearFilter} />
                </div>
                <div className="mt-2 mb-3 mx-1 p-0">
                    <Button type="button" icon="pi pi-trash" label="Supprimer" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedCategories || !selectedCategories.length}  />
                </div>
            </div>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} onChange={onGlobalFilterChange} placeholder="Chercher par nom..." />
            </span>
        </div>
    );
    // const CategoryDialogFooter = (
    //     <React.Fragment>
    //         <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
    //         <Button label="Sauvegarder" icon="pi pi-check" className="p-button-text" onClick={saveCategory} />
    //     </React.Fragment>
    // );
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

    return (
        <>
        <Helmet>
                <script>
                    document.title = "Categories"
                </script>
            </Helmet>
        <div className="datatable-crud">
            <Toast ref={toast} />
            {!isLoading ?
            <div className="card">
                <DataTable ref={dt} value={categories}  stripedRows removableSort selection={selectedCategories}
                    onSelectionChange={(e) => setSelectedCategories(e.value)}
                    dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Montrant {first} à {last} des {totalRecords} categories"
                    globalFilter={globalFilter} filters={filters} filterDisplay="menu" header={header} 
                    emptyMessage="Aucun Category trouvé." responsiveLayout="scroll" className="p-datatable-striped">
                    <Column selectionMode="multiple" headerStyle={{ width: '0rem' }} exportable={false}></Column>
                    <Column field="id" sortable header="Id" style={{ minWidth: '0rem' }}></Column>
                    <Column field="name" sortable header="Name" body={titleBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                    <Column field="image" header="Image" body={imageBodyTemplate}></Column>
                    <Column field="courses" header="Courses" body={courseBodyTemplate}></Column>
                    <Column field="description" header="Description"  body={descriptionBodyTemplate} style={{ minWidth: '15rem' }}></Column>
                    <Column field="createdAt" header="Date de creation" filterField="createdAt" body={dateBodyTemplate} style={{ minWidth: '13rem' }}
                        filter filterElement={dateFilterTemplate} ></Column>
                    <Column field="updatedAt" header="Date de modification" filterField="updatedAt" body={dateUpdatedBodyTemplate} style={{ minWidth: '13rem' }}
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

            <Dialog visible={CategoryDialog} style={{ width: '650px' }} header="Modifier Catégorie" modal className="p-fluid"  onHide={hideDialog}>
                <Formik
                    initialValues={{ name: category.name, description: category.description, image: `${url}/${category.image}`}}
                    validationSchema={Yup.object({
                        name: Yup.string()
                        .max(25, 'Must be 15 characters or less'),
                        // .required('Required'),

                        description: Yup.string()
                        .max(250, 'Must be 250 characters or less'),
                        // .required('Required'),

                        image: Yup.mixed()
                        })
                    }
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        let data = new FormData();
                        for (let value in values) {
                            data.append(value, values[value]);
                        }
                        setSubmitting(true);

                        let requestOptions = {
                            method: 'PUT',
                            body: data,
                            redirect: 'follow'
                        };
                        
                        try{
                            let res = await PutCategory(category.id, requestOptions)
                            if (res.ok){
                                let d = await res.json();
                                toast.current.show({ severity: 'success', summary: 'modifié avec succès!', detail: "Mis à jour avec succés", life: 3000 });
                                setIsEdited(preIsEdited => (!preIsEdited));
                                setCategoryDialog(false);
                                resetForm();
                                resetFileInput();
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
                        <form className="w-full" onSubmit={formik.handleSubmit} encType="multipart/form-data">
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                                        Nom
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                        id="name" 
                                        type="text"
                                        placeholder="Nom de Catégorie" 
                                        {...formik.getFieldProps('name')}
                                    />
                                    {formik.touched.name && formik.errors.name ? (
                                        <div className="text-red-500 text-xs italic">{formik.errors.name}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="image">
                                        Upload une image
                                    </label>
                                    <input
                                        ref={inputRef}
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                        id="image" 
                                        type="file"
                                        name="image"
                                        accept='image/*'
                                        onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            if (!file.type.match(imageMimeType)) {
                                                toast.current.show({ severity: 'danger', summary: 'Faild', detail: 'Image mime type is not valid', life: 3000 });
                                                return;
                                            }
                                            setFile(file);
                                            formik.setFieldValue("image", event.currentTarget.files[0])
                                        }}
                                    />
                                    {formik.touched.image && formik.errors.image ? (
                                        <div className="text-red-500 text-xs italic">{formik.errors.image}</div>
                                    ) : null}
                                    {fileDataURL ?
                                        <div className="flex justify-center py-3 bg-slate-200 rounded-sm	">
                                            <div>
                                                <h3 className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>Preview l'image</h3>
                                                <img src={fileDataURL} alt="preview" />    
                                            </div>
                                        </div> : 
                                        <div className="flex justify-center py-3 bg-slate-200 rounded-sm	">
                                            <div>
                                                <h3 className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>Preview l'image</h3>
                                                <img src={formik.values.image} alt="preview" />    
                                            </div>
                                        </div> 
                                    }
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">
                                        Description
                                    </label>
                                    <textarea 
                                        id="description"
                                        placeholder="Description"
                                        rows="5" 
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        {...formik.getFieldProps('description')}
                                    >
                                    </textarea>
                                    {formik.touched.description && formik.errors.description ? (
                                        <div className="text-red-500 text-xs italic">{formik.errors.description}</div>
                                    ) : null}
                                </div>
                                <div className="flex justify-end w-full px-3">
                                    <button className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded" 
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                    >
                                        {formik.isSubmitting ? "Updating..." : "Update image"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>
            </Dialog>

            <Dialog visible={deleteCategoryDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteCategoryDialogFooter} onHide={hideDeleteCategoryDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {category && <span>Êtes-vous sûr de vouloir supprimer <b>{category.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteCategoriesDialog} style={{ width: '450px' }} header="Confirmer" modal footer={deleteCategoriesDialogFooter} onHide={hideDeleteCategoriesDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {category && <span>Êtes-vous sûr de vouloir supprimer les category sélectionnés?</span>}
                </div>
            </Dialog>
        </div>
        </>
    );
}
                
export default Categories;