import { useEffect, useState } from 'react'
import bmr from '@assets/images/bad_moon_rising.png'
import defaultImage from '@assets/images/blood_on_the_clocktower.png'
import snv from '@/assets/images/sects_and_violets.png'
import tb from '@/assets/images/trouble_brewing.png'

interface ImageMap {
  [key: string]: string
}

const imageMap: ImageMap = {
  tb,
  bmr,
  snv,
}

interface ScriptImageProps {
  src: string
  alt: string
}

function ScriptImage({ src, alt }: ScriptImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(imageMap[src] || src || defaultImage)

  const handleError = (): void => {
    if (imgSrc !== defaultImage) {
      setImgSrc(defaultImage)
    }
  }

  useEffect(() => {
    setImgSrc(imageMap[src] || src || defaultImage)
  }, [src])

  return <img src={imgSrc} alt={alt} onError={handleError} className="w-24 h-24 sm:w-32 sm:h-32 object-contain" />
}

export default ScriptImage
