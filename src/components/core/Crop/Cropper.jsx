import React, { useEffect, useRef, useState } from 'react'

const Cropper = () => {

    const [top, setTop] = useState(0);
    const [left, setLeft] = useState(0);
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0);

    const cropperRef = useRef();
    // const [height, setHeight] = 

    useEffect(() => {
        console.log(cropperRef)
    }, [])

    useEffect(() => {
        console.log("Height ", height, "width ", width);
    }, [width, height]);

    useEffect(() => {
        if (!cropperRef.current) {
            return ;
        }

        const resizeObserver = new ResizeObserver(() => {
            const {current} = cropperRef;
            const boundingRect = current.getBoundingClientRect();
            const {width, height} = boundingRect;
            setHeight(height);
            setWidth(width);
            console.log(boundingRect);
        })
        resizeObserver.observe(cropperRef.current);

        return () => resizeObserver.disconnect();

    }, [])

    const [isCropperMoving, setIsCropperMoving] = useState(false);

    const handleMouseDown = () => {
        setIsCropperMoving(true);
    }

    useEffect(() => {

        if (isCropperMoving) {

            const handleMouseMove = (e) => {
                
                if (left + width <= cropperRef.current.offsetParent.offsetWidth) {
                    console.log(left + width, cropperRef.current.offsetParent.offsetWidth)
                    setLeft(left => left + e.movementX);
                }


                setTop(top => top + e.movementY);
            }

            const handleMouseUp = (e) => {
                setIsCropperMoving(false);
            }

            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);


            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
            }

        }


    }, [isCropperMoving])



    return (
        <>

            <div 
                ref={cropperRef}
                onMouseDown={handleMouseDown}
                style={{top: `${top}px`, left: `${left}px`}}
                className='absolute overflow-auto resize z-[100] top-0 left-0 h-[300px] w-full border-2 border-[#00FF00]'></div>

            
        </>
    )
}

export default Cropper