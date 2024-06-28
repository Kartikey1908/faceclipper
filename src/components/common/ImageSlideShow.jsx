import React from 'react'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-cube';
import { FreeMode, Pagination, Navigation,Autoplay, EffectFade, EffectCube } from 'swiper/modules'
import { Swiper,SwiperSlide } from 'swiper/react'

const ImageSlideShow = ({images}) => {
  return (
    <div className='h-full'>
        <Swiper
            slidesPerView={1}
            loop={true}
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            modules={[Autoplay,EffectFade, EffectCube, Navigation, Pagination]}
            navigation={{
                enabled: true,
                hideOnClick:true,
                
                
            }}
            pagination={{
                clickable: true,
              }}
            effect='fade'
            className=' w-[480px] mySwiper'
            
        >
            {
                images.map((image, index) => (
                    <SwiperSlide key={index} className='flex items-center justify-center'>
                        <img src={image} alt="image" className='h-full object-cover' draggable={false} />
                    </SwiperSlide>
                ))
            }
        </Swiper>
    </div>
  )
}

export default ImageSlideShow