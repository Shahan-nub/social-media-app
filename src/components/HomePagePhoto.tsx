"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Image } from "@imagekit/next";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { IPhoto } from "../../models/Photo";
import CaptionWithToggle from "./CaptionWithToggel";

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

  return (
    <div className="w-full flex lg:flex-wrap max-lg:flex-col justify-between gap-4">
      {photos.map((photo) => {
        // console.log(photo);
        const name = photo.email?.split("@")[0];
        const dateString = photo.createdAt!;
        const date = new Date(dateString);

        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return (
          <Card
            key={photo.createdAt?.toString()}
            className="w-full max-w-sm gap-3 lg:basis-[23%] justify-between"
          >
            <CardHeader className="">
              <CardTitle>@ {name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                id="PhotoContainer"
                className="rounded-xl object-contain max-w-sm flex items-center overflow-hidden "
              >
                <Image
                  urlEndpoint={urlEndPoint} // New prop
                  src={photo.photoUrl}
                  width={600}
                  height={600}
                  alt="Picture of the author"
                  transformation={[{ width: 600, height: 600 }]}
                />
              </div>
              <div className="flex items-center text-xs lg:text-sm mt-3">
                <p className="font-medium">Title: &nbsp;</p>
                {photo.title}
              </div>
              <CaptionWithToggle
                description={photo.description}
              ></CaptionWithToggle>
            </CardContent>
            <CardFooter>
              <div className="md:text-sm text-xs text-gray-400">
                {formattedDate}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
