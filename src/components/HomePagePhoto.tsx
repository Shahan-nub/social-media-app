"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { IPhoto } from "../../models/Photo";
import PhotoCard from "./PhotoCard";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const urlEndPoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

export const HomePagePhotos = () => {
  const [photos, setPhotos] = useState<IPhoto[]>([]);

  const getPhotos = async () => {
    try {
      const photosRes = await axios.get("/api/photos");
      setPhotos(photosRes.data);
    } catch (error) {
      console.log("Error while fetching photos: ", error);
    }
  };

  useEffect(() => {
    getPhotos();
  }, []);

  const activeUserEmail = useSelector((state: RootState) => state.user.email);

  return (
    <div className="w-full flex flex-col justify-between gap-4">
      {photos.map((photo,idx) => {
        // console.log(photo);
        return (
          <PhotoCard
            key={idx}
            photo={photo}
            activeUserEmail={activeUserEmail}
            urlEndPoint={urlEndPoint}
          ></PhotoCard>
        );
      })}
    </div>
  );
};
