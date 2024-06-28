import { useEffect,useRef, useState } from "react";
import "./ImageEditor.css";
import Overlay from "../../../assets/overlay.png"
import Facemask from "../../../assets/facemask.png"
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";




export const ImageEditor = () => {
    const contextRef = useRef(null);
    const bdctxRef = useRef(null);
    const bgctxRef = useRef(null);
    const downloadctxRef = useRef(null);
    const canvasRef = useRef(null);
    const bdcanvasRef = useRef(null);
    const bgcanvasRef = useRef(null);
    const downloadcanvasRef = useRef(null);
    const imageBorderRef = useRef(null);
    const widthsliderRef = useRef(null);
    const img = new Image();
    const mask = new Image();
    var mouse = {
        clickx : null,
        clicky : null,
        x : null,
        y : null
    }
    let MOUSEACTIVE = false;
    // let canvasX = 0;
    // let canvasY = 0;
    // const [canvasX, setCanvasX] = useState(0);
    // const [canvasY, setCanvasY] = useState(0);

    let xCoord = 0;
    let yCoord = 0;
    let rotatedxCoord = 0;
    let rotatedyCoord = 0;
    let scaleFactor = 0;
    let lastRatio = 1;
    let imgWidth = 0;
    let imgHeight = 0;
    let scaleRatio = 0;
    let distance = 0;
    // let imageCenterX = 0;
    // let imageCenterY = 0;
    const [imageCenterX, setImageCenterX] = useState(0);
    const [imageCenterY, setImageCenterY] = useState(0);

    let angleDistance = 0;
    let imgAngle = 0;
    let alphaAngle = 0;
    let lastAngle = 0;
    let diagonal = 0;
    let topleft = 0;
    let topright = 0;
    let bottomleft = 0;
    let bottomright = 0;
    let triangleArea1 = 0;
    let triangleArea2 = 0;
    let triangleArea3 = 0;
    let triangleArea4 = 0;
    let rectArea = 0;
    let clickonImage = false;
    let distfromRotationcenter = 0;
    let imageTranslation = false;
    let borderWidthX = 0;
    let borderWidthY = 0;
    let startColor = null;
    let stopColor = null;
    let bgColor = "red";
    let borderWidth = 10;
    let selectedRadio = undefined;
    let showBorder = false;

    
// for getting canvas object
    useEffect(()=>{
        const canvas = canvasRef.current;
        const bdcanvas = bdcanvasRef.current;
        const bgcanvas = bgcanvasRef.current;
        // const downloadcanvas = downloadcanvasRef.current;
        let boundingRect = bgcanvas.getBoundingClientRect()
        console.log(boundingRect);
        setCanvasX(parseInt(boundingRect.left));
        setCanvasY(parseInt(boundingRect.top));
        // canvasX = parseInt(boundingRect.left);
        // canvasY = parseInt(boundingRect.top);
        contextRef.current = canvas.getContext("2d");
        bdctxRef.current = bdcanvas.getContext("2d");
        bgctxRef.current = bgcanvas.getContext("2d");
        // bgctxRef.fillStyle = "red";
        // bgctxRef.current.fillRect(0,0,bgcanvasRef.current.width,bgcanvasRef.current.height);
        
        
    },[])
    
// for changing slider state using checkbox
    const checkBoxClicked = () => {
        console.log("checkbox clicked");
        
        if (imageBorderRef.current.checked){
            showBorder = true;
            widthsliderRef.current.disabled = false;
            resizeImage(getScalefactor(0,0));

        }else{
            showBorder = false;
            widthsliderRef.current.disabled = true;
            bdctxRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);

        }
        console.log("showBorder",showBorder);
    };
    
    function sliderValue(event){
        borderWidth = event.target.value;
        borderWidthX = parseInt(borderWidth)+imgWidth;
        borderWidthY = borderWidthX*imgHeight/imgWidth-5;
        resizeImage(getScalefactor(0,0));
    };

    function uploadImage(){
        img.src = Overlay
        img.onload = function(){
            mask.src = Facemask
            mask.onload = function(){
                imgWidth = img.naturalWidth;
                imgHeight = img.naturalHeight;
                borderWidthX = parseInt(borderWidth) + imgWidth;
                borderWidthY = parseInt(borderWidth) + imgHeight;
                rotatedxCoord = xCoord = parseInt((canvasRef.current.width - img.naturalWidth)/2) ;
                rotatedyCoord = yCoord = parseInt((canvasRef.current.height - img.naturalHeight)/2);
                // imageCenterX = xCoord + imgWidth/2;
                // imageCenterY = yCoord + imgHeight/2;
                setImageCenterX(xCoord + imgWidth/2);
                setImageCenterY( yCoord + imgHeight/2);

                contextRef.current.translate(canvasRef.current.width/2,canvasRef.current.height/2);
                contextRef.current.rotate(imgAngle);
                contextRef.current.drawImage(img, -imgWidth/2, -imgHeight/2);
                contextRef.current.rotate(-imgAngle);
                contextRef.current.translate(-canvasRef.current.width/2,-canvasRef.current.height/2);
                console.log("image done");

            }
        }
    };

    function clearBg(){
        bgctxRef.current.fillStyle = bgColor;
        bgctxRef.current.fillRect(0,0,bgcanvasRef.current.width,bgcanvasRef.current.height);

    }

    function transformationOption(event){
        selectedRadio = event.target.value;
        console.log(selectedRadio);
    }

    function mousedownHandler(event){
        mouse.clickx = event.clientX;
        mouse.clicky = event.clientY;
        MOUSEACTIVE = true;
        if(selectedRadio == "translate"){
            mouse.clickx -= canvasX +imageCenterX;
            mouse.clicky -= canvasY +imageCenterY;
            console.log("Canvas", canvasX, canvasY);
            console.log("Image Center", imageCenterX, imageCenterY);
            distfromRotationcenter = Math.sqrt(Math.pow(mouse.clickx,2) + Math.pow(mouse.clicky,2));
            alphaAngle = Math.atan(mouse.clickx/mouse.clicky) + imgAngle;
            if (mouse.clicky < 0){
                mouse.clickx = -distfromRotationcenter*Math.sin(alphaAngle);
                mouse.clicky = -distfromRotationcenter*Math.cos(alphaAngle);            
            }else{
                mouse.clickx = distfromRotationcenter*Math.sin(alphaAngle);
                mouse.clicky = distfromRotationcenter*Math.cos(alphaAngle);
            };
            // console.log("points:",mouse.x,mouse.y);
            contextRef.current.translate(imageCenterX,imageCenterY);
            contextRef.current.rotate(imgAngle);
            rotatedxCoord = -(imgWidth)/2;
            rotatedyCoord = -(imgHeight)/2;
            diagonal = Math.sqrt(Math.pow(imgWidth,2) + Math.pow(imgHeight,2));
            topleft = [rotatedxCoord,rotatedyCoord]; 
            topright = [imgWidth/2,rotatedyCoord];
            bottomleft = [rotatedxCoord,imgHeight/2];
            bottomright = [imgWidth/2,imgHeight/2];
            contextRef.current.rotate(-imgAngle);
            contextRef.current.translate(-imageCenterX,-imageCenterY);
            console.log("Before sending to rect clicked",mouse.clickx,mouse.clicky,topleft,topright,bottomleft,bottomright);
            if (isRectclicked(mouse.clickx,mouse.clicky,topleft,topright,bottomleft,bottomright)){
                imageTranslation = true;
            };
        };
        

    };

    function mouseupHandler(event){
        MOUSEACTIVE = false;
        imageTranslation = false;
        if (selectedRadio == "scale"){
            imgWidth = imgWidth*lastRatio;
            imgHeight = imgHeight*lastRatio;
            borderWidthX = imgWidth + borderWidth*lastRatio;
            borderWidthY = borderWidthX*imgHeight/imgWidth-5;
        }
        else if (selectedRadio == "rotate"){
            imgAngle = lastAngle;
        };
    };

    function mousemoveHandler(event){
        if (MOUSEACTIVE){
            mouse.x = event.clientX - mouse.clickx;
            mouse.y = event.clientY - mouse.clicky;
            // console.log("cont mouse:",mouse.x,mouse.y);
            // console.log("called");
            if (selectedRadio == "scale"){
                resizeImage(getScalefactor(mouse.x,mouse.y));
                // console.log("scale",imageCenterX,imageCenterY);
            } 
            else if(selectedRadio == "rotate"){
                rotateImage(getRotationAngle(mouse.x));
            }
            else if(selectedRadio == "translate"){
                // coordinates with respect to image center in unrotated canvas
                mouse.x = event.clientX - canvasX;
                mouse.y = event.clientY - canvasY;
    
                // console.log("points:",mouse.x,mouse.y);
                getTranslationcoord(mouse.x,mouse.y);
            };
        };
    };

    function getScalefactor(mousex,mousey){ 
        distance = Math.max(mousex,mousey);
        scaleRatio = distance/img.naturalWidth;
        
        scaleFactor = 1 + scaleRatio;
        
        return scaleFactor;
    };
    
    
    function getRotationAngle(mousex){
        angleDistance = mousex;
        return (imgAngle - angleDistance*Math.PI/img.naturalWidth);
    
    };
    
    function getTranslationcoord(mousex,mousey){
    
        
        distfromRotationcenter = Math.sqrt(Math.pow(mouse.clickx,2) + Math.pow(mouse.clicky,2));
        alphaAngle = Math.atan(mouse.clickx/mouse.clicky) - imgAngle;
        let x = 0, y = 0;
        if (mouse.clicky > 0){
            x = (mousex - distfromRotationcenter*Math.sin(alphaAngle));
            y = (mousey - distfromRotationcenter*Math.cos(alphaAngle));
            setImageCenterX(mousex - distfromRotationcenter*Math.sin(alphaAngle));
            setImageCenterY(mousey - distfromRotationcenter*Math.cos(alphaAngle));

        }else{
            x = (mousex + distfromRotationcenter*Math.sin(alphaAngle));
            y = (mousey + distfromRotationcenter*Math.cos(alphaAngle));
            setImageCenterX(mousex + distfromRotationcenter*Math.sin(alphaAngle));
            setImageCenterY(mousey + distfromRotationcenter*Math.cos(alphaAngle));
        }
        
        console.log("translation",imageTranslation);
        if (imageTranslation){
            translateImage(x,y);
        }
    }
    
    function drawBorder(angle,scaleRatio){
        if (showBorder){
            bdctxRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
    
            
            console.log("maskcoord",-borderWidthX*scaleRatio/2,-borderWidthY*scaleRatio/2);
            console.log(borderWidth);  
            bdctxRef.current.translate(imageCenterX,imageCenterY);
            bdctxRef.current.rotate(angle);
            bdctxRef.current.drawImage(mask,-borderWidthX*scaleRatio/2 ,-borderWidthY*scaleRatio/2 ,borderWidthX*scaleRatio,borderWidthY*scaleRatio);
            bdctxRef.current.rotate(-angle);
            bdctxRef.current.translate(-imageCenterX,-imageCenterY);
        }
    }
    
    function resizeImage(scaleRatio){
        
        contextRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
        lastRatio = scaleRatio;
        
        diagonal = Math.sqrt(Math.pow((imgWidth*scaleRatio)/2,2) + Math.pow((imgHeight*scaleRatio)/2,2));
        alphaAngle = Math.atan(imgWidth/imgHeight) - imgAngle;
        const cx = xCoord + diagonal*Math.sin(alphaAngle);
        const cy = yCoord + diagonal*Math.cos(alphaAngle);
        setImageCenterX(xCoord + diagonal*Math.sin(alphaAngle));
        setImageCenterY(yCoord + diagonal*Math.cos(alphaAngle));
        contextRef.current.translate(cx,cy);
        contextRef.current.rotate(imgAngle);
        drawBorder(imgAngle,scaleRatio);
        contextRef.current.drawImage(img, -(imgWidth*scaleRatio)/2, -(imgHeight*scaleRatio)/2,imgWidth*scaleRatio,imgHeight*scaleRatio);
        contextRef.current.strokeRect(-(imgWidth*scaleRatio)/2, -(imgHeight*scaleRatio)/2,imgWidth*scaleRatio,imgHeight*scaleRatio);
        contextRef.current.rotate(-imgAngle);
        contextRef.current.translate(-cx,-cy);
        console.log("imageCentersscale",cx,cy);
        console.log("imagecoord",-(imgWidth*scaleRatio)/2,-(imgHeight*scaleRatio)/2);
        
        
    };
    
    function rotateImage(angle){
        contextRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
        contextRef.current.translate(imageCenterX,imageCenterY);
        contextRef.current.rotate(angle);
        drawBorder(angle,1);
        contextRef.current.drawImage(img, -(imgWidth)/2, -(imgHeight)/2,imgWidth,imgHeight);
        contextRef.current.strokeRect(-(imgWidth)/2, -(imgHeight)/2,imgWidth,imgHeight);
        contextRef.current.rotate(-angle);
        contextRef.current.translate(-imageCenterX,-imageCenterY);
        lastAngle = angle;
        diagonal = Math.sqrt(Math.pow(imgWidth/2,2) + Math.pow(imgHeight/2,2));
        alphaAngle = Math.atan(imgWidth/imgHeight) - angle;
        xCoord = -diagonal*Math.sin(alphaAngle) + imageCenterX;    
        yCoord = -diagonal*Math.cos(alphaAngle) + imageCenterY;
        console.log("imageCenters",imageCenterX,imageCenterY);
        
    };
    
    function translateImage(centerx,centery){
        contextRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
        contextRef.current.translate(centerx,centery);
        contextRef.current.rotate(imgAngle);
        drawBorder(imgAngle,1);
        contextRef.current.drawImage(img, -imgWidth/2, -imgHeight/2,imgWidth,imgHeight);
        contextRef.current.rotate(-imgAngle);
        contextRef.current.translate(-imageCenterX,-imageCenterY);
        diagonal = Math.sqrt(Math.pow(imgWidth/2,2) + Math.pow(imgHeight/2,2));
        alphaAngle = Math.atan(imgWidth/imgHeight) - imgAngle;
        xCoord = -diagonal*Math.sin(alphaAngle) + imageCenterX;    
        yCoord = -diagonal*Math.cos(alphaAngle) + imageCenterY;
        console.log("coords",xCoord,yCoord);  
        console.log("imageCenters",imageCenterX,imageCenterY);  
    };
    
    function isRectclicked(mousex,mousey,topleft,topright,bottomleft,bottomright){
        rectArea = imgHeight*imgWidth;
        triangleArea1 = Math.abs(mousex*(topleft[1]-topright[1]) + topleft[0]*(topright[1]-mousey) + topright[0]*(mousey-topleft[1]))/2;
        triangleArea2 = Math.abs(mousex*(topright[1]-bottomright[1]) + topright[0]*(bottomright[1]-mousey) + bottomright[0]*(mousey-topright[1]))/2;
        triangleArea3 = Math.abs(mousex*(bottomright[1]-bottomleft[1]) + bottomright[0]*(bottomleft[1]-mousey) + bottomleft[0]*(mousey-bottomright[1]))/2;
        triangleArea4 = Math.abs(mousex*(bottomleft[1]-topleft[1]) + bottomleft[0]*(topleft[1]-mousey) + topleft[0]*(mousey-bottomleft[1]))/2;
        
        console.log(rectArea, (triangleArea1+triangleArea2+triangleArea3+triangleArea4));
        if (Math.round(rectArea,0) < Math.round((triangleArea1+triangleArea2+triangleArea3+triangleArea4),0)){
            clickonImage = false;
            console.log(clickonImage);
            return clickonImage;
        }else{
            clickonImage = true;
            console.log(clickonImage);
            return clickonImage;
        }
    };

    function changebgColor(bgColor){
        bgctxRef.current.fillStyle = bgColor;
        bgctxRef.current.roundRect(0,0,bgcanvasRef.current.width,bgcanvasRef.current.height,10);
        bgctxRef.current.fill();
    }

    function downloadImage(){
        
        // let downloadcanvas = new OffscreenCanvas(480,480);
        // let downloadctx = downloadcanvas.getContext("2d");
        downloadctxRef.current = downloadcanvasRef.current.getContext("2d");
        downloadctxRef.current.drawImage(bgcanvasRef.current,0,0);
        downloadctxRef.current.drawImage(bdcanvasRef.current,0,0);
        downloadctxRef.current.drawImage(canvasRef.current,0,0);
        console.log(downloadcanvasRef.current);

        var currentdate = new Date();
        var datetime = currentdate.getDate() + "/" + currentdate.getTime();
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.download = `faceclipper${datetime}.png`;
        a.href = downloadcanvasRef.current.toDataURL();
        a.click();
        document.body.removeChild(a);

    }
    const [backgroundColor, setBackgroundColor] = useColor("#00ff00");
    
    return(
        <>
        <div className="image-editor h-[500px] w-[500px]">
            <canvas ref={bgcanvasRef} width={480} height={480} id="background-editor-box"
            ></canvas>
            <canvas ref={bdcanvasRef} width={480} height={480} id="border-editor-box"></canvas>
            <canvas ref={canvasRef} onMouseDown={mousedownHandler} onMouseUp={mouseupHandler} onMouseMove={mousemoveHandler} width={480} height={480} id="image-editor-box"></canvas>
            <canvas ref={downloadcanvasRef} width={480} height={480} id="download-box"></canvas>
        </div>
        <div className="bg-filters">
            <button onClick={() => changebgColor(backgroundColor.hex)} id="change-background-color" type="submit">Change Bg Color</button>
        </div>
        <div className="function-buttons" >
            <button onClick={uploadImage} id="upload-image" type="submit">Upload Photo</button><br/>
            <input onClick={transformationOption} type="radio" name="transformations" id="scale-radio" value="scale"/>
            <label htmlFor="scale-radio">Allow Scaling</label>
            <input onClick={transformationOption} type="radio" name="transformations" id="rotate-radio" value="rotate"/>
            <label htmlFor="rotate-radio">Allow Rotation</label>
            <input onClick={transformationOption} type="radio" name="transformations" id="translate-radio" value="translate"/>
            <label htmlFor="translate-radio">Allow Translation</label><br/>
            <input ref={imageBorderRef} onClick={checkBoxClicked} type="checkbox" id="image-border" value="image-border"/>Image Border
            <input ref={widthsliderRef} onChange={sliderValue} type="range" id="border-width" min="0" max="30" defaultValue="10" disabled/>
    
        </div>
        <button onClick={downloadImage} type="submit" id="downloadBtn" >Download Picture</button>

        <ColorPicker color={backgroundColor} onChange={setBackgroundColor}/>
        
        </>
        
    )
}