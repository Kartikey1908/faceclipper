// import React, { useEffect, useState } from 'react'
// import AvatarEditor from 'react-avatar-editor'
// import { ColorPicker, Hue, useColor } from 'react-color-palette';
// import { ReactPhotoEditor } from 'react-photo-editor'
// import 'react-photo-editor/dist/style.css'
// import "react-color-palette/css";
// import clsx from 'clsx/lite'
// import { SketchPicker } from 'react-color';
// import { FaArrowRotateRight } from "react-icons/fa6";
// import { useCanvasImage } from '../hooks/useCanvasImage';

// function ImageEditor() {
//     const [file, setFile] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [color, setColor] = useColor('123123');
//     const [position, setPosition] = useState({x: .5, y: .5});
//     const [rotationAngle, setRotationAngle] = useState(0);
//     const [rotationClicked, setRoationClicked] = useState(null);
//     const { getImage} = useCanvasImage(1);
//     const [processedImage, setProcessedImage] = useState(null);

//     const handleProcessing = async() => {

//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onloadend = async() => {
//             console.log("Calling get Image");
//             getImage(reader.result, null, rotationAngle).then(value => setProcessedImage(value));
//         }

//     }


//     // Show modal if file is selected
//     const showModalHandler = () => {
//         if (file) {
//         setShowModal(true)
//         }
//     }

//     // Hide modal
//     const hideModal = () => {
//         setShowModal(false)
//     }

//     // Save edited image
//     const handleSaveImage = (editedFile) => {
//         setFile(editedFile);
//     };

//     const setFileData = (e) => {
//         if (e?.target?.files && e.target.files.length > 0) {
//             setFile(e.target.files[0])
//         }
//     }

//     const handlePositionChange = (position) => {
        
//         setPosition(position)
//     }

//     const handleMouseDown = (e) => {
//         setRoationClicked({x:e.screenX, y:e.screenY});
//         console.log(rotationClicked);
//     }

//     useEffect(() => {
//         console.log("Rotation angle is ", rotationAngle);
//     }, [rotationAngle]);

//     useEffect(() => {

//         if (rotationClicked) {

//             const handleMouseMove = (e) => {
//                 setRotationAngle(rotationAngle => rotationAngle + e.movementX);
//             }

//             const handleMouseUp = (e) => {
//                 setRoationClicked(null);
//             }

            
//                 window.addEventListener("mousemove", handleMouseMove);
//                 window.addEventListener("mouseup", handleMouseUp);
        
            
//             return () => {
            
//                 window.removeEventListener("mousemove", handleMouseMove);
//                 window.removeEventListener("mouseup", handleMouseUp);
                
//             }
//         }

//     }, [rotationClicked])

//     useEffect(() => {
//         console.log(processedImage);
//     }, [processedImage]);

//     return (
//         <>
//         <input 
//             type="file" 
//             onChange={(e) => setFileData(e)} 
//             multiple={false} 
//             className=''
//         />

//         <button onClick={showModalHandler} className={`text-richblack-900 px-6 py-3 w-fit bg-yellow-50`}>Edit</button>

//         <p >{color.hex}</p>

//         <div 
//             style={{ backgroundColor: color.hex }} //,transform: `rotate(${rotationAngle}deg)`
            
//             className={'px-4 py-4 h-[500px] w-[500px] flex items-center self-center justify-center'}>
            
//             {
//                 showModal && 
//                 <div className='flex-col flex items-center justify-center'>
//                     <AvatarEditor
//                     image={file}
//                     width={400}
//                     height={400}
//                     border={10}
//                     color={[255, 255, 255, .5]} // RGBA
//                     scale={1}
//                     rotate={rotationAngle}
//                     position={position}
//                     onPositionChange={handlePositionChange}
//                 />

//                     <div 
                        
//                         className='w-full bg-blue-400 flex items-center justify-center'>
//                         <div
//                             onMouseDown={handleMouseDown}
                            
//                             className={`bg-richblack-800 h-6 w-6 mt-10 flex items-center justify-center rounded-full}`}>
//                             <FaArrowRotateRight 
                                
//                                 className='text-richblack-5 text-xs'/>
//                         </div>
//                     </div>
                   
//                 </div>
//             }
//         </div>

//         <button 
//             onClick={handleProcessing}
//             className='px-6 py-3 bg-yellow-50 w-fit mx-auto'
//         >
//             Get Image
//         </button>

//         <div className='px-10 py-8 bg-richblack-600'>
            
//             <img 
//                     src={processedImage} 
//                     alt="" 
//                     className='w-[400px]'
//                 />
//         </div>
        

//         <div className='w-[500px] mt-10 self-center'>
//             <ColorPicker hideInput={["hsv"]} color={color} onChange={setColor} />
//             {/* <SketchPicker/> */}
//         </div>
    
//         </>
//     )
// }

// export default ImageEditor
