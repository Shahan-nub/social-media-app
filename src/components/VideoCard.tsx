"use client";

import { useEffect, useState } from "react";
import { IVideo } from "../../models/Video";
import { Video } from "@imagekit/next";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import CaptionWithToggle from "./CaptionWithToggel";
import axios from "axios";
import { toast } from "sonner";
import { IComment } from "../../models/Photo";

interface VideoCardProps {
  video: IVideo;
  activeUserEmail: string;
  urlEndPoint: string;
}

const VideoCard = ({
  video,
  activeUserEmail,
  urlEndPoint,
}: VideoCardProps) => {
  const [likeCount, setLikeCount] = useState(video.likeCount || 0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(video.likedBy!.includes(activeUserEmail));
  }, [video, activeUserEmail]);

  const handleLike = async () => {
    try {

      if(!activeUserEmail){
        toast.error("Login to like.")
        return;
      }

      const res = await axios.post("/api/like-video", {
        videoId: video._id?.toString(),
        activeUserEmail,
      });

      // console.log(res);

      if (res.data.message === "Liked") {
        setLikeCount((prev: number) => prev + 1);
        setIsLiked(true);
      } else {
        setLikeCount((prev: number) => prev - 1);
        setIsLiked(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to like the video.");
    }
  };

  const formattedDate = new Date(video.createdAt!).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  //fetching comments

  const [comments, setComments] = useState<IComment[]>([]);

  const getComments = async () => {
    try {
      const res = await axios.post("/api/videos/all-comments", {
        videoId: video._id?.toString(),
      });
      setComments(res.data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getComments();
  }, [video]);

  // adding new comment

  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleCommentPost = async () => {
    if (!newComment.trim()) return;

    if(!activeUserEmail){
      toast.error("Login to add a comment.");
      return;
    }

    try {
      setIsPosting(true);

      const res = await axios.post("/api/videos/new-comment", {
        videoId: video._id,
        comment: {
          email: activeUserEmail,
          text: newComment.trim(),
        },
      });

      toast.success("Comment added!");
      setComments((prev) => [...prev, res.data.video.comments.slice(-1)[0]]); // Add the last new comment
      setNewComment("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to post comment.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-[#18181b] to-transparent gap-3 justify-between py-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 lg:gap-4 text-xs lg:text-sm">
          <p className="italic">@{video.email?.split("@")[0]}</p>
          <p>&gt;</p>
          <p className="">{video.title}</p>
        </CardTitle>
        <CardAction className="flex items-center text-base gap-1">
          <button onClick={handleLike} className="cursor-pointer">
            {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          </button>
          {likeCount}
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col lg:px-9 px-7">
        <CaptionWithToggle description={video.description} />
        <div
          id="VideoContainer"
          className="rounded-xl object-contain max-w-sm flex items-center overflow-hidden "
        >
          <Video
            urlEndpoint={urlEndPoint}
            src={video.videoUrl}
            controls={video.controls}
            width={video.transformation?.width}
            height={400}
            transformation={[{ width: 500, height: 500 }]}
          />
        </div>

         <div className="md:text-sm text-xs mt-2 my-auto ml-auto text-gray-400">
          {formattedDate}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-start w-full">
        <div className="flex gap-2 items-center">
          <p>{comments.length}</p>
          <p>Comments</p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {comments.map((c, i) => (
            <div
              key={i}
              className="mt-2 text-sm text-white border-b border-gray-700 pb-2"
            >
              <div className="flex text-xs items-center gap-2">
                <p className="font-semibold">@{c.email.split("@")[0]}</p>
                <p className="text text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <p className="text-zinc-300 text-sm">{c.text}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 w-full mt-2">
          <input
            type="text"
            placeholder="Write a comment..."
            className="border px-2 py-1 rounded-md text-sm w-full"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleCommentPost}
            className="text-sm bg-black text-white px-3 py-1 rounded-md disabled:opacity-50"
            disabled={isPosting}
          >
            {isPosting ? "Posting..." : "Post"}
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
