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

const SIZE_REDUCTION_FACTOR = 1;
const QUALITY_REDUCTION_FACTOR = 1;

export const useCanvasImage = (
    reductionFactor = SIZE_REDUCTION_FACTOR,
    qualityReductionFactor = QUALITY_REDUCTION_FACTOR,
    exportAsBlob = true
) => {
    const getImage = async (
        imageSrc,
        pixelCrop = null,
        rotation = 0,
        scaling = null,
    ) => {
        try {
            const image = await createImage(imageSrc);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!pixelCrop) {
                pixelCrop = {
                    width: image.width,
                    height: image.height,
                    x: 0,
                    y: 0,
                };
            }
            console.log("Pixel Crop is : ", pixelCrop, rotation);
            if (!scaling) {
                scaling = {
                    x: 3,
                    y: 3,
                }
            }

            // const safeArea = Math.max(image.width, image.height);
            const safeArea = Math.sqrt(Math.pow(image.width, 2) + Math.pow(image.height, 2));
            
            console.log("Image width", image.width);
            console.log("Image height", image.height);

            console.log("Safe Area", safeArea);


            canvas.width = safeArea;
            canvas.height = safeArea;
            // canvas.width = pixelCrop.width;
            // canvas.height = pixelCrop.height;

            ctx.translate(
                (safeArea / 2),
                (safeArea / 2)
            );
            ctx.rotate(getRadianAngle(rotation));
            ctx.translate(
                -(image.width / 2),
                -(image.height / 2)
            );    
            // ctx.scale(scaling.x, scaling.y);      
            ctx.drawImage(
                image,
               0, 0
            );

            // ctx.drawImage(image,
            //     pixelCrop.x, pixelCrop.y, pixelCrop.width * Math.cos(getRadianAngle(rotation)), pixelCrop.height * Math.cos(getRadianAngle(rotation)),
            //     0, 0, safeArea, safeArea
            // )

            // const data = ctx.getImageData(0, 0, safeArea, safeArea);

            
            // // // ctx.fillStyle = "blue"
            // // // ctx.fill(0, 0, safeArea, safeArea);

            // canvas.width = pixelCrop.width;
            // canvas.height = pixelCrop.height;

            // ctx.putImageData(
            //     data,
            //     (0 - safeArea + image.width - pixelCrop.x)  ,
            //     (0 - safeArea + image.height - pixelCrop.y) 
            // );
            ctx.fillStyle = "#FFA500";
            ctx.strokeStyle = "#FFA500";
            ctx.beginPath();
            ctx.arc(0, 0, 70, 0, 2 * Math.PI)
            ctx.fill();

            // ctx.beginPath();
            // ctx.moveTo(0, 0);
            // ctx.lineTo(-(safeArea * Math.sqrt(2) * Math.cos(Math.PI / 4 - getRadianAngle(rotation))), -(safeArea * Math.sqrt(2) * Math.sin(Math.PI / 4 - Math.abs(getRadianAngle(rotation)))))
            // ctx.stroke();

            const processedImage = await exportFromCanvas(
                canvas,
                qualityReductionFactor,
                exportAsBlob
            );
            return processedImage;
        } catch (error) {
            console.log("Error occured", error);
        }
    }

    return { getImage };
}