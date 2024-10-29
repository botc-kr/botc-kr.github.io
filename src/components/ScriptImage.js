import React, { useState, useEffect } from "react";
import defaultImage from "../assets/images/blood_on_the_clocktower.png";
import tb from "../assets/images/trouble_brewing.png";
import bmr from "../assets/images/bad_moon_rising.png";
import snv from "../assets/images/sects_and_violets.png";

const imageMap = {
  tb: tb,
  bmr: bmr,
  snv: snv,
};

const ScriptImage = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(imageMap[src] || src);

  const handleError = () => {
    if (imgSrc !== defaultImage) {
      setImgSrc(defaultImage);
    }
  };

  useEffect(() => {
    setImgSrc(imageMap[src] || src);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
    />
  );
};

export default ScriptImage;
