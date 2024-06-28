import React from 'react'
import { FaHeart } from 'react-icons/fa'

const Support = () => {
    return (
        <div className='bg-sea-green-100 py-32 px-32'>
            <h2 className='text-8xl text-white font-bold pb-20'>We Want to Hear from You</h2>

            <div  className='text-2xl text-white leading-8'>
     
                Your feedback is invaluable to us! Join our Reddit community and follow us on Twitter to share your thoughts, suggestions, and experiences with faceClipper. Your insights help us improve and innovate, ensuring we provide the best possible experience. Let's shape the future of faceClipper together!
                <FaHeart className='text-pink-400 text-2xl mx-3 inline-block' />       
                <FaHeart className='text-pink-400 text-2xl inline-block' />    
                         

            </div>

        </div>
    )
}

export default Support