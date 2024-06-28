import React, { useEffect, useRef, useState } from 'react'

const ClippedImage = ({faceClippedImage}) => {
  
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [ctx, setCtx] = useState(null);

  const createImage = (url) => 
    new Promise( (resolve, reject) => { 
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', error => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

    const drawImageOnCanvas = async() => {

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const image = await createImage(faceClippedImage);
      const safeArea = Math.max(image.width,image.height);

      canvas.height = safeArea;
      canvas.width = safeArea;

      ctx.fillStyle = "#FF0000";
      ctx.fillRect(0, 0, safeArea, safeArea);

      ctx.drawImage(image, 
            0, 0,
        );  
    }

    useEffect(() => {
      drawImageOnCanvas();
    }, []);

  const downloadImage = () => {
    var url = canvasRef.current.toDataURL("image/png");
    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = url;
    link.click();
  
  }

  return (
    <div>
        <div >
            <canvas ref={canvasRef}>

            </canvas>

            <button 
              className='bg-yellow-50 px-6 py-3 text-center rounded-md mt-6'
              onClick={() => downloadImage()}
            >
              Download Image
            </button>
        </div>
    </div>
  )
}

export default ClippedImage