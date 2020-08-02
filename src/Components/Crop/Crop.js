import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Button from '@material-ui/core/Button';
import Done from '@material-ui/icons/Done';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { CROP } from '../../Store/Reducers/actionTypes';
import { CROP_UPDATED } from '../../Constants/Messages/info';

// return a new cropped img from user's selection
function getCroppedImg(image, crop) {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return canvas.toDataURL('image/png');
}

export default function Crop(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { id, extent, uri } = props.item;
  const lastCrop = props.item.lastCrop;
  const [crop, setCrop] = useState(lastCrop || {});
  const dispatch = useDispatch();
  const imageToCrop = useRef(null);
  let imgRef = useRef(null);

  const onImageLoaded = function (img) {
    imgRef.current = img;
  };

  // returns new extent from the crop area that the user made
  const createNewExtent = function () {
    const imgWidth = imageToCrop.current.componentRef.clientWidth;
    const imgHeight = imageToCrop.current.componentRef.clientHeight;
    const rasterWidthGeo = extent[2] - extent[0];
    const rasterHeightGeo = extent[3] - extent[1];
    const bottomLeft = [
      extent[0] + (crop.x / imgWidth) * rasterWidthGeo,
      extent[1] +
        ((imgHeight - (crop.y + crop.height)) / imgHeight) * rasterHeightGeo,
    ];
    const topRight = [
      extent[2] -
        ((imgWidth - (crop.x + crop.width)) / imgWidth) * rasterWidthGeo,
      extent[3] - (crop.y / imgHeight) * rasterHeightGeo,
    ];
    return bottomLeft.concat(topRight);
  };

  const handleCrop = function () {
    const newExtent = createNewExtent();
    const newImg = getCroppedImg(imgRef.current, crop, 'cropped');
    dispatch({
      type: CROP,
      payload: { id: id, newUri: newImg, newExtent, crop },
    });
    enqueueSnackbar(CROP_UPDATED.message, { variant: CROP_UPDATED.variant });
  };

  return (
    <div>
      <ReactCrop
        ref={imageToCrop}
        src={uri}
        crop={crop}
        crossorigin="anonymous"
        onChange={(newCrop) => setCrop(newCrop)}
        onImageLoaded={(img) => onImageLoaded(img)}
      />
      <Button
        variant="contained"
        startIcon={<Done />}
        color="primary"
        onClick={() => handleCrop()}
      >
        Crop
      </Button>
    </div>
  );
}
