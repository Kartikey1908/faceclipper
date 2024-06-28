import React from 'react'
import { motion } from 'framer-motion'
import { GoDotFill } from 'react-icons/go'

const variants = {
    offscreen: {
        y: 70,
        opacity: 0,
    },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 1
        }
    }
}

const contents = [
    {
        id : 0,
        workingOn: "We're optimizing our algorithms to improve face clip generation speed, ensuring you get your perfect clips even faster."
    },
    {
        id : 1,
        workingOn: "Soon, you'll have the option to manually adjust face crop landmarks. If the automatic clip isn't perfect, you'll be able to fine-tune it yourself for precise results."
    },
    {
        id : 2,
        workingOn: "We're implementing a new feature that suggests the best background and border colors to complement your face clips. "
    },
    {
        id : 3,
        workingOn: "We're developing pre-defined templates and a workspace for creators to add their own designs. This will allow creators to showcase and monetize their custom templates."
    },
]

const WorkingOn = () => {
    return (
        <div className='py-32 px-32'>
            <h2 className='text-sea-green-100 text-8xl font-bold pb-20'>What We're Working On </h2>

            <div className='flex gap-y-20'>
                    {contents.map((content) => (
                        <motion.div 
                            className={`flex gap-x-2 px-4 max-w-[350px] ${content.id !== contents.length - 1 ? 'border-r-2 border-sea-green-50' : ''} `}
                            initial='offscreen'
                            whileInView={'onscreen'}
                            viewport={{amount: 0.3, once: true}}
                            key={content.id}
                        >
                            <motion.p
                                className="text-2xl text-[#045D5D]"
                                variants={variants}
                            >
                                {content.workingOn}
                            </motion.p>
                        </motion.div>
                    ))}
                </div>

        </div>
    )
}

export default WorkingOn