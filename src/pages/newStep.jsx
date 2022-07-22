import React, {useRef, useState, useEffect} from 'react'
import Helmet from "react-helmet"
import { Toast } from 'primereact/toast';
import { Steps } from 'primereact/steps';
import { Editor } from 'primereact/editor';
import { Formik, Field} from 'formik';
import * as Yup from 'yup';
import {PostSteps} from '../service/StepsService';
import {GetCategoryItem, GetCategory} from '../service/CategoryService';
import {GetCourseItem} from './../service/CourseService'
import {GetChapiterItem} from './../service/ChapiterService'
import {StepsBar} from '../data/dummy'
import {Time} from '../helpers/convertTimeToMilliSec'

export default function NewLabs(){
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [chapiters, setChapiters] = useState([]);
    const [labs, setLabs] = useState([]);
    const [idCategory, setIdCategory] = useState("");
    const [idCourse, setIdCourse] = useState("");
    const [idChapiter, setIdChapiter] = useState("");
    const [currentBox, setCurrentBox] = useState(0);
    // const [text, setText] = useState('<div>Hello World app!</div>');

    const toast = useRef(null);
    // const inputRef = useRef(null);

    useEffect(() => {
        // getting categories from db
        GetCategory().then(data => setCategories(data));
        idCategory && GetCategoryItem(idCategory).then(data => setCourses(data));
        idCourse && GetCourseItem(idCourse).then(data => setChapiters(data));
        idChapiter && GetChapiterItem(idChapiter).then(data => setLabs(data));
    }, [idCategory, idCourse, idChapiter]); // eslint-disable-line react-hooks/exhaustive-deps

    return(
        <>
        <Helmet>
            <script>
                document.title = "Nouveau Step"
            </script>
        </Helmet>
        <Toast ref={toast} />
        <div className='flex justify-center border-2 p-3 m-5'>
            <div className="max-w-screen-md mx-auto p-5">
                <div className="text-center mb-16">
                    <p className="mt-4 text-sm leading-7 text-gray-500 font-regular uppercase">
                        Nouveau Step
                    </p>
                    <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
                        Créer un Nouveau <span className="text-indigo-600">Step</span>
                    </h3>
                </div>
                <Formik
                    initialValues={{name: '', demo:null, rang:1, duration: '', lab: "", content:"", chapter:"",  category:"", course:""}}
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
                            method: 'POST',
                            body: data,
                            redirect: 'follow'
                        };
                        
                        try{
                            let res = await PostSteps(requestOptions)
                            if (res.ok){
                                let d = await res.json();
                                toast.current.show({ severity: 'success', summary: 'Created!', detail: "Le Step a été créé avec succès", life: 3000 });
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
                                            placeholder="Example: 30:45" 
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
                                            Next
                                        </button>
                                    </div>
                                    }
                                    {currentBox === 4 &&
                                    <div className="flex justify-end w-full px-3">
                                        <button className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded" 
                                        type="submit"
                                        disabled={formik.isSubmitting}
                                        >
                                            {formik.isSubmitting ? "Creating..." : "Créer un Step"}
                                        </button>
                                    </div>
                                    }  
                                </div>
                            </form>
                            </div>
                        </>
                    )}
                </Formik>

            </div>
        </div>
        </>
    )
}