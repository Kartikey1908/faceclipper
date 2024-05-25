import React from 'react'
import Upload from '../components/common/Upload'
import { useForm } from 'react-hook-form'

const Home = () => {

    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        formState: {errors}
    } = useForm()

    const handleFormSubmit = () => {

    }

    return (
        <div>
            <form onSubmit={handleSubmit(handleFormSubmit)}>

            </form>
        </div>
    )
}

export default Home