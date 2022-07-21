import React, {useRef} from 'react'
import Helmet from "react-helmet"
import { Toast } from 'primereact/toast';
import { Formik} from 'formik';
import * as Yup from 'yup';
import {PostCategory} from '../service/CategoryService';

export default function NewCategory(){
    const toast = useRef(null);

    const inputRef = useRef(null);

    const resetFileInput = () => {
        inputRef.current.value = null;
    };
    return(
        <>
        <Helmet>
                <script>
                    document.title = "Nouvelle Catégorie"
                </script>
        </Helmet>
        <Toast ref={toast} />
        <div className='flex justify-center border-2 p-3 m-5'>
            <div className="max-w-screen-md mx-auto p-5">
                <div className="text-center mb-16">
                    <p className="mt-4 text-sm leading-7 text-gray-500 font-regular uppercase">
                        Nouvelle Catégorie
                    </p>
                    <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
                        Créer un nouveau <span className="text-indigo-600">Catégorie</span>
                    </h3>
                </div>
                <Formik
                    initialValues={{ name: '', description: '', image: ""}}
                    validationSchema={Yup.object({
                        name: Yup.string()
                        .max(25, 'Must be 15 characters or less')
                        .required('Required'),

                        description: Yup.string()
                        .max(250, 'Must be 250 characters or less')
                        .required('Required'),

                        image: Yup.mixed().required('Required').nullable()
                            // .test({
                            //     message: 'Please provide a supported file type',
                            //     test: (file, context) => {
                            //         const isValid = ['png', 'jpg']
                            //         // .includes(getExtension(file?.name));
                            //         if (!isValid) context?.createError();
                            //         return isValid;
                            //     }
                            // }),
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
                            let res = await PostCategory(requestOptions)
                            if (res.ok){
                                let d = await res.json();
                                toast.current.show({ severity: 'success', summary: 'Created!', detail: "Category has been Created Successfully", life: 3000 });
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
                                            // const fileReader = new FileReader();
                                            // fileReader.onload = () => {
                                            //     if (fileReader.readyState === 2) {
                                            //         formik.setFieldValue('image', fileReader.result);
                                            //     // setAvatarPreview(fileReader.result);
                                            //     }
                                            // };
                                            // fileReader.readAsDataURL(event.currentTarget.files[0]);
                                            formik.setFieldValue("image", event.currentTarget.files[0])
                                        }}
                                    />
                                    {formik.touched.image && formik.errors.image ? (
                                        <div className="text-red-500 text-xs italic">{formik.errors.image}</div>
                                    ) : null}
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
                                <div className="flex justify-between w-full px-3">
                                    <button className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded" 
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                    >
                                        {formik.isSubmitting ? "Creating..." : "Créer une Catégorie"}
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