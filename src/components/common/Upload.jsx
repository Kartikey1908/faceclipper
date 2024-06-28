import React, { useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud } from 'react-icons/fi';
import Cropper from '../core/Crop/Cropper';


const Upload = ({
    name,
    label,
    register,
    setValue,
    errors,
    viewData = null,
    editData = null,
}) => {

    const [previewSource, setPreviewSource] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const inputRef = useRef(null);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            previewFile(file);
            setSelectedFile(file);
        }
    }

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        }
    }

    const { getRootProps, getInputProps, isDragActive} = useDropzone({
        accept :  {"image/*": [".jpeg", ".jpg", ".png"]},
        onDrop,
    })

    useEffect( () => {
        register(name, {required: true});
    }, [register])

    useEffect(() => {
        setValue(name, selectedFile);
    }, [selectedFile, setValue])
    
    

    return (
        <div className='flex flex-col space-y-2 p-2 rounded-[10px] relative z-10 bg-sea-green-100'
            onClick={() => {
                if (inputRef && !previewSource) {
                    inputRef.current.click();
                }
            }}
            
        >
            <div
                className={`${
                    isDragActive ? "bg-richblack-600" : "bg-white"
                } flex relative cursor-pointer items-center justify-center rounded-md h-[480px] w-[500px]`}
            >
                {previewSource ? (
                    <div className='flex flex-col'>
                        
                        <div className='relative'>
                            <img 
                            src={previewSource} 
                            alt=""
                            className='rounded-md h-[438px] object-scale-down'    
                            />
                        </div>
                            
                       
                        <button
                            type='button'
                            onClick={() => {
                                setPreviewSource("");
                                setSelectedFile(null);
                                setValue(name, null);
                            }}
                            className='mt-3 text-richblack-400 underline'
                        >
                            Cancel
                        </button>
                        
                    </div>
                ) : (
                    <div
                        className='flex w-full flex-col items-center p-6'
                        {...getRootProps()}
                    >
                        <input {...getInputProps()} ref={inputRef} />
                        <div className='grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800'>
                            <FiUploadCloud className='text-2xl text-sea-green-100'/>
                        </div>
                        <p className='mt-2 max-w-[200px] text-center text-sm text-richblack-900'>
                            Drag and drop an image, or click to{" "}
                            <span className='font-semibold text-sea-green-100'>Browse</span> a file
                        </p>
                        
                    </div>
                )}
            </div>
            {errors[name] && (
                <span className='ml-2 text-xs tracking-wide text-pink-200'>
                    {label} is required
                </span>
            )}
        </div>
    )
}

export default Upload