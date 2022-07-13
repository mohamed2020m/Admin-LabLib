import React, { useEffect, useState , useRef} from 'react';
import { FileUpload } from 'primereact/fileupload';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
// import { Calendar } from 'primereact/calendar';
// import { cours } from 'primereact/cours';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { ProgressBar } from 'primereact/progressbar';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';

import './../css/FormDemo.css';
import htmlLogo96 from '../data/html-5-96.png'


const Codelab = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const [listCours, setListCours] = useState(null);
    const [coursSelected, setCoursSelected] = useState(false);
    const [listChapitres, setListChapitres] = useState(null);
    const [listChapitre, setListChapitre] = useState(null);
    const [description, setDescription] = useState('');
    const [totalSize, setTotalSize] = useState(0);
    const toast = useRef(null);
    const fileUploadRef = useRef(null);

    const dataList = [
        {
            name: 'Application Mobile', 
            chapitres:[
                {name: 'Kotlin'},
                {name: 'Java'},
                {name: 'Flutter'},
                {name: 'C#'},
                {name: 'Android Studio'}
            ]
        },
        {
            name: 'Application Web', 
            chapitres:[
                {name: 'HTML'},
                {name: 'CSS'},
                {name: 'PHP'},
                {name: 'JQuery'},
                {name: 'Boostrap'},
                {name: 'Javascript'}
            ]
        },
        {
            name: 'Application Desktop',
            chapitres:[
                {name: 'C#'},
                {name: '.NET'},
                {name: 'VBScript'},
            ]
        },
        {
            name: 'ERP', 
            chapitres:[
                {name: 'introduction a ERP'},
                {name: 'Cloud ERP'},
            ]
        }
    ];

    const onCoursChange = (e) => {
        setListCours(e.value);
        setCoursSelected(true);
        setListChapitres(e.value.chapitres)
    }

    const onChapiterChange = (e) => {
        setListChapitre(e.value);
    }

    const formik = useFormik({
        initialValues: {
            title: '',
            chapitre: '',
            cours: ''
        },
        validate: (data) => {
            let errors = {};

            if (!data.title) {
                errors.title = 'Le titre est requis.';
            }

            if (!data.chapitre) {
                errors.chapitre = 'chapitre est requis.';
            }
            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.chapitre)) {
                errors.chapitre = 'Invalid chapitre address. E.g. example@chapitre.com';
            }

            if (!data.cours) {
                errors.cours = 'cours est requis.';
            }

            if (!data.description) {
                errors.description = 'description est requis.';
            }
            return errors;
        },
        onSubmit: (data) => {
            setFormData(data);
            setShowMessage(true);

            formik.resetForm();
        }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;

    // upload a file
    const onTemplateSelect = (e) => {
        console.log(e.files)
        let _totalSize = totalSize;
        _totalSize = e.files[0].size;
        setTotalSize(_totalSize);
    }

    const onTemplateUpload = (e) => {
        let _totalSize = 0;
        e.files.forEach(file => {
            _totalSize += (file.size || 0);
        });

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
        const { className, chooseButton, cancelButton } = options;
        const value = totalSize/10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{backgroundColor: 'transparent', display: 'flex', alignItems: 'center'}}>
                {chooseButton}
                {cancelButton}
                <ProgressBar value={value} displayValueTemplate={() => `${formatedValue} / 1 MB`} style={{width: '300px', height: '20px', marginLeft: 'auto'}}></ProgressBar>
            </div>
        );
    }

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{width: '60%', border:'3px solid red;'}}>
                    <img alt={file.name} role="presentation" src={htmlLogo96} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                {/* <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} /> */}
            </div>
        )
    }

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <img src={htmlLogo96} className="mt-3 p-5" style={{'fontSize': '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)'}} />
                <span style={{'fontSize': '1.2em', color: 'var(--text-color-secondary)'}} className="my-5">Drag and Drop Html File Here</span>
            </div>
        )
    }

    const chooseOptions = {label: 'Choisir', icon: 'pi pi-fw pi-plus'};
    const uploadOptions = {label: 'Uplaod', icon: 'pi pi-upload', className: 'p-button-success'};
    const cancelOptions = {label: 'Annuler', icon: 'pi pi-times', className: 'p-button-danger'};

    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex align-items-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Codelab téléchargé avec succès</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        le Codelab titre <b>{formData.titre}</b> ; vérifie ici <b>{formData.chapitre}</b> dans le cours {formData.cours}.
                    </p>
                </div>
            </Dialog>

            <div className="flex justify-content-center">
                <div className="card">
                    <h5 className="text-center">Ajouter un CodeLab</h5>
                    <form onSubmit={formik.handleSubmit} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <InputText id="title" name="title" value={formik.values.title} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('title') })} />
                                <label htmlFor="title" className={classNames({ 'p-error': isFormFieldValid('title') })}>Titre*</label>
                            </span>
                            {getFormErrorMessage('title')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <InputTextarea id="description" name="description" value={formik.values.description} onChange={formik.handleChange} rows={3} cols={30} autoResize placeholder='Description' className={classNames({ 'p-invalid': isFormFieldValid('description') })}/>
                            </span>
                            {getFormErrorMessage('description')}
                        </div>
                        <div className='flex'>
                            <div className="field flex-grow-1 mr-1">
                                <span className="p-float-label p-input-icon-right">
                                    <Dropdown id="cours" name="cours" value={listCours} options={dataList} onChange={onCoursChange} optionLabel="name" placeholder="Select a Course" className={classNames({ 'p-invalid': isFormFieldValid('cours') })} />
                                </span>
                                {getFormErrorMessage('cours')}
                            </div>
                            <div className="field flex-grow-1 ml-1">
                                <span className="p-float-label p-input-icon-right">
                                    <Dropdown disabled={!coursSelected} id="chapitre" name="chapitre" value={listChapitre} options={listChapitres} onChange={onChapiterChange} optionLabel="name" placeholder="Select a chapitre" className={coursSelected && classNames({ 'p-invalid': isFormFieldValid('chapitre') })} />
                                </span>
                                {coursSelected && getFormErrorMessage('chapitre')}
                            </div>
                        </div>
                        <div>
                            <h5>Upload the file</h5>
                            
                            <FileUpload ref={fileUploadRef} name="demo[]" url="https://primefaces.org/primereact/showcase/upload.php" 
                                    accept=".html" maxFileSize={1000000}
                                    onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                                    headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                                    chooseOptions={chooseOptions} cancelOptions={cancelOptions}     
                            />
                        </div>
                        <Button type="submit" label="Submit" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Codelab;