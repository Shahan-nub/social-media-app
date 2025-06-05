"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { IVideo } from "../../models/Video";
import { Video } from "@imagekit/next";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import CaptionWithToggle from "./CaptionWithToggel";

const urlEndPoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

type Props = {};
export const HomePageVideos = (props: Props) => {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const getVideos = async () => {
    try {
      const vidoesRes = await axios.get("/api/videos");
      setVideos(vidoesRes.data);
    } catch (error) {
      console.log("Error while fetching videos: ", error);
    }
  };

  useEffect(() => {
    getVideos();
  }, []);

  return (
    <div className="w-full flex lg:flex-wrap justify-between mx-auto max-lg:flex-col gap-4">
      {videos.map((vid) => {
        // console.log(vid);
        const name = vid.email?.split("@")[0];
        const dateString = vid.createdAt!;
        const date = new Date(dateString);

        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return (
          <Card
            key={vid.createdAt?.toString()}
            className="w-full max-w-sm gap-3 lg:basis-[23%] justify-between"
          >
            <CardHeader className="">
              <CardTitle>@ {name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                id="VideoContainer"
                className="rounded-xl object-contain max-w-sm flex items-center overflow-hidden "
              >
                <Video
                  urlEndpoint={urlEndPoint}
                  src={vid.videoUrl}
                  controls={vid.controls}
                  width={vid.transformation?.width}
                  // height={vid.transformation?.height}
                  height={400}
                  transformation={
                    [{ width: 500, height: 500 }]
                  }
                />
              </div>
              <div className="flex mt-3 text-xs lg:text-sm">
                <p className="font-medium">Title: &nbsp;</p>
                {vid.title}
              </div>
              <CaptionWithToggle description={vid.description}/>
            </CardContent>
            <CardFooter className="mt-auto">
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
