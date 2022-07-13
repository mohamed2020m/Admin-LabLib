
// prime css
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
// import 'primeflex/primeflex.css';
// import '../css/App.css';

import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CodelabService } from '../service/CodelabService.js';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import '../css/DataTableCrud.css';

const codelabs = () => {

    let emptyUser = {
        code: null,
        title: '',
        description: '',
        chapiter: '',
        cours: '',
        dateOfCreation:null
    };

    const [codelabs, setCodelabs] = useState(null);
    const [CodelabDialog, setCodelabDialog] = useState(false);
    const [deleteCodelabDialog, setDeleteCodelabDialog] = useState(false);
    const [deleteCodelabsDialog, setDeleteCodelabsDialog] = useState(false);
    const [codelab, setCodelab] = useState(emptyUser);
    const [selectedCodelabs, setSelectedCodelabs] = useState(null);
    // const [submitted, setSubmitted] = useState(false);
    const [filters, setFilters] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    const codelabService = new CodelabService();

    useEffect(() => {
        codelabService.getUsers().then(data => setCodelabs(updateDateUsers(data)));
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
            // 'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            // 'status': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        });
        setGlobalFilter('');
    }

    // const hideDialog = () => {
    //     setSubmitted(false);
    //     setUserDialog(false);
    // }

    const hideDeleteCodelabDialog = () => {
        setDeleteCodelabDialog(false);
    }

    const hideDeleteCodelabsDialog = () => {
        setDeleteCodelabsDialog(false);
    }

    // const saveUser = () => {
    //     setSubmitted(true);

    //     if (codelab.name.trim()) {
    //         let _Users = [...codelabs];
    //         let _User = {...codelab};
    //         if (codelab.id) {
    //             const index = findIndexById(codelab.id);

    //             _Users[index] = _User;
    //             toast.current.show({ severity: 'success', summary: 'Successful', detail: 'codelab Updated', life: 3000 });
    //         }
    //         else {
    //             _User.id = createId();
    //             _User.image = 'codelab-placeholder.svg';
    //             _Users.push(_User);
    //             toast.current.show({ severity: 'success', summary: 'Successful', detail: 'codelab Created', life: 3000 });
    //         }

    //         setCodelabs(_Users);
    //         setUserDialog(false);
    //         setCodelab(emptyUser);
    //     }
    // }

    const confirmDeleteCodelab = (codelab) => {
        setCodelab(codelab);
        setDeleteCodelabDialog(true);
    }

    const deleteCodelab = () => {
        let _Codelab = codelabs.filter(val => val.id !== codelab.id);
        setCodelabs(_Codelab);
        setDeleteCodelabDialog(false);
        setCodelab(emptyUser);
        toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'Codelab supprimé avec succès', life: 3000 });
    }

    // const findIndexById = (id) => {
    //     let index = -1;
    //     for (let i = 0; i < codelabs.length; i++) {
    //         if (codelabs[i].id === id) {
    //             index = i;
    //             break;
    //         }
    //     }

    //     return index;
    // }

    // const createId = () => {
    //     let id = '';
    //     let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     for (let i = 0; i < 5; i++) {
    //         id += chars.charAt(Math.floor(Math.random() * chars.length));
    //     }
    //     return id;
    // }

    const editCodelab = (product) => {
        setCodelab({...product});
        setCodelabDialog(true);
    }

    const confirmDeleteSelected = () => {
        setDeleteCodelabsDialog(true);
    }

    const deleteSelectedCodelabs = () => {
        let _Codelabs = codelabs.filter(val => !selectedCodelabs.includes(val));
        setCodelabs(_Codelabs);
        setDeleteCodelabsDialog(false);
        setSelectedCodelabs(null);
        toast.current.show({ severity: 'success', summary: 'Réussi', detail: 'les Codelabs supprimés avec succès', life: 3000 });
    }

    // const onInputChange = (e, name) => {
    //     const val = (e.target && e.target.value) || '';
    //     let _User = {...codelab};
    //     _User[`${name}`] = val;

    //     setCodelab(_User);
    // }

    // const onInputNumberChange = (e, name) => {
    //     const val = e.value || 0;
    //     let _User = {...codelab};
    //     _User[`${name}`] = val;

    //     setCodelab(_User);
    // }
    
    const titleBodyTemplate = (rowData) => {
        return <span>{rowData.title}</span>
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

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.dateOfCreation);
    }

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editCodelab(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteCodelab(rowData)} />
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
                    <Button type="button" icon="pi pi-trash" label="Supprimer" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedCodelabs || !selectedCodelabs.length}  />
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
        <div className="datatable-crud">
            <Toast ref={toast} />

            <div className="card">
                <DataTable ref={dt} value={codelabs} selection={selectedCodelabs} onSelectionChange={(e) => setSelectedCodelabs(e.value)}
                    dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Montrant {first} à {last} des {totalRecords} codelabs"
                    globalFilter={globalFilter} filters={filters} filterDisplay="menu" header={header} emptyMessage="Aucun codelab trouvé." responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '0rem' }} exportable={false}></Column>
                    <Column field="code" header="Code" style={{ minWidth: '0rem' }}></Column>
                    <Column field="title" header="Title" body={titleBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                    <Column field="description" header="Description"  style={{ minWidth: '20rem' }}></Column>
                    <Column field="chapiter" header="Chapiter" body={chapiterBodyTemplate} style={{ minWidth: '0rem' }}></Column>
                    <Column field="cours" header="Cours" body={coursBodyTemplate}  style={{ minWidth: '0rem' }}></Column>
                    <Column field="dateOfCreation" header="Date de creation" filterField="dateOfCreation" body={dateBodyTemplate} style={{ minWidth: '0rem' }}
                        filter filterElement={dateFilterTemplate} ></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            {/* <Dialog visible={UserDialog} style={{ width: '450px' }} header="codelab Details" modal className="p-fluid" footer={UserDialogFooter} onHide={hideDialog}>
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

                <div className="field">
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
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price">Price</label>
                        <InputNumber id="price" value={codelab.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity">Quantity</label>
                        <InputNumber id="quantity" value={codelab.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} integeronly />
                    </div>
                </div>
            </Dialog> */}

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
    );
}
                
export default codelabs;