import React from 'react'
import { motion } from 'framer-motion'
import face1 from '../../../assets/section2/face1u.jpeg'
import face11 from '../../../assets/section2/face11.jpeg'
import face12 from '../../../assets/section2/face12.jpeg'

import face2 from '../../../assets/section2/face2n.jpeg'
import face21 from '../../../assets/section2/face21.jpeg'
import face22 from '../../../assets/section2/face22.jpeg'
import face23 from '../../../assets/section2/face23.jpeg'

import face3 from '../../../assets/section2/face3.jpeg'
import face31 from '../../../assets/section2/face31u.jpeg'
import face32 from '../../../assets/section2/face32u.jpeg'
import face33 from '../../../assets/section2/face33u.jpeg'

import face4 from '../../../assets/section2/face4n.jpeg'
import face41 from '../../../assets/section2/face41.jpeg'

import face5 from '../../../assets/section2/face5.jpeg'
import face51 from '../../../assets/section2/face51.jpeg'
import ImageSlideShow from '../../common/ImageSlideShow'


const slideInVarients1 = {
    offscreen: {
        x: 500,
        opacity: 0
    },
    onscreen: {
        x: -200,
        opacity: 1,
        transition: {
            duration: 1.2
        }
    }
}
const slideInVarients2 = {
    offscreen: {
        x: -350,
        opacity: 0
    },
    onscreen: {
        x: 300,
        
        opacity: 1,
        transition: {
            duration: 1.2
        }
    }
}

const imageSlideIn1 = {
    offscreen: {
        x: -350,
        opacity: 0
    },
    onscreen: {
        x: 150,
        
        opacity: 1,
        transition: {
            duration: 1.2
        }
    }
}

const imageSlideIn2 = {
    offscreen: {
        x: 500,
        opacity: 0
    },
    onscreen: {
        x: -50,
        
        opacity: 1,
        transition: {
            duration: 1.2
        }
    }
}



const contents = [
    {
        id : 0,
        title: "Instant Face Cutouts with a Click",
        descripton: "Transform your profile pictures effortlessly with faceClipper. No need for Photoshop expertise—just upload your image and get a perfect face cutout in a single click.",
        images: [face1, face11, face12],
    },
    {
        id : 1,
        title: "Fully Customizable Features",
        descripton: "Tailor your images to perfection with our customizable features. Adjust the outline width and color, select your desired background color, and add filters to enhance your photos.",
        images: [face2, face21, face22, face23],
    },
    {
        id : 2,
        title: "Dynamic Gradient Backgrounds",
        descripton: "Tired of solid backgrounds? Spice up your images with our gradient options. Choose from multiple colors and styles to create stunning backgrounds that stand out.",
        images: [face3, face31, face32, face33],
    },
    {
        id : 3,
        title: "Cut-In and Border Blur",
        descripton: "Say goodbye to unwanted white edges with our Cut-In and Border Blur features. These tools ensure your cutouts are clean and professional-looking.",
        images: [face4, face41],
    },
    {
        id : 4,
        title: "Real-Time Preview",
        descripton: "See exactly how your profile picture will appear to others with our real-time preview feature. Make adjustments on the fly and achieve the perfect look.",
        images: [face5, face51],
    },
]

const WhyUseIt = () => {
    return (
        <>
            <div className='bg-sea-green-100 py-32 px-32 relative'>
                <h1 className='text-[110px] text-white font-bold '>
                    Why use it ?
                </h1>

                <div className='flex flex-col gap-y-20 mt-8'>
                    {contents.map((content) => (
                        <motion.div 
                            className={`flex justify-between items-center ${(content.id & 1) === 1 ? 'flex-row' : 'flex-row-reverse'}`}
                            initial='offscreen'
                            whileInView={'onscreen'}
                            viewport={{amount: 0.1, once: true}}
                            key={content.id}
                        >
                            <motion.div
                                className='bg-white px-6 py-4 rounded-lg max-w-[30%] h-full'
                                variants={(content.id & 1) === 1 ? slideInVarients2 : slideInVarients1}
                            >
                                <h2 className='font-semibold text-4xl text-sea-green-100'>{content.title}</h2>
                                <div className='text-sea-green-50 text-2xl mt-10'>
                                    {content.descripton}
                                </div>
                            </motion.div>

                            <motion.div
                                variants={(content.id & 1) === 1 ? imageSlideIn2 : imageSlideIn1}
                                className='h-full relative'
                            >
                                <ImageSlideShow images={content.images}/>
                            </motion.div>

                        </motion.div>
                    ))}
                </div>
                

            </div>
        </>
    )
}

export default WhyUseIt