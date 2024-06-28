import { useEffect,useRef, useState } from "react";
import "./ImageEditor.css";
import Head_Image from "../../../assets/head_image.png"
import Facemask from "../../../assets/face_mask.png"
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import UpArrow from '../../../assets/up_button.png'
import DownArrow from '../../../assets/down_button.png'
import CancelButton from '../../../assets/cancel_button.png'
import LoadingImage from '../../../assets/loading_crop.png'
import { MdCancel, MdOutlineArrowDropDownCircle } from "react-icons/md";
import { IoIosArrowDropdown, IoIosArrowDropup, IoIosArrowUp } from "react-icons/io";




export const ImageEditor = ({headImage, faceMask, imageLoading}) => {
    const contextRef = useRef(null);
    const bdctxRef = useRef(null);
    const bgctxRef = useRef(null);
    const downloadctxRef = useRef(null);
    const previewRef = useRef(null);
    const dimctxRef = useRef(null);
    const canvasRef = useRef(null);
    const bdcanvasRef = useRef(null);
    const bgcanvasRef = useRef(null);
    // background gradient animation
    const canvasBgRef = useRef(null);
    const downloadcanvasRef = useRef(null);
    const prevctxRef = useRef(null);
    const dimcanvasRef = useRef(null);
    const imageBorderRef = useRef(null);
    const widthsliderRef = useRef(null);
    const img = useRef(new Image());
    const mask = useRef(new Image());
    var mouse = useRef({
        clickx : null,
        clicky : null,
        x : null,
        y : null
    })
    let MOUSEACTIVE = useRef(false);
    let canvasX = useRef(0);
    let canvasY = useRef(0);
    let xCoord = useRef(0);
    let yCoord = useRef(0);
    let rotatedxCoord = useRef(0);
    let rotatedyCoord = useRef(0);
    let scaleFactor = useRef(0);
    let lastRatio = useRef(1);
    let imgWidth = useRef(0);
    let imgHeight = useRef(0);
    let scaleRatio = 0;
    let distance = useRef(0);
    let imageCenterX = useRef(0);
    let imageCenterY = useRef(0);
    let angleDistance = useRef(0);
    let imgAngle = useRef(0);
    let alphaAngle = useRef(0);
    let lastAngle = useRef(0);
    let diagonal = useRef(0);
    let topleft = 0;
    let topright = 0;
    let bottomleft = 0;
    let bottomright = 0;
    let triangleArea1 = 0;
    let triangleArea2 = 0;
    let triangleArea3 = 0;
    let triangleArea4 = 0;
    let rectArea = 0;
    let clickonImage = useRef(false);
    let distfromRotationcenter = useRef(0);
    let imageTranslation = useRef(false);
    let borderWidthX = useRef(0);
    let borderWidthY = useRef(0);
    let borderWidth = useRef(10);
    let selectedRadio = useRef(0);
    let showBorder = useRef(false);
    let blurRef = useRef(0);
    let contrastRef = useRef(1);
    let cutInRef = useRef(0);
    let brightnessRef = useRef(1.4);
    let saturationRef = useRef(1.5);
    let sepiaRef = useRef(0);
    let hueRef = useRef(0);
    let grayscaleRef = useRef(0);
    const loadingRequestId = useRef(null);
    const [showColorPicker,setshowColorPicker] = useState(false);
    const [showMenu, setShowMenu] = useState("");
    const [backgroundColor, setBackgroundColor] = useColor("#ffffff");
    const [showGradient,setshowGradient] = useState(false);
    const [gradColor,setgradColor] = useColor("#ffffff");
    const [gradientColorPalette, setGradientColorPalette] = useState([{gcolor:gradColor, clicked:false, gvalue:0.5}])
    const [gradientType,setgradientType] = useState("none");
    const [borderColor,setborderColor] = useColor("#ffffff");
    const [showborderOptions,setshowborderOptions] = useState(false);
    const [showborderPicker,setshowborderPicker] = useState(false);
    const [showDimensions,setshowDimensions] = useState(false);
    const [showPreview,setshowPreview] = useState(false);
    


    
// for getting canvas object
    useEffect(()=>{
        const canvas = canvasRef.current;
        const bdcanvas = bdcanvasRef.current;
        const bgcanvas = bgcanvasRef.current;
        // const downloadcanvas = downloadcanvasRef.current;
        let boundingRect = bgcanvas.getBoundingClientRect()
        console.log(boundingRect);
        canvasX.current = parseInt(boundingRect.left);
        canvasY.current = parseInt(boundingRect.top);
        contextRef.current = canvas.getContext("2d");
        bdctxRef.current = bdcanvas.getContext("2d");
        bgctxRef.current = bgcanvas.getContext("2d");
        prevctxRef.current = previewRef.current.getContext("2d");
        dimctxRef.current = dimcanvasRef.current.getContext("2d");
        // bgctxRef.fillStyle = "red";
        // bgctxRef.current.fillRect(0,0,bgcanvasRef.current.width,bgcanvasRef.current.height);
        
        
    },[])
    
// for changing slider state using checkbox
    const checkBoxClicked = () => {
        console.log("checkbox clicked");
        
        if (imageBorderRef.current.checked){
            setshowborderOptions(true);
            console.log("show border",showborderOptions)
            
            resizeImage(getScalefactor(0,0));

        }else{
            setshowborderOptions(false)
            
            bdctxRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);

        }
    };
    
    function sliderValue(event){
        borderWidth.current = event.target.value;
        borderWidthX.current = parseInt(borderWidth.current)+imgWidth.current;
        borderWidthY.current = borderWidthX.current*imgHeight.current/imgWidth.current-5;
        resizeImage(getScalefactor(0,0));
    };

    function drawrefinedImage(scaleRatio){
        contextRef.current.filter = `blur(${blurRef.current}px)`;  
        contextRef.current.drawImage(mask.current,-(imgWidth.current*scaleRatio)/2 + cutInRef.current,-(imgHeight.current*scaleRatio)/2 + cutInRef.current*imgHeight.current/imgWidth.current ,imgWidth.current*scaleRatio-2*cutInRef.current,imgHeight.current*scaleRatio-2*cutInRef.current*imgHeight.current/imgWidth.current);
        contextRef.current.filter = "blur(0px)"; 
        contextRef.current.filter =  `brightness(${brightnessRef.current}) contrast(${contrastRef.current}) sepia(${sepiaRef.current}) grayscale(${grayscaleRef.current}) saturate(${saturationRef.current}) hue-rotate(${hueRef.current}deg)`; 

        // contextRef.current.filter = `contrast(${contrastRef.current}) brightness(${brightnessRef.current}) saturation(${saturationRef.current}) hue-rotate(${hueRef.current}) sepia(${sepiaRef.current}) grayscale(${grayscaleRef.current})`;
        contextRef.current.globalCompositeOperation = "source-in";
        
        contextRef.current.drawImage(img.current, -imgWidth.current*scaleRatio/2, -imgHeight.current*scaleRatio/2,imgWidth.current*scaleRatio,imgHeight.current*scaleRatio);
        contextRef.current.globalCompositeOperation = "source-over";
        // contextRef.current.filter = "none";
    };

    function uploadImage(){
        console.log(headImage, faceMask);
        img.current.src = Head_Image
        img.current.onload = function(){
            mask.current.src = Facemask
            mask.current.onload = function(){
                imgWidth.current = img.current.naturalWidth;
                imgHeight.current = img.current.naturalHeight;
                borderWidthX.current = parseInt(borderWidth.current) + imgWidth.current;
                borderWidthY.current = parseInt(borderWidth.current) + imgHeight.current;
                rotatedxCoord.current = xCoord.current = parseInt((canvasRef.current.width - img.current.naturalWidth)/2) ;
                rotatedyCoord.current = yCoord.current = parseInt((canvasRef.current.height - img.current.naturalHeight)/2);
                imageCenterX.current = xCoord.current + imgWidth.current/2;
                imageCenterY.current = yCoord.current + imgHeight.current/2;
                console.log("Image center at from use effect", imageCenterX, imageCenterY);
                contextRef.current.translate(canvasRef.current.width/2,canvasRef.current.height/2);
                contextRef.current.rotate(imgAngle.current);
                drawrefinedImage(1);
                // contextRef.current.drawImage(img.current, -imgWidth.current/2, -imgHeight.current/2);
                contextRef.current.rotate(-imgAngle.current);
                contextRef.current.translate(-canvasRef.current.width/2,-canvasRef.current.height/2);
                console.log("image done");

            }
        }
    };

    useEffect(() => {
        if (headImage && faceMask) {
            uploadImage();
        }
    }, [headImage, faceMask])

    function transformationOption(event){
        selectedRadio.current = event.target.value;
        console.log(selectedRadio.current);
    }

    function mousedownHandler(event){
        mouse.current.clickx = event.clientX;
        mouse.current.clicky = event.clientY;
        // console.log("Clicked at " , mouse)
        MOUSEACTIVE.current = true;
        if(selectedRadio.current == "translate"){
            mouse.current.clickx -= canvasX.current +imageCenterX.current;
            mouse.current.clicky -= canvasY.current +imageCenterY.current;
            // console.log("Canvas", canvasX.current, canvasY.current);
            // console.log("Image Center", imageCenterX.current, imageCenterY.current);
            distfromRotationcenter.current = Math.sqrt(Math.pow(mouse.current.clickx,2) + Math.pow(mouse.current.clicky,2));
            alphaAngle.current = Math.atan(mouse.current.clickx/mouse.current.clicky) + imgAngle.current;
            if (mouse.current.clicky < 0){
                mouse.current.clickx = -distfromRotationcenter.current*Math.sin(alphaAngle.current);
                mouse.current.clicky = -distfromRotationcenter.current*Math.cos(alphaAngle.current);            
            }else{
                mouse.current.clickx = distfromRotationcenter.current*Math.sin(alphaAngle.current);
                mouse.current.clicky = distfromRotationcenter.current*Math.cos(alphaAngle.current);
            };
            // console.log("points:",mouse);
            contextRef.current.translate(imageCenterX.current,imageCenterY.current);
            contextRef.current.rotate(imgAngle.current);
            rotatedxCoord.current = -(imgWidth.current)/2;
            rotatedyCoord.current = -(imgHeight.current)/2;
            diagonal.current = Math.sqrt(Math.pow(imgWidth.current,2) + Math.pow(imgHeight.current,2));
            topleft = [rotatedxCoord.current,rotatedyCoord.current]; 
            topright = [imgWidth.current/2,rotatedyCoord.current];
            bottomleft = [rotatedxCoord.current,imgHeight.current/2];
            bottomright = [imgWidth.current/2,imgHeight.current/2];
            contextRef.current.rotate(-imgAngle.current);
            contextRef.current.translate(-imageCenterX.current,-imageCenterY.current);
            // console.log("Before sending to rect clicked",mouse.current.clickx,mouse.current.clicky,topleft,topright,bottomleft,bottomright);
            if (isRectclicked(mouse.current.clickx,mouse.current.clicky,topleft,topright,bottomleft,bottomright)){
                imageTranslation.current = true;
            }else{
                MOUSEACTIVE.current = false;
            }
        };
        

    };

    function mouseupHandler(event){
        MOUSEACTIVE.current = false;
        imageTranslation.current = false;
        if (selectedRadio.current == "scale"){
            imgWidth.current = imgWidth.current*lastRatio.current;
            imgHeight.current = imgHeight.current*lastRatio.current;
            borderWidthX.current = imgWidth.current + borderWidth.current*lastRatio.current;
            borderWidthY.current = borderWidthX.current*imgHeight.current/imgWidth.current-5;
        }
        else if (selectedRadio.current == "rotate"){
            imgAngle.current = lastAngle.current;
        };
    };

    function mousemoveHandler(event){
        if (MOUSEACTIVE.current){
            mouse.current.x = event.clientX - mouse.current.clickx;
            mouse.current.y = event.clientY - mouse.current.clicky;
            // console.log("cont mouse.current:",mouse.current.x,mouse.current.y);
            // console.log("called");
            if (selectedRadio.current == "scale"){
                resizeImage(getScalefactor(mouse.current.x,mouse.current.y));
                // console.log("scale",imageCenterX.current,imageCenterY.current);
            } 
            else if(selectedRadio.current == "rotate"){
                rotateImage(getRotationAngle(mouse.current.x));
            }
            else if(selectedRadio.current == "translate"){
                // coordinates with respect to image center in unrotated canvas
                mouse.current.x = event.clientX - canvasX.current;
                mouse.current.y = event.clientY - canvasY.current;
    
                // console.log("points:",mouse.current.x,mouse.current.y);
                getTranslationcoord(mouse.current.x,mouse.current.y);
                console.log("moving");
            };
        };
    };

    function getScalefactor(mousex,mousey){ 
        distance.current = Math.max(mousex,mousey);
        scaleRatio = distance.current/img.current.naturalWidth;
        
        scaleFactor.current = 1 + scaleRatio;
        
        return scaleFactor.current;
    };
    
    
    function getRotationAngle(mousex){
        angleDistance.current = mousex;
        return (imgAngle.current - angleDistance.current*Math.PI/img.current.naturalWidth);
    
    };
    
    function getTranslationcoord(mousex,mousey){
    
        
        distfromRotationcenter.current = Math.sqrt(Math.pow(mouse.current.clickx,2) + Math.pow(mouse.current.clicky,2));
        alphaAngle.current = Math.atan(mouse.current.clickx/mouse.current.clicky) - imgAngle.current;
        if (mouse.current.clicky > 0){
            imageCenterX.current = (mousex - distfromRotationcenter.current*Math.sin(alphaAngle.current));
            imageCenterY.current = (mousey - distfromRotationcenter.current*Math.cos(alphaAngle.current));
        }else{
            imageCenterX.current = (mousex + distfromRotationcenter.current*Math.sin(alphaAngle.current));
            imageCenterY.current = (mousey + distfromRotationcenter.current*Math.cos(alphaAngle.current));
        }
        
        console.log("translation",imageTranslation.current);
        if (imageTranslation.current){
            translateImage(imageCenterX.current,imageCenterY.current);
        }
    }

    function drawDimensions(angle,scaleRatio){
        if(showDimensions){
            prevctxRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
            console.log("showDimensions",showDimensions)
            console.log("imgwidth",imgWidth.current)
            console.log("scaleRatio",scaleRatio)
            prevctxRef.current.translate(imageCenterX.current,imageCenterY.current);
            prevctxRef.current.rotate(angle);
            prevctxRef.current.strokeStyle = "black";
            prevctxRef.current.strokeRect(-(imgWidth.current*scaleRatio)/2, -(imgHeight.current*scaleRatio)/2,imgWidth.current*scaleRatio,imgHeight.current*scaleRatio);
            prevctxRef.current.rotate(-angle);
            prevctxRef.current.translate(-imageCenterX.current,-imageCenterY.current);
        }
        else{
            prevctxRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
        }
        // if (showPreview){
        //     console.log("called")
        //     prevctxRef.current.fillStyle = "black";
        //     prevctxRef.current.globalAlpha = 0.5;
        //     prevctxRef.current.fillRect(0,0,canvasRef.current.width,canvasRef.current.height)
        //     prevctxRef.current.globalCompositeOperation = "xor";
        //     prevctxRef.current.fillStyle = "white";
        //     prevctxRef.current.globalAlpha = 1;
        //     prevctxRef.current.beginPath();
        //     prevctxRef.current.arc(canvasRef.current.width/2,canvasRef.current.height/2,canvasRef.current.width/2,0,Math.PI*2)
        //     prevctxRef.current.fill();
        //     prevctxRef.current.globalCompositeOperation = "source-over";
        // }
        // else{
        //     prevctxRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
        // }

    }
    
    function drawBorder(angle,scaleRatio){
        if (showborderOptions){
            bdctxRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
            // console.log("maskcoord",-borderWidthX.current*scaleRatio/2,-borderWidthY.current*scaleRatio/2);
            // console.log(borderWidth.current);  
            bdctxRef.current.translate(imageCenterX.current,imageCenterY.current);
            bdctxRef.current.rotate(angle);
            bdctxRef.current.drawImage(mask.current,-borderWidthX.current*scaleRatio/2 ,-borderWidthY.current*scaleRatio/2 ,borderWidthX.current*scaleRatio,borderWidthY.current*scaleRatio);
            bdctxRef.current.globalCompositeOperation = "source-in";
            bdctxRef.current.fillStyle = borderColor.hex;
            bdctxRef.current.fillRect(-borderWidthX.current*scaleRatio/2 ,-borderWidthY.current*scaleRatio/2 ,borderWidthX.current*scaleRatio,borderWidthY.current*scaleRatio);
            bdctxRef.current.globalCompositeOperation = "source-over";
            bdctxRef.current.filter = "blur(1px)";

            bdctxRef.current.rotate(-angle);
            bdctxRef.current.translate(-imageCenterX.current,-imageCenterY.current);
        }
    }
    
    function resizeImage(scaleRatio){
        
        contextRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
        lastRatio.current = scaleRatio;
        
        diagonal.current = Math.sqrt(Math.pow((imgWidth.current*scaleRatio)/2,2) + Math.pow((imgHeight.current*scaleRatio)/2,2));
        alphaAngle.current = Math.atan(imgWidth.current/imgHeight.current) - imgAngle.current;
        imageCenterX.current = xCoord.current + diagonal.current*Math.sin(alphaAngle.current);
        imageCenterY.current = yCoord.current + diagonal.current*Math.cos(alphaAngle.current);
        contextRef.current.translate(imageCenterX.current,imageCenterY.current);
        contextRef.current.rotate(imgAngle.current);
        drawBorder(imgAngle.current,scaleRatio);
        drawrefinedImage(scaleRatio);
        // contextRef.current.drawImage(img.current, -(imgWidth.current*scaleRatio)/2, -(imgHeight.current*scaleRatio)/2,imgWidth.current*scaleRatio,imgHeight.current*scaleRatio);
        // contextRef.current.strokeRect(-(imgWidth.current*scaleRatio)/2, -(imgHeight.current*scaleRatio)/2,imgWidth.current*scaleRatio,imgHeight.current*scaleRatio);
        contextRef.current.rotate(-imgAngle.current);
        contextRef.current.translate(-imageCenterX.current,-imageCenterY.current);
        console.log("imageCentersscale",imageCenterX.current,imageCenterY.current);
        console.log("imagecoord",-(imgWidth.current*scaleRatio)/2,-(imgHeight.current*scaleRatio)/2);
        
        
    };
    
    function rotateImage(angle){
        contextRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
        contextRef.current.translate(imageCenterX.current,imageCenterY.current);
        contextRef.current.rotate(angle);
        drawBorder(angle,1);
        drawrefinedImage(1);
        // contextRef.current.drawImage(img.current, -(imgWidth.current)/2, -(imgHeight.current)/2,imgWidth.current,imgHeight.current);
        contextRef.current.rotate(-angle);
        contextRef.current.translate(-imageCenterX.current,-imageCenterY.current);
        lastAngle.current = angle;
        diagonal.current = Math.sqrt(Math.pow(imgWidth.current/2,2) + Math.pow(imgHeight.current/2,2));
        alphaAngle.current = Math.atan(imgWidth.current/imgHeight.current) - angle;
        xCoord.current = -diagonal.current*Math.sin(alphaAngle.current) + imageCenterX.current;    
        yCoord.current = -diagonal.current*Math.cos(alphaAngle.current) + imageCenterY.current;
        console.log("imageCenters",imageCenterX.current,imageCenterY.current);
        
    };
    
    function translateImage(centerx,centery){
        contextRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
        contextRef.current.translate(centerx,centery);
        contextRef.current.rotate(imgAngle.current);
        drawBorder(imgAngle.current,1);
        drawrefinedImage(1);
        contextRef.current.strokeRect(-(imgWidth.current)/2, -(imgHeight.current)/2,imgWidth.current,imgHeight.current);

        // contextRef.current.drawImage(img.current, -imgWidth.current/2, -imgHeight.current/2,imgWidth.current,imgHeight.current);
        contextRef.current.rotate(-imgAngle.current);
        contextRef.current.translate(-imageCenterX.current,-imageCenterY.current);
        diagonal.current = Math.sqrt(Math.pow(imgWidth.current/2,2) + Math.pow(imgHeight.current/2,2));
        alphaAngle.current = Math.atan(imgWidth.current/imgHeight.current) - imgAngle.current;
        xCoord.current = -diagonal.current*Math.sin(alphaAngle.current) + imageCenterX.current;    
        yCoord.current = -diagonal.current*Math.cos(alphaAngle.current) + imageCenterY.current;
        console.log("coords",xCoord.current,yCoord.current);  
        console.log("imageCenters",imageCenterX.current,imageCenterY.current);  
    };
    
    function isRectclicked(mousex,mousey,topleft,topright,bottomleft,bottomright){
        rectArea = imgHeight.current*imgWidth.current;
        triangleArea1 = Math.abs(mousex*(topleft[1]-topright[1]) + topleft[0]*(topright[1]-mousey) + topright[0]*(mousey-topleft[1]))/2;
        triangleArea2 = Math.abs(mousex*(topright[1]-bottomright[1]) + topright[0]*(bottomright[1]-mousey) + bottomright[0]*(mousey-topright[1]))/2;
        triangleArea3 = Math.abs(mousex*(bottomright[1]-bottomleft[1]) + bottomright[0]*(bottomleft[1]-mousey) + bottomleft[0]*(mousey-bottomright[1]))/2;
        triangleArea4 = Math.abs(mousex*(bottomleft[1]-topleft[1]) + bottomleft[0]*(topleft[1]-mousey) + topleft[0]*(mousey-bottomleft[1]))/2;
        
        console.log(rectArea, (triangleArea1+triangleArea2+triangleArea3+triangleArea4));
        if (Math.round(rectArea,0) < Math.round((triangleArea1+triangleArea2+triangleArea3+triangleArea4),0)){
            clickonImage.current = false;
            console.log(clickonImage.current);
            return clickonImage.current;
        }else{
            clickonImage.current = true;
            console.log(clickonImage.current);
            return clickonImage.current;
        }
    };

    // function changebgColor(bgColor){
    //     if (bgcanvasRef) {
    //         bgctxRef.current.fillStyle = bgColor.hex;
    //         bgctxRef.current.roundRect(0,0,bgcanvasRef.current.width,bgcanvasRef.current.height,10);
    //         bgctxRef.current.fill();
    //     }
    //     setBackgroundColor(bgColor);
    // }

    function removewhiteBd(event){
        if (event.target.id == "blur"){
            blurRef.current = event.target.value;
        }
        else if (event.target.id == "contrast"){
            contrastRef.current = parseInt(event.target.value)/50;
        }
        else if(event.target.id == "cut-in"){
            cutInRef.current = parseInt(event.target.value);
        }
        else if(event.target.id == "brightness"){
            brightnessRef.current = parseInt(event.target.value)/50;
        }
        else if(event.target.id == "saturation"){
            saturationRef.current = parseInt(event.target.value)/50;
        }
        else if(event.target.id == "hue"){
            hueRef.current = parseInt(event.target.value);
        }
        else if(event.target.id == "sepia"){
            sepiaRef.current = parseInt(event.target.value)/100;
        }
        else if(event.target.id == "grayscale"){
            grayscaleRef.current = parseInt(event.target.value)/100;
        }
        console.log(brightnessRef.current);

        resizeImage(getScalefactor(0,0));
    }


    function applyGradient(event){
        setgradientType(event.target.value);

        if (event.target.value != "none"){
            console.log(event.target.value);
            setshowGradient(true);

        }else{
            setshowGradient(false);
            bgctxRef.current.fillStyle = backgroundColor.hex
            bgctxRef.current.fillRect(0,0,bgcanvasRef.current.width,bgcanvasRef.current.height);
        }
    };

    function gradientEffects(){
        
        if (gradientType == "conicgradient"){
        
            let conicgradient = bgctxRef.current.createConicGradient(0,bgcanvasRef.current.width/2,bgcanvasRef.current.height/2);
            conicgradient.addColorStop(0,backgroundColor.hex)
            gradientColorPalette.forEach((colors) => {
                conicgradient.addColorStop(colors.gvalue,colors.gcolor.hex)
            })
            bgctxRef.current.fillStyle = conicgradient;
            bgctxRef.current.fillRect(0,0,bgcanvasRef.current.width,bgcanvasRef.current.height);
        
        }
        else if (gradientType === "radialgradient"){
            diagonal = Math.sqrt(Math.pow(bgcanvasRef.current.width/2,2) + Math.pow(bgcanvasRef.current.height/2,2));
            let radialgradient = bgctxRef.current.createRadialGradient(bgcanvasRef.current.width/2,bgcanvasRef.current.height/2,10,bgcanvasRef.current.width/2,bgcanvasRef.current.height/2,diagonal);
            radialgradient.addColorStop(0,backgroundColor.hex)
            
            gradientColorPalette.forEach((colors) => {
                radialgradient.addColorStop(colors.gvalue,colors.gcolor.hex)
            })
            bgctxRef.current.fillStyle = radialgradient;
            bgctxRef.current.fillRect(0,0,bgcanvasRef.current.width,bgcanvasRef.current.height);
        }
        else if (gradientType === "verticalgradient"){
            let horizontalgradient = bgctxRef.current.createLinearGradient(0,0,0,bgcanvasRef.current.height);
            horizontalgradient.addColorStop(0,backgroundColor.hex)
            
            gradientColorPalette.forEach((colors) => {
                horizontalgradient.addColorStop(colors.gvalue,colors.gcolor.hex)
            })
            bgctxRef.current.fillStyle = horizontalgradient;
            bgctxRef.current.fillRect(0,0,bgcanvasRef.current.width,bgcanvasRef.current.height);
        }
        else if (gradientType === "horizontalgradient"){
            let verticalgradient = bgctxRef.current.createLinearGradient(0,0,bgcanvasRef.current.width,0);
            verticalgradient.addColorStop(0,backgroundColor.hex)
            
            gradientColorPalette.forEach((colors) => {
                verticalgradient.addColorStop(colors.gvalue,colors.gcolor.hex)
            })
            bgctxRef.current.fillStyle = verticalgradient;
            bgctxRef.current.fillRect(0,0,bgcanvasRef.current.width,bgcanvasRef.current.height);
        }
    }

    function Preview(){
        if (showPreview){
            console.log("called")
            prevctxRef.current.fillStyle = "black";
            // prevctxRef.current.globalAlpha = 0.5;
            prevctxRef.current.fillRect(0,0,canvasRef.current.width,canvasRef.current.height)
            prevctxRef.current.globalCompositeOperation = "xor";
            prevctxRef.current.fillStyle = "white";
            // prevctxRef.current.globalAlpha = 1;
            prevctxRef.current.beginPath();
            prevctxRef.current.arc(canvasRef.current.width/2,canvasRef.current.height/2,canvasRef.current.width/2,0,Math.PI*2)
            prevctxRef.current.fill();
            prevctxRef.current.globalCompositeOperation = "source-over";
        }else{
            drawDimensions(imgAngle.current,1)
        }
    }

    useEffect(()=>{
        console.log(gradientColorPalette);
        gradientEffects()
    },[gradientColorPalette,backgroundColor,gradientType])

    useEffect(()=>{
        resizeImage(getScalefactor(0,0));
        checkBoxClicked()
    },[borderColor,showborderOptions])

    useEffect(()=>{
        drawDimensions(imgAngle.current,1);
        // Preview();
    },[showDimensions])

    useEffect(() => {
        Preview()
    },[showPreview])

    function downloadImage(){
        if (!showGradient){
            bgctxRef.current.fillStyle = backgroundColor.hex;
            bgctxRef.current.roundRect(0,0,bgcanvasRef.current.width,bgcanvasRef.current.height,10);
            bgctxRef.current.fill();
        }
        console.log("downloading")
        
        downloadctxRef.current = downloadcanvasRef.current.getContext("2d");
        downloadctxRef.current.drawImage(bgcanvasRef.current,0,0);
        downloadctxRef.current.drawImage(bdcanvasRef.current,0,0);
        console.log("showDimensions",showDimensions)

        downloadctxRef.current.drawImage(canvasRef.current,0,0);
        
        
        // console.log(downloadcanvasRef.current);
        // bgctxRef.current.clearRect(0,0,bgcanvasRef.current.width,bgcanvasRef.current.height);

        var currentdate = new Date();
        var datetime = currentdate.getDate() + "/" + currentdate.getTime();
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.download = `faceclipper${datetime}.png`;
        a.href = downloadcanvasRef.current.toDataURL();
        a.click();
        document.body.removeChild(a);

    }


    function loading(){
        let image = new Image();
        image.src = LoadingImage;
        let imageWidth = image.naturalWidth
        let imageHeight = image.naturalHeight
        let angle = 0
        let rectWidth = 800;
        image.onload = function(){
            imageWidth = image.naturalWidth
            imageHeight = image.naturalHeight
            bgctxRef.current.translate(bgcanvasRef.current.width/2,bgcanvasRef.current.height/2)
            bgctxRef.current.rotate(angle*Math.PI/180)
            bgctxRef.current.drawImage(image,-imageWidth/2,-imageHeight/2,imageWidth,imageHeight);

            bgctxRef.current.globalCompositeOperation = "xor"
            bgctxRef.current.fillStyle = "#008080"
            bgctxRef.current.fillRect(-rectWidth/2,0,rectWidth,rectWidth)

            bgctxRef.current.globalCompositeOperation = "source-over"


            bgctxRef.current.globalCompositeOperation = "source-atop"
            bgctxRef.current.fillRect(-rectWidth/2,-rectWidth,rectWidth,rectWidth)

            bgctxRef.current.globalCompositeOperation = "source-over"
            bgctxRef.current.translate(-bgcanvasRef.current.width/2,-bgcanvasRef.current.height/2)
            bgctxRef.current.rotate(-angle*Math.PI/180)
            
        }
        let startTime = Date.now()
        let currentTime = startTime
        function animate(){
            // let imgWidth = image.naturalWidth
            // let imgHeight = image.naturalHeight
            currentTime = Date.now()
            if ((currentTime - startTime) > 100) {
                angle += 1
                if (angle > 359){
                    angle = 0   
                }
                bgctxRef.current.clearRect(0,0,bgcanvasRef.current.width,bgcanvasRef.current.height)
                bgctxRef.current.translate(bgcanvasRef.current.width/2,bgcanvasRef.current.height/2)
                bgctxRef.current.drawImage(image,-imageWidth/2,-imageHeight/2,imageWidth,imageHeight);
                bgctxRef.current.rotate(angle*Math.PI/180)
    
                bgctxRef.current.globalCompositeOperation = "xor"
                bgctxRef.current.fillStyle = "#008080"
                bgctxRef.current.fillRect(-rectWidth/2,0,rectWidth,rectWidth)
    
                bgctxRef.current.globalCompositeOperation = "source-over"
    
    
                bgctxRef.current.globalCompositeOperation = "source-atop"
                bgctxRef.current.fillRect(-rectWidth/2,-rectWidth,rectWidth,rectWidth)
    
                bgctxRef.current.globalCompositeOperation = "source-over"
                bgctxRef.current.rotate(-angle*Math.PI/180)
                bgctxRef.current.translate(-bgcanvasRef.current.width/2,-bgcanvasRef.current.height/2)
                startTime = currentTime

            }
            const requestId = window.requestAnimationFrame((t) => animate(t))
            loadingRequestId.current = requestId;
            
            
            
        }
        return window.requestAnimationFrame(animate)
    }
    useEffect(() => {
        if (imageLoading) {
            const requestId = loading();
            loadingRequestId.current = requestId;
        }
        else {
            if (loadingRequestId) {
                window.cancelAnimationFrame(loadingRequestId.current);
                loadingRequestId.current = null;
                bgctxRef.current.clearRect(0,0,bgcanvasRef.current.width, bgcanvasRef.current.height)
                
            }
        }
    }, [imageLoading])

    return(
        <>
            <div className="flex gap-x-8 flex-row ">
                <div className="max-w-[496px]">
                    <div 
                        
                        className="relative p-2 rounded-[10px] bg-sea-green-100"
                    >
                        <canvas ref={bgcanvasRef} style={{"background":backgroundColor.hex}} width={480} height={480} id="background-editor-box"
                        ></canvas>
                        <canvas ref={bdcanvasRef} width={480} height={480} id="border-editor-box"></canvas>
                        <canvas ref={canvasRef} onMouseDown={mousedownHandler} onMouseUp={mouseupHandler} onMouseMove={mousemoveHandler} width={480} height={480} id="image-editor-box"></canvas>
                        <canvas ref={downloadcanvasRef} width={480} height={480} id="download-box"></canvas>
                        <canvas className="absolute top-[8px] left-[8px] bg-transparent z-[4]" ref={dimcanvasRef} width={480} height={480} id="dimension-box"></canvas>
                        <canvas className="absolute top-[8px] left-[8px] bg-transparent z-[5]" ref={previewRef} onMouseDown={mousedownHandler} onMouseUp={mouseupHandler} onMouseMove={mousemoveHandler} width={480} height={480} id="preview-box"></canvas> 
        

                        
                    </div>
                    <div className="mt-4 ml-5 flex flex-col gap-y-3" >
                        <div className="flex justify-between">
                            <button 
                                
                                className="px-6 py-3 bg-sea-green-100 font-bold text-white hover:text-black rounded-lg hover:scale-105 transition-all duration-200
                                shadow-richblack-500/30 shadow-md hover:shadow-xl hover:shadow-richblack-600/30"
                                onClick={uploadImage} 
                                type="submit"
                            >
                                Upload Photo
                            </button>
                            {true && (
                                <button 
                                
                                    className="px-6 py-3 bg-sea-green-100 font-bold text-white hover:text-black rounded-lg hover:scale-105 transition-all duration-200
                                    shadow-richblack-500/30 shadow-md hover:shadow-xl hover:shadow-richblack-600/30"
                                    onClick={downloadImage} 
                                    type="submit" 
                                >
                                    Download
                                </button>
                            )}
                        </div>
                        {true && (
                            <>
                                <div className="flex flex-row flex-wrap gap-x-3 mt-3 gap-y-3">
                                    <div className="flex flex-row gap-x-1 items-center">
                                        <input onClick={transformationOption} type="radio" name="transformations" id="scale-radio" value="scale"
                                            className="radio-button-style"
                                        />
                                        <label htmlFor="scale-radio">Allow Scaling</label>
                                    </div>
                                    <div className="flex flex-row gap-x-1 items-center">
                                        <input onClick={transformationOption} type="radio" name="transformations" id="rotate-radio" value="rotate"
                                            className="radio-button-style"
                                        />
                                        <label htmlFor="rotate-radio">Allow Rotation</label>
                                    </div>
                                    <div className="flex flex-row gap-x-1 items-center">
                                        <input onClick={transformationOption} type="radio" name="transformations" id="translate-radio" value="translate"
                                            className="radio-button-style"
                                        />
                                        <label htmlFor="translate-radio">Allow Translation</label><br/>
                                    </div>
                                    <div className="flex gap-x-8">
                                        <div className="flex gap-x-2 items-center">
                                            <input onClick={() => setshowDimensions(!showDimensions)} type="checkbox" id="preview" 
                                                className="relative h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-richblack-100 outline-none
                                                before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0
                                                before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-sea-green-100 checked:bg-sea-green-100 checked:before:opacity-[0.16] checked:after:absolute
                                                checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] 
                                                checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] 
                                                hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] 
                                                focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem]
                                                focus:after:rounded-[0.125rem] focus:after:content[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]
                                                checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] 
                                                checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-richblack-100 dark:checked:border-sea-green-100
                                                "

                                            />
                                            <span>Show Image Dimensions</span>
                                        </div>
                                        <div width={30} height={30} className="px-3 py-1 bg-sea-green-100 font-bold text-white hover:text-black rounded-lg hover:scale-105 transition-all duration-200
                                        shadow-richblack-500/30 shadow-md hover:shadow-xl hover:shadow-richblack-600/30 cursor-pointer" onMouseEnter={() => setshowPreview(true)} onMouseLeave={() => setshowPreview(false)}>Preview</div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-y-4 mt-2">
                                    <div className="space-x-1 flex flex-row items-center">
                                        <input ref={imageBorderRef} onClick={checkBoxClicked} type="checkbox" id="image-border" value="image-border"
                                            className="relative h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-richblack-100 outline-none
                                            before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0
                                            before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-sea-green-100 checked:bg-sea-green-100 checked:before:opacity-[0.16] checked:after:absolute
                                            checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] 
                                            checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] 
                                            hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] 
                                            focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem]
                                            focus:after:rounded-[0.125rem] focus:after:content[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]
                                            checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] 
                                            checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-richblack-100 dark:checked:border-sea-green-100
                                            "
                                        />
                                        <span>Image Border</span>
                                        {showborderOptions && <input ref={widthsliderRef} onChange={sliderValue} type="range" id="border-width" min="0" max="30" defaultValue={borderWidth.current}/>}

                                    </div>
                                    {showborderOptions &&
                                        <div className="flex flex-col ml-6 gap-y-3">
                                            <div className="flex flex-row gap-x-2 items-center">
                                                <label htmlFor="bdcolor-rect" className="font-semibold">Border Color : </label>
                                                <div id="bdcolor-rect" className="h-7 w-7 border rounded-md cursor-pointer" style={{"background-color":borderColor.hex}} onClick={() => setshowborderPicker(!showborderPicker)}
                                                ></div>
                                            </div>
                                            <div className="w-[300px]">
                                                {showborderPicker && <ColorPicker color={borderColor} height={150} onChange={bgColor => setborderColor(bgColor)} hideInput={["rgb","hex","hsv"]} hideAlpha/>}
                                            </div>
                                        </div>
                                    }
                                </div>
                            </>

                        )}
                        
                    </div>
                </div>
                { true && (
                    <div className="mt-5 flex flex-col gap-y-3">
                        <button
                            onClick={() => {
                                showMenu === "filter" 
                                ? setShowMenu("")
                                : setShowMenu("filter")
                            }}
                            className="px-6 py-3 bg-sea-green-100 font-bold text-white hover:text-black rounded-lg hover:scale-105 transition-all duration-200
                            shadow-richblack-500/30 shadow-md hover:shadow-xl hover:shadow-richblack-600/30"
                        >
                            Filters
                        </button>
                        <button
                            onClick={() => {
                                showMenu === "bgColor" 
                                ? setShowMenu("")
                                : setShowMenu("bgColor")
                            }}
                            className="px-6 py-3 bg-sea-green-100 font-bold text-white hover:text-black rounded-lg hover:scale-105 transition-all duration-200
                            shadow-richblack-500/30 shadow-md hover:shadow-xl hover:shadow-richblack-600/30"
                        >
                            Background color
                        </button>
                    </div>
                )}
                <div 
                    className={`flex flex-col gap-y-3 fixed left-0 top-[20%] bg-[#ffffff] z-[100]
                    ${showMenu === "filter" ? "w-[350px] py-4 px-5 rounded-tr-md rounded-br-md shadow-[10px_15px_30px_0px]" : "w-0 overflow-x-hidden"} transition-all duration-300 `}
                >
                    <div className="flex flex-col">
                        <label htmlFor="cut-in" className="text-lg">cutIn</label>
                        <input onChange={removewhiteBd} type="range" id="cut-in" min="0" max="20" defaultValue="0"/>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="blur">Blur</label>
                        <input onChange={removewhiteBd} type="range" id="blur" min="0" max="10" defaultValue="0" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="contrast">Contrast</label>
                        <input onChange={removewhiteBd} type="range" id="contrast" min="0" max="100" defaultValue="50" />
                    </div>
                    <div className="flex flex-col ">
                        <label htmlFor="contrast">Brightness</label>
                        <input onChange={removewhiteBd} type="range" id="brightness" min="0" max="100" defaultValue="50" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="contrast">Saturation</label>
                        <input onChange={removewhiteBd} type="range" id="saturation" min="0" max="100" defaultValue="50" />
                    </div>
                    <div className="flex flex-col ">
                        <label htmlFor="contrast">Hue</label>                            
                        <input onChange={removewhiteBd} type="range" id="hue" min="0" max="180" defaultValue="0" />
                    </div>
                    <div className="flex flex-col ">
                        <label htmlFor="contrast">Sepia</label>
                        <input onChange={removewhiteBd} type="range" id="sepia" min="0" max="100" defaultValue="0" />
                    </div>
                    <div className="flex flex-col ">
                        <label htmlFor="contrast">Grayscale</label>
                        <input onChange={removewhiteBd} type="range" id="grayscale" min="0" max="100" defaultValue="0" />
                    </div>


                </div>
                    
                <div 
                    className={`fixed left-0 top-[20%] bg-[#fff] z-[100] overflow-y-auto
                    ${showMenu === "bgColor" ? "w-[350px] max-h-[500px] py-4 px-5 rounded-tr-md rounded-br-md shadow-[10px_15px_30px_0px]" : "w-0 overflow-x-hidden"} transition-all duration-300`}
                >


                    <div className="flex gap-x-2 items-center">
                        <label className="text-richblack-900 text-lg font-semibold">Background Color : </label>
                        <div 
                            className="w-8 h-8 rounded-md border-sea-green-100 border-2 cursor-pointer" 
                            style={{backgroundColor:backgroundColor.hex}} 
                            onClick={() => setshowColorPicker(!showColorPicker)}
                        >
                        </div>
                    </div>
                    {showColorPicker && (
                        <div className="mt-4">
                            <ColorPicker 
                                color={backgroundColor} 
                                onChange={bgColor => setBackgroundColor(bgColor)}  
                                hideInput={["rgb","hex","hsv"]} 
                                hideAlpha/>
                        </div>
                    )}

                    <div className="flex flex-col mt-6">
                        <label htmlFor="gradient" className="text-lg font-semibold">Add Gradient: </label>
                        <select onChange={applyGradient} id="gradient" name="gradient" 
                            className="max-w-[200px] relative px-3 py-2 rounded-md border  transition-all duration-300"
                            
                        >
                            <option value="none" defaultChecked>None</option>
                            <option value="horizontalgradient" className="py-10">Horizontal Gradient</option>
                            <option value="verticalgradient">Vertical Gradient</option>
                            <option value="radialgradient">Radial Gradient</option>
                            <option value="conicgradient">Conic Gradient</option>
                        </select>
                    </div>
                    <div className="gcolor space-y-4 my-4">
                        

                        {showGradient && gradientColorPalette.map((color,index) => {
                            return(
                                <div  key={index} >
                                    
                                    <div className="flex gap-x-2 items-center w-full">
                                        <div>
                                            <div id="gcolor-option" className="border h-7 w-7 rounded-md cursor-pointer" style={{"background-color":color.gcolor.hex}} onClick={(event)=>{
                                                
                                                const newArray = gradientColorPalette.map((data, i) => (
                                                    i !== index ? {gcolor: data.gcolor, clicked: false, gvalue:data.gvalue} : {gcolor: data.gcolor, clicked: !data.clicked, gvalue:data.gvalue}
                                                ))
                                                
                                                setGradientColorPalette(newArray);
                                                setgradColor(color.gcolor);
                                                // gradientEffects();
                                            }
                                                
                                            }/>
                                        </div>
                                        <div>
                                            <input type="range" key={index} min={0} max={100} defaultValue={50} onChange={(event)=>{
                                                const newArray = gradientColorPalette.map((data,i) => (
                                                    i === index ? {gcolor: data.gcolor, clicked:data.clicked, gvalue: parseInt(event.target.value)/100} : data
                                                ))
                                                setGradientColorPalette(newArray);
                                            }} className="w-[150px]"></input>
                                        </div>
                                        <div className="text-lg">
                                            {(Math.round(color.gvalue * 100) / 100).toFixed(2)}
                                        </div>
                                        <div>
                                            <MdCancel onClick={() => {
                                                const newArray = gradientColorPalette.filter((data,i) => 
                                                    i !== index    
                                                )
                                                setGradientColorPalette(newArray);
                                                // gradientEffects();
                                            }} fill="#87F87C"  className="w-6 h-6 ml-4 object-cover hover:scale-110 cursor-pointer"/>
                                            
                                        </div>
                                    </div>
                                    {color.clicked &&(
                                        <div className="color-picker mt-4 w-[300px]">
                                            <ColorPicker  color={gradColor} height={150} onChange={bgColor => {
                                            setgradColor(bgColor);
                                            const newArray = gradientColorPalette.map((data, i) => (
                                                i === index ? {gcolor: bgColor, clicked: data.clicked, gvalue:data.gvalue} : data
                                            ))
                                            
                                            setGradientColorPalette(newArray);
                                            // gradientEffects();
                                        } } hideInput={["rgb","hex","hsv"]} hideAlpha/>
                                        </div>
                                    )
                                    }
                                   
                                </div>

                            )
                            
                        })}
                    </div>

                    <div>
                        {showGradient && 
                            <button
                                className="px-5 py-3 mb-4 bg-sea-green-100 font-bold text-white hover:text-black rounded-lg hover:scale-105 transition-all duration-200
                                shadow-richblack-500/30 shadow-md hover:shadow-xl hover:shadow-richblack-600/30"
                                onClick={() => {
                                    const newArray = gradientColorPalette.map((color) => (
                                        {gcolor: color.gcolor, clicked: false, gvalue:color.gvalue}
                                    ))
                                    setGradientColorPalette(newArray);
                                    // {hex: "#FFFFFF", rgb:{r: 255, g: 255, b: 255, a: 255}, hsv: {h: 0, s: 0, v: 100, a: 255}}
                                    
                                    setGradientColorPalette(oldArray => 
                                        [...oldArray, {gcolor: gradColor, clicked: false, gvalue:0.5}]
                                    );
                                    // gradientEffects();
                                    
                                }}
                            >
                            Add Color
                            </button>
                        }
                    </div>




                    
                </div>
            
            </div>
        
        </>
        
    )
}