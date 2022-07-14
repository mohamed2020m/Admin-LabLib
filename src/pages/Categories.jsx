// prime css
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';

import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { CategoryService } from '../service/CategoryService';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import '../css/DataTableCrud.css';

const Categories = () => {

    let emptyCategory = {
        id: null,
        name: '',
        description: '',
        dateOfCreation:null
    };

    const [categories, setCategories] = useState(null);
    const [CategoryDialog, setCategoryDialog] = useState(false);
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
    const [deleteCategoriesDialog, setDeleteCategoriesDialog] = useState(false);
    const [category, setCategory] = useState(emptyCategory);
    const [selectedCategories, setSelectedCategories] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [filters, setFilters] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    const categoryService = new CategoryService();

    useEffect(() => {
        categoryService.getCategory().then(data => setCategories(updateDateCategory(data)));
        initFilters();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const updateDateCategory = (rowData) => {
        return [...rowData || []].map(d => {
            d.dateOfCreation = new Date(d.dateOfCreation);
            return d;
        });
    }

    const formatDate = (value) => {
        if(value){
            return value.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
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

    const openNew = () => {
        setCategory(emptyCategory);
        setSubmitted(false);
        setCategoryDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setCategoryDialog(false);
    }

    const hideDeleteCategoryDialog = () => {
        setDeleteCategoryDialog(false);
    }

    const hideDeleteCategoriesDialog = () => {
        setDeleteCategoriesDialog(false);
    }

    const saveCategory = () => {
        setSubmitted(true);

        if (category.name.trim()) {
            let _Categories = [...categories];
            let _Category = {...category};
            if (category.id) {
                const index = findIndexById(category.id);

                _Categories[index] = _Category;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Category Updated', life: 3000 });
            }
            else {
                _Category.id = createId();
                _Categories.push(_Category);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Category Created', life: 3000 });
            }

            setCategories(_Categories);
            setCategoryDialog(false);
            setCategory(emptyCategory);
        }
    }

    const editCategory = (category) => {
        setCategory({...category});
        setCategoryDialog(true);
    }

    const confirmDeleteCategory = (category) => {
        setCategory(category);
        setDeleteCategoryDialog(true);
    }

    const deleteCategory = () => {
        let _categories = categories.filter(val => val.id !== category.id);
        setCategories(_categories);
        setDeleteCategoryDialog(false);
        setCategory(emptyCategory);
        toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'Category supprimé avec succès', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    const confirmDeleteSelected = () => {
        setDeleteCategoriesDialog(true);
    }

    const deleteSelectedCategories = () => {
        let _categories = categories.filter(val => !selectedCategories.includes(val));
        setCategories(_categories);
        setDeleteCategoriesDialog(false);
        setSelectedCategories(null);
        toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'les categories supprimés avec succès', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _Category = {...category};
        _Category[`${name}`] = val;

        setCategory(_Category);
    }

    // const onInputNumberChange = (e, name) => {
    //     const val = e.value || 0;
    //     let _User = {...codelab};
    //     _User[`${name}`] = val;

    //     setCodelab(_User);
    // }
    
    const titleBodyTemplate = (rowData) => {
        return <span>{rowData.name}</span>
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
        return formatDate(rowData.dateOfCreation);
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

    let num =  filters !== null && Object.keys(filters).length > 0 ? Object.keys(filters).length : ""

    const header = (
        <div className="table-header">
            <div className='flex'>
                <div className="mt-2 mb-3 mx-1 p-0">
                    <Button type="button" icon="pi pi-plus" label="New" className="p-button-success " onClick={openNew}/>
                </div>
                <div className="mt-2 mb-3 mx-1 p-0">
                    <Button type="button" icon="pi pi-trash" label="Supprimer" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedCategories || !selectedCategories.length}  />
                </div>
                <div className="mt-2 mb-3 mx-1 p-0">
                    <Button type="button" icon="pi pi-filter-slash" label="Effacer les filtres" className=" m-0 p-button-outlined" onClick={clearFilter} />
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

    return (
        <div className="datatable-crud">
            <Toast ref={toast} />

            <div className="card">
                <DataTable ref={dt} value={categories} selection={selectedCategories}
                    onSelectionChange={(e) => setSelectedCategories(e.value)}
                    dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Montrant {first} à {last} des {totalRecords} category"
                    globalFilter={globalFilter} filters={filters} filterDisplay="menu" header={header} 
                    emptyMessage="Aucun Category trouvé." responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '0rem' }} exportable={false}></Column>
                    <Column field="id" header="Id" style={{ minWidth: '0rem' }}></Column>
                    <Column field="name" header="Title" body={titleBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                    <Column field="description" header="Description"  style={{ minWidth: '20rem' }}></Column>
                    <Column field="dateOfCreation" header="Date de creation" filterField="dateOfCreation" body={dateBodyTemplate} style={{ minWidth: '0rem' }}
                        filter filterElement={dateFilterTemplate} ></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={CategoryDialog} style={{ width: '450px' }} header="Category Details" modal className="p-fluid" footer={CategoryDialogFooter} onHide={hideDialog}>
                {/* {codelab.image && <img src={`images/codelab/${codelab.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={category.image} className="category-image block m-auto pb-3" />} */}
                <div className="field">
                    <label htmlFor="name">Title</label>
                    <InputText id="name" value={category.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !category.name })} />
                    {submitted && !category.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description">Description</label>
                    <InputTextarea id="description" value={category.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                </div>

                {/* <div className="field">
                    <label className="mb-3">Category</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={codelab.category === 'Accessories'} />
                            <label htmlFor="category1">Accessories</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={codelab.category === 'Clothing'} />
                            <label htmlFor="category2">Clothing</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={codelab.category === 'Electronics'} />
                            <label htmlFor="category3">Electronics</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={codelab.category === 'Fitness'} />
                            <label htmlFor="category4">Fitness</label>
                        </div>
                    </div>
                </div> */}

                {/* <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price">Price</label>
                        <InputNumber id="price" value={codelab.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity">Quantity</label>
                        <InputNumber id="quantity" value={codelab.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} integeronly />
                    </div>
                </div> */}
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
    );
}
                
export default Categories;