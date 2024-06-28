import React, { useEffect, useRef, useState } from 'react'
import RotateImage from '../assets/rotateIcon.png'
import { ColorPicker, useColor } from 'react-color-palette'
import "react-color-palette/css";

const ROTATION_BUTTON_RADIUS = 20
const SCALING_BUTTON_RADIUS = 10


const OnlyCanvas = () => {
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const canvasRef = useRef(null);
    const divRef = useRef(null);
    const outerCanvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const [ctx, setCtx] = useState(null);
    const [outerCanvas, setOuterCanvas] = useState(null)
    const [outerCtx, setOuterCtx] = useState(null);
    const [clicked, setClicked] = useState("");
    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState(1);
    const [buttonPosition, setButtonPosition] = useState({x : 0, y: 0});
    const [imagePosition, setImagePosition] = useState({x : 0, y: 0});
    const [scalingButtonPosition, setScalingButtonPosition] = useState({x : 0, y : 0});
    const oldPoints = useRef([]);
    const [color, setColor] = useColor('123123');


    const handleFileChange = (e) => {
        if (e?.target?.files && e?.target?.files.length > 0) {
            setImageFile(e?.target?.files[0]);
            previewFile(e?.target?.files[0]);
        }
    }

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        }
    }

    const createImage = (url) => 
        new Promise( (resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', error => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });
    
    
    const getRadianAngle = degreeValue => {
        return (degreeValue * Math.PI) / 180;
    }
    
    const exportFromCanvas = async (canvas, qualityReductionFactor, exportAsBlob) => {
        return exportAsBlob 
            ? new Promise(resolve => {
                canvas.toBlob(
                    file => {
                        resolve(URL.createObjectURL(file))
                    },
                    'image/jpeg',
                    qualityReductionFactor
                );
            }) 
            : canvas.toDataURL('image/jpeg');
    }

    const drawImageOnCanvas = async(rotation = 0, scale = 1, color="#FF0000") => {

        // ctx.clearRect(0, 0, canvas.height, canvas.width);
        const image = await createImage(previewImage);
        const safeArea = Math.sqrt(Math.pow(image.width, 2) + Math.pow(image.height, 2));

        canvas.height = safeArea;
        canvas.width = safeArea;

        outerCanvas.height = safeArea;
        outerCanvas.width = safeArea

        setImagePosition({x: safeArea / 2, y:safeArea / 2, width: image.width, height : image.height});

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, safeArea, safeArea);
        
        ctx.translate(
            (safeArea / 2),
            (safeArea / 2)
        );
        ctx.rotate(getRadianAngle(rotation));
        ctx.translate(
            -(image.width / 2) * scale,
            -(image.height / 2) * scale
        ); 
         
        // ctx.drawImage(image, 
        //     0, 0,
        // );         

        ctx.drawImage(image, 
            0, 0, image.width, image.height,
            0, 0, image.width * scale, image.height * scale
        );

        outerCtx.translate(
            (safeArea / 2),
            (safeArea / 2)
        )
        outerCtx.rotate(getRadianAngle(rotation));
        outerCtx.translate(
            0, 
            image.height / 2 * scale + 30,
        )


        // ctx.translate(
        //     image.width / 2, 
        //     image.height + 30,
        // )
        const x = safeArea / 2 + ((image.height / 2) * scale + 30) * Math.sin(getRadianAngle(-rotation));
        const y = safeArea / 2 + ((image.height / 2) * scale + 30) * Math.cos(getRadianAngle(rotation));
        // console.log("Position of button" , x, y);
        setButtonPosition({x: x, y, y});
        drawRotationButton();

       
        
        

    }

    const drawScalingButton = () => {
        outerCtx.translate(
            (imagePosition.width / 2) * scale ,
             - 30,
        )
        const normalAngle = Math.atan2(imagePosition.width / 2 * scale, imagePosition.height / 2 * scale);
        const newAngle = getRadianAngle(-rotation) + normalAngle;
        const safeArea = Math.sqrt(Math.pow(imagePosition.width, 2) + Math.pow(imagePosition.height, 2));

        const x = safeArea / 2 + (safeArea / 2 * scale) * Math.sin(newAngle);
        const y = safeArea / 2 + (safeArea / 2 * scale) * Math.cos(newAngle);

        console.log("Scaling Button coordinates ", x, y);
        setScalingButtonPosition({x : x, y : y});

        
        outerCtx.beginPath();
        outerCtx.strokeStyle = "#2066F3"
        outerCtx.arc(0, 0, SCALING_BUTTON_RADIUS, 0, 2 * Math.PI);
        outerCtx.fill();
    }

    const drawRotationButton = () => {
        
        // ctx.imageSmoothingEnabled = true;
        // const icon = new Image();
        // icon.src = RotateImage;
        
        // icon.onload = function() {
        //     ctx.fillStyle = "#2066F3"
        //     ctx.arc(0, 0, ROTATION_BUTTON_RADIUS, 0, 2 * Math.PI);
        //     ctx.fill()  
        //     ctx.drawImage(icon, -10, -10, 20, 20);
        // };

        outerCtx.imageSmoothingEnabled = true;
        const icon = new Image();
        icon.src = RotateImage;
        
        
        icon.onload = function () {
            outerCtx.fillStyle = "#2066F3"
            outerCtx.arc(0, 0, ROTATION_BUTTON_RADIUS, 0, 2 * Math.PI);
            outerCtx.fill()  
            outerCtx.drawImage(icon, -10, -10, 20, 20);
            drawScalingButton();
        };
        
        
    }

    useEffect(() => {
    
        if (previewImage && ctx && canvas) {
            // window.requestAnimationFrame(() => drawImageOnCanvas(rotation));
            drawImageOnCanvas();
        }
    }, [previewImage, ctx, canvas])

    useEffect(() => {
        const canvas = canvasRef.current;
        
        const ctx = canvas.getContext("2d")
        setCanvas(canvas);
        setCtx(ctx);
        
    }, [canvasRef])


    useEffect(() => {
        const outerCanvas = outerCanvasRef.current;
        
        const outerCtx = outerCanvas.getContext("2d")
        setOuterCanvas(outerCanvas);
        setOuterCtx(outerCtx);
        
    }, [outerCanvasRef])


    function getAngle(cx, cy, ox, oy, mx, my){
        var x1 = ox - cx;
        var y1 = oy - cy;
        var x2 = mx - cx;
        var y2 = my - cy;
        var d1 = Math.sqrt(x1 * x1 + y1 * y1);
        var d2 = Math.sqrt(x2 * x2 + y2 * y2);
    
        return Math.asin((x1 / d1) * (y2 / d2) - (y1 / d1) * (x2 / d2));
    }

    const handleMouseMove =  (e) => {
        if (!clicked) return;
        
        console.log(e);

       
        if (clicked === "rotation") {
            let firstPoint = oldPoints.current.shift();
            firstPoint = firstPoint ? firstPoint : {x: 0, y: 0}
            const lastPoint = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY};
            oldPoints.current.push(lastPoint);

            const angle = getAngle(imagePosition.x, imagePosition.y, firstPoint.x, firstPoint.y, lastPoint.x, lastPoint.y)
            console.log(rotation + angle * 31);
            console.log(firstPoint, lastPoint)

            setRotation(rotation => (rotation + angle * 59) % 360);
        }
        else if (clicked === "scaling") {
            setScale(scale => scale + e.movementX * 0.001)
        }
        



        // setRotation(rotation => rotation - e.movementX * 0.1);

     
        
        drawImageOnCanvas(rotation, scale, color.hex);

    }




    useEffect(() => {

        if (clicked) {
            const handleMouseUp = () => {
                oldPoints.current.length = 0
                setClicked(false)
            }
      
            window.addEventListener("mouseup" , handleMouseUp);
      
            return () => {
                window.removeEventListener("mouseup", handleMouseUp);
            }
        }

    }, [clicked])

    return (
        <div className='min-h-screen flex flex-col gap-y-5 items-center' ref={divRef}>
            <input 
                type="file" 
                onChange={handleFileChange}
                multiple={false}
            />

          
            
           
           <div className='relative z-0'>
                <canvas ref={canvasRef}
                    className='relative z-[5]'
                    
                >
                    
                </canvas>
                <canvas ref={outerCanvasRef} className='absolute top-0 left-0 h-full w-full z-[100]'
                    onMouseDown={(e) => {
                        
                        const xPos = e.nativeEvent.offsetX;
                        const yPos = e.nativeEvent.offsetY;
                        // console.log("Clicked at" ,xPos, yPos);
                        if (xPos > buttonPosition.x - ROTATION_BUTTON_RADIUS && xPos < buttonPosition.x + ROTATION_BUTTON_RADIUS && 
                            yPos > buttonPosition.y - ROTATION_BUTTON_RADIUS && yPos < buttonPosition.y + ROTATION_BUTTON_RADIUS
                        )
                        {
                            oldPoints.current.push({x: xPos, y: yPos});
                            setClicked("rotation");
                        }
                        else if (xPos > scalingButtonPosition.x - SCALING_BUTTON_RADIUS && xPos < scalingButtonPosition.x + SCALING_BUTTON_RADIUS &&
                                 yPos > scalingButtonPosition.y - SCALING_BUTTON_RADIUS && yPos < scalingButtonPosition.y + SCALING_BUTTON_RADIUS
                        )
                        {
                            setClicked("scaling");
                        }
                    }}
                    onMouseMove={handleMouseMove}
                >

                </canvas>
           </div>
        
           <div className='w-[500px] mt-10 self-center'>
            <ColorPicker hideInput={["hsv"]} color={color} onChange={setColor} />
            {/* <SketchPicker/> */}
        </div>
          

        </div>
  )
}

export default OnlyCanvas