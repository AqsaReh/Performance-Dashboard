// ImageCropper.tsx
"use client";

import React, { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";

interface ImageCropperProps {
  onCropComplete: (croppedImage: Blob) => void;
  trigger: React.ReactNode;
  aspect?: number;
  title?: string;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ 
  onCropComplete, 
  trigger, 
  aspect = 1, 
  title = "Crop Image" 
}) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
    aspect: aspect, // Add aspect to the crop object
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => setImage(img);
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = (): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const scaleX = image!.naturalWidth / image!.width;
      const scaleY = image!.naturalHeight / image!.height;
      const pixelRatio = window.devicePixelRatio;

      canvas.width = completedCrop!.width * pixelRatio;
      canvas.height = completedCrop!.height * pixelRatio;

      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image!,
        completedCrop!.x * scaleX,
        completedCrop!.y * scaleY,
        completedCrop!.width * scaleX,
        completedCrop!.height * scaleY,
        0,
        0,
        completedCrop!.width,
        completedCrop!.height
      );

      canvas.toBlob(resolve as BlobCallback, "image/jpeg", 0.9);
    });
  };

  const handleCropComplete = async () => {
    if (completedCrop && image) {
      try {
        const croppedImage = await getCroppedImg();
        onCropComplete(croppedImage);
        setOpen(false);
        setImage(null);
        setCrop({ 
          unit: "%", 
          width: 90, 
          height: 90, 
          x: 5, 
          y: 5,
          aspect: aspect 
        });
        setCompletedCrop(null);
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          {!image ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Icon icon="heroicons:photo" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Select an image to crop</p>
              <Button onClick={() => fileInputRef.current?.click()}>
                Choose Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                className="max-h-96"
              >
                <img
                  ref={imageRef}
                  alt="Crop me"
                  src={image.src}
                  style={{ maxHeight: "400px" }}
                  onLoad={() => {
                    if (imageRef.current) {
                      setImage(imageRef.current);
                    }
                  }}
                />
              </ReactCrop>
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setImage(null);
                    setCrop({ 
                      unit: "%", 
                      width: 90, 
                      height: 90, 
                      x: 5, 
                      y: 5,
                      aspect: aspect 
                    });
                    setCompletedCrop(null);
                  }}
                >
                  Choose Different Image
                </Button>
                <Button
                  onClick={handleCropComplete}
                  disabled={!completedCrop}
                >
                  Crop Image
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;