"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { IVideo } from "../../models/Video";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import VideoCard from "./VideoCard";

const urlEndPoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

export const HomePageVideos = () => {
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

  const activeUserEmail = useSelector((state: RootState) => state.user.email);


  return (
    <div className="w-full flex flex-col mx-auto max-lg:flex-col gap-4">
      {videos.map((vid) => {
        return (
          <VideoCard
            key={vid._id?.toString()}
            video={vid}
            activeUserEmail={activeUserEmail}
            urlEndPoint={urlEndPoint}
          />
        );
      })}
    </div>
  );
};
