import React from 'react'
import facemask1 from '../../assets/face_mask1_cropped.png'
import facemask2 from '../../assets/facemask2 _cropped.png'
import { TypeAnimation } from 'react-type-animation'


const Navbar = () => {
    return (
        <>
            <div 
                style={{
                    backgroundImage: "linear-gradient(-45deg, #69b5ec, #008080)"
                }}
                className='h-16 w-screen  flex items-center justify-center    min-h-[500px] relative mb-10'
            >
                <div className='flex flex-col gap-y-0'>
                    <h1 className='z-[10] text-[8rem] text-white font-bold relative text-center'>faceClipper</h1>
                </div>
                <div className='absolute font-bold text-white text-5xl bottom-[120px] left-3'>
                    let's make your
                </div>
                <div className='absolute font-bold text-white text-[112px] -bottom-6 left-3'>
                    profile pic
                </div>
                <div className='absolute font-bold text-[112px] min-h-[198px] min-w-[2px] -bottom-44 left-3 uppercase h-fit place-items-center flex'
                >
                    <TypeAnimation
                        sequence={[
                            ' Amazing',
                            1600, 
                            ' Fabulous',
                            1600,
                            ' Eye-Catching',
                            1600,
                        ]}
                        repeat={Infinity}
                        cursor={false}   
                        wrapper='div'
                        deletionSpeed={30}
                        style={
                            {
                                display: "inline-block",
                                whiteSpace: "pre-line",
                                backgroundImage: "linear-gradient(-45deg, #69b5ec, #008080)",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text"

                            }
                        }
                        className='block text-[132px] after:bg-clip-text'
                    />
                    <span className='flex  items-center animate-cursor -mt-4'
                        style={{
                            backgroundImage: "linear-gradient(-45deg, #69b5ec, #008080)",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text"
                        }}
                    >|</span>
                </div>
            </div>
        </>
    )
}

export default Navbar