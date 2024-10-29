import React, { useState, useEffect } from "react";

const DEFAULT_IMAGE = "https://raw.githubusercontent.com/wonhyo-e/botc-translations/refs/heads/main/assets/images/blood_on_the_clocktower.png";

const ScriptImage = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    if (imgSrc !== DEFAULT_IMAGE) {
      setImgSrc(DEFAULT_IMAGE);
    }
  };

  useEffect(() => {
    setImgSrc(src);
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
