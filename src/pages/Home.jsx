import React, { useState, useEffect, useRef } from 'react'
import Upload from '../components/common/Upload'
import { useForm } from 'react-hook-form'
import { getFaceClippedImage } from '../service/operations/faceDetection'
import ClippedImage from '../components/core/Home/ClippedImage'
import Image from '../assets/image.jpeg'
import { ImageEditor } from '../components/core/Home/ImageEditor'
import { Alpha, Hue, Saturation, useColor } from 'react-color-palette'
import WhyUseIt from '../components/core/Home/WhyUseIt'
import WorkingOn from '../components/core/Home/WorkingOn'
import Support from '../components/core/Home/Support'



const Home = () => {

    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        formState: {errors}
    } = useForm()

    const [loading, setLoading] = useState(false);
    const [faceClippedImage, setFaceClippedImage] = useState("");

    const onSubmit = async(data) => {
        console.log(data);

        const formData = new FormData();

        formData.append("imageFile", data?.image);

        setLoading(true)
        setTimeout(() => {
            console.log("Setting loading to false");
            setLoading(false);
            
        }, 5000);
        // const result = await getFaceClippedImage(formData);
        // setLoading(false);
        // if (result) {
        //     console.log(result);
        //     setFaceClippedImage(result);
        // }
        // setFaceClippedImage(Image);
    }
    const imageUploadBgRef = useRef(null);



    return (
        <div className='min-h-screen mt-28'>
            <section className='py-20'>
                <div className='w-11/12 max-w-[1360px]  lg:flex lg:flex-wrap lg:justify-between mx-auto relative'>
                    <form 
                        onSubmit={handleSubmit(onSubmit)}
                        className='space-y-5'
                    >
                        <div 
                            className='transition-all duration-500 rounded-[10px] relative z-10'
                        >
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
                            
                            className="px-6 py-3 bg-sea-green-100 font-bold text-white hover:text-black rounded-lg hover:scale-105 transition-all duration-200
                            shadow-richblack-500/30 shadow-md hover:shadow-xl hover:shadow-richblack-600/30"
                        >
                            Get clipped face
                        </button>
                    </form>


                    <div className='transition-all duration-500 rounded-[10px] relative z-10'>
                        <ImageEditor headImage={faceClippedImage.image} faceMask={faceClippedImage.facemask} imageLoading={loading}/>
                    </div>
                </div>
            </section>

            
            <section>
                <WhyUseIt/>
            </section>

            <section>
                <WorkingOn/>
            </section>
            
            <section>
                <Support/>
            </section>

        </div>
    )
}

export default Home