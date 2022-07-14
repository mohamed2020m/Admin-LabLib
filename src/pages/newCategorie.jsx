import React from 'react'
import { Formik} from 'formik';
import * as Yup from 'yup';

export default function NewCategorie(){
    return(
        <div className='flex justify-center border-2 p-3 m-5'>
            <div className="max-w-screen-md mx-auto p-5">
                <div className="text-center mb-16">
                    <p className="mt-4 text-sm leading-7 text-gray-500 font-regular uppercase">
                        New Category
                    </p>
                    <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
                        Create a New <span className="text-indigo-600">Categorie</span>
                    </h3>
                </div>
                <Formik
                    initialValues={{ title: '', description: ''}}
                    validationSchema={Yup.object({
                        title: Yup.string()
                        .max(15, 'Must be 15 characters or less')
                        .required('Required'),
                        description: Yup.string()
                        .max(60, 'Must be 60 characters or less')
                        .required('Required'),
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                        }, 400);
                    }}
                >
                    {formik => (
                        <form className="w-full" onSubmit={formik.handleSubmit}>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="title">
                                        Title
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                        id="title" 
                                        type="text" 
                                        placeholder="Desktop Dev" 
                                        {...formik.getFieldProps('title')}
                                    />
                                    {formik.touched.title && formik.errors.title ? (
                                        <div className="text-red-500 text-xs italic">{formik.errors.title}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                                        Description
                                    </label>
                                    <textarea 
                                        rows="5" 
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    >
                                    </textarea>
                                    {formik.touched.description && formik.errors.description ? (
                                        <div className="text-red-500 text-xs italic">{formik.errors.description}</div>
                                    ) : null}
                                </div>
                                <div className="flex justify-between w-full px-3">
                                    <button className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded" type="submit">
                                        Create Category
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>

            </div>
        </div>
    )
}