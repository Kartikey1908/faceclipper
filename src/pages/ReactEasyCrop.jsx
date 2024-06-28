// import React, { useEffect, useState } from 'react'
// import Cropper from 'react-easy-crop'
// import { useCanvasImage } from '../hooks/useCanvasImage';
// import { FaArrowRotateRight } from "react-icons/fa6";


// const ReactEasyCrop = () => {
//     const [imageFile, setImageFile] = useState(null);
//     const [previewImage, setPreviewImage] = useState(null);
//     const [crop, setCrop] = useState({x: 0, y: 0});
//     const [zoom, setZoom] = useState(1);
//     const [rotation, setRotation] = useState(0);
//     const [processedImage, setProcessedImage] = useState(null);
//     const { getImage } = useCanvasImage();
//     const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//     const [rotationClicked, setRotationClicked] = useState(false);
 
//     const handleFileChange = (e) => {
//         if (e?.target?.files && e?.target?.files.length > 0) {
//             setImageFile(e?.target?.files[0]);
//             previewFile(e?.target?.files[0]);
//         }
//     }

//     const previewFile = (file) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onloadend = () => {
//             setPreviewImage(reader.result);
//         }
//     }

//     const onCropComplete = (croppedArea, croppedAreaPixels) => {
//         console.log(croppedArea, croppedAreaPixels)
//         setCroppedAreaPixels(croppedAreaPixels)

//     }

//     // useEffect(() => {
//     //     console.log(crop);
//     //     console.log(zoom);
//     //     console.log(rotation);
//     // }, [crop, zoom, rotation]);

//     const handleClick = async() => {
//         await getImage(previewImage, croppedAreaPixels, rotation).then((image) => setProcessedImage(image))
//     }

//     const handleMouseDown = () => {
//         setRotationClicked(true);
//     }

//     useEffect(() => {

//         if (rotationClicked) {
//             const handleMouseMove = (e) => {
//                 setRotation(rotation => rotation + e.movementX);
//             }

//             const handleMouseUp = (e) => {
//                 setRotationClicked(false);
//             }

//             window.addEventListener("mousemove", handleMouseMove);
//             window.addEventListener("mouseup", handleMouseUp);

//             return () => {
//                 window.removeEventListener("mousemove", handleMouseMove);
//                 window.removeEventListener("mouseup", handleMouseUp);
//             }
//         }

//     }, [rotationClicked])


//     return (
//         <div className='flex flex-col gap-y-4 px-5 py-8'>

//             <input 
//                 type="file" 
//                 onChange={handleFileChange}
//                 multiple={false}
//             />

            
//             <div className='flex w-full justify-between'>
//                <div className='flex flex-col gap-y-3'>
//                     <div className='bg-richblack-800 py-2 flex z-[100] w-[480px] h-[480px] relative'>
//                         { previewImage && 
//                             <Cropper
//                                 image={previewImage}
//                                 crop={crop}
//                                 zoom={zoom}
//                                 rotation={rotation}
//                                 aspect={1}
//                                 onCropChange={setCrop}
//                                 onZoomChange={setZoom}
//                                 onCropComplete={onCropComplete}
//                                 // onRotationChange={setRotation}
//                                 classes={'z-[100]'}
//                                 restrictPosition={true}
                            
//                             />

//                         }
//                     </div>

//                     <div 
                        
//                         className='w-full bg-blue-400 flex items-center justify-center'>
//                         <div
//                             onMouseDown={handleMouseDown}
                            
//                             className={`bg-richblack-800 h-6 w-6 mt-10 flex items-center justify-center rounded-full}`}>
//                             <FaArrowRotateRight 
                                
//                                 className='text-richblack-5 text-xs'/>
//                         </div>
//                     </div>

//                     <button 
//                         onClick={handleClick}
//                         className='bg-yellow-50 w-fit px-6 py-3 text-richblack-900'>
//                         Get resultant image
//                     </button>
//                </div>
//                <div>
//                     {processedImage && 
//                         <div className='w-[480px] h-[480px]'>
//                             <img src={processedImage} alt=""
//                                 className='aspect-square object-contain'
//                             />
//                         </div>
//                     }
//                </div>
//             </div>
          


            
//         </div>
//   )
// }

// export default ReactEasyCrop