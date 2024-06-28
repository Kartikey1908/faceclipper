import React, { useState } from 'react'
import Upload from '../components/common/Upload'
import { useForm } from 'react-hook-form'
import { getFaceClippedImage } from '../service/operations/faceDetection'
import ClippedImage from '../components/core/Home/ClippedImage'

const Cropping = () => {

    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        formState: {errors}
    } = useForm()

    const [loading, setLoading] = useState(false);

    const onSubmit = async(data) => {
        console.log(data);

        
    }

    return (
        <div className='pt-20 min-h-screen'>
            <div className='w-11/12 max-w-[1000px] flex justify-between items-center mx-auto'>
                <form 
                    onSubmit={handleSubmit(onSubmit)}
                    className='space-y-5'
                >
                    <div className='max-w-[400px] relative z-[10]'>
                        <Upload 
                            name={"image"} 
                            label={"Add you image here"}
                            register={register}
                            errors={errors}
                            setValue={setValue}
                            getValues={getValues}   
                        />
                        
                    </div>

                    <button
                        className='text-richblack-900 bg-yellow-50 rounded-md px-6 py-3 hover:scale-95'
                    >
                        Get clipped face
                    </button>
                </form>

            </div>

            <div className='h-[1200px] w-screen overflow-x-hidden'>Hemlo</div>
            

        </div>
    )
}


export default Cropping