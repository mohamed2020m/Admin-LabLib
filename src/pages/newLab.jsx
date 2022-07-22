import React, {useRef, useState, useEffect} from 'react'
import Helmet from "react-helmet"
import { Toast } from 'primereact/toast';
import { Formik, Field} from 'formik';
import * as Yup from 'yup';
import {PostLabs} from '../service/LabsService';
import {GetCategoryItem, GetCategory} from '../service/CategoryService';
import {GetCourseItem} from './../service/CourseService'
import {levels} from '../data/dummy'

export default function NewLabs(){
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [chapiters, setChapiters] = useState([]);
    const [idCategory, setIdCategory] = useState("");
    const [idCourse, setIdCourse] = useState("");
    const toast = useRef(null);
    // const inputRef = useRef(null);

    useEffect(() => {
        // getting categories from db
        GetCategory().then(data => setCategories(data));
        // GetCourse().then(data => setCourses(data));
        idCategory && GetCategoryItem(idCategory).then(data => setCourses(data));
        idCourse && GetCourseItem(idCourse).then(data => setChapiters(data));
    }, [idCategory, idCourse]); // eslint-disable-line react-hooks/exhaustive-deps


    return(
        <>
        <Helmet>
                <script>
                    document.title = "Nouveau Lab"
                </script>
        </Helmet>
        <Toast ref={toast} />
        <div className='flex justify-center border-2 p-3 m-5'>
            <div className="max-w-screen-md mx-auto p-5">
                <div className="text-center mb-16">
                    <p className="mt-4 text-sm leading-7 text-gray-500 font-regular uppercase">
                        Nouveau Lab
                    </p>
                    <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
                        Créer un Nouveau <span className="text-indigo-600">Lab</span>
                    </h3>
                </div>
                <Formik
                    initialValues={{name: '', duration: '', level: "", chapter:"",  category:"", course:""}}
                    validationSchema={Yup.object({
                        name: Yup.string()
                        .max(45, 'Must be 15 characters or less'),
                        // .required('Required'),
                        duration: Yup.string(),
                        // .required('Required'),
                        level: Yup.string(),
                        chapter: Yup.string(),
                        course: Yup.string(),
                        category: Yup.string()
                        })
                    }
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        let data = new FormData();
                        for (let value in values) {
                            data.append(value, values[value]);
                        }
                        setSubmitting(true);

                        var requestOptions = {
                            method: 'POST',
                            body: data,
                            redirect: 'follow'
                        };
                        
                        try{
                            let res = await PostLabs(requestOptions)
                            if (res.ok){
                                let d = await res.json();
                                toast.current.show({ severity: 'success', summary: 'Created!', detail: "Le lab a été créé avec succès", life: 3000 });
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
                                        placeholder="Nom de Lab" 
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
                                        duration
                                    </label>
                                    <input 
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                        id="duration" 
                                        type="number"
                                        placeholder="Durée en milliseconde" 
                                        {...formik.getFieldProps('duration')}
                                    />
                                    {formik.touched.description && formik.errors.description ? (
                                        <div className="text-red-500 text-xs italic">{formik.errors.description}</div>
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
                                            <option key={item.id} value={item.name}>{item.name}</option>
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
                                        {categories && categories.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
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
                                        value={formik.values.course} onChange={(e) => {formik.setFieldValue("course", e.target.value)}}
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
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="justify-between w-full px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="chapter">
                                        Sélectionnez un Chapiter
                                    </label>
                                    {idCourse ?
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
                                    :
                                    <Field 
                                        id="course" name="course" as="select" disabled
                                        value={formik.values.course} onChange={(e) => {formik.setFieldValue("course", e.target.value)}}
                                        className="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                    >
                                        <option disabled>Sélectionnez un Cours</option>
                                    </Field>
                                    }
                                    {formik.touched.chapter && formik.errors.chapter ? (
                                        <div className="text-red-500 text-xs italic">{formik.errors.chapter}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="flex justify-between w-full px-3">
                                    <button className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded" 
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                    >
                                        {formik.isSubmitting ? "Creating..." : "Créer un Lab"}
                                    </button>
                                </div>
                            </div>

                            
                        </form>
                    )}
                </Formik>

            </div>
        </div>
        </>
    )
}