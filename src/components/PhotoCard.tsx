import { Image } from "@imagekit/next";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import CaptionWithToggle from "./CaptionWithToggel";
import { IComment, IPhoto } from "../../models/Photo";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";
import { useEffect, useState } from "react";

interface PhotoCardProps {
  photo: IPhoto;
  activeUserEmail: string;
  urlEndPoint: string;
}

const PhotoCard = ({ photo, activeUserEmail, urlEndPoint }: PhotoCardProps) => {
  const [likeCount, setLikeCount] = useState(photo.likeCount || 0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(photo.likedBy!.includes(activeUserEmail));
  }, [photo, activeUserEmail]);

  const handleLike = async () => {
    try {
      if (!activeUserEmail) {
        toast.error("Login to like.");
        return;
      }
      const res = await axios.post("/api/like-photo", {
        photoId: photo._id?.toString(),
        activeUserEmail,
      });

      console.log(res);

      if (res.data.message === "Liked") {
        setLikeCount((prev: number) => prev + 1);
        setIsLiked(true);
      } else {
        setLikeCount((prev: number) => prev - 1);
        setIsLiked(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to like the photo.");
    }
  };

  const dateString = photo.createdAt!;
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  //fetching comments

  const [comments, setComments] = useState<IComment[]>([]);

  const getComments = async () => {
    try {
      const res = await axios.post("/api/photos/all-comments", {
        photoId: photo._id?.toString(),
      });
      setComments(res.data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getComments();
  }, [photo]);

  // adding new comment

  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleCommentPost = async () => {
    if (!newComment.trim()) return;

    if (!activeUserEmail) {
      toast.error("Login to add a comment.");
      return;
    }

    try {
      setIsPosting(true);

      const res = await axios.post("/api/photos/new-comment", {
        photoId: photo._id,
        comment: {
          email: activeUserEmail,
          text: newComment.trim(),
        },
      });

      toast.success("Comment added!");
      setComments((prev) => [...prev, res.data.photo.comments.slice(-1)[0]]); // Add the last new comment
      setNewComment("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to post comment.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card
      key={photo.createdAt?.toString()}
      className="w-full gap-3 justify-between"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-3 lg:gap-4 text-xs lg:text-sm">
          <p className="italic">@{photo.email?.split("@")[0]}</p>
          <p>&gt;</p>
          <p className="">{photo.title}</p>
        </CardTitle>
        <CardAction className="flex items-center text-base gap-1">
          <button onClick={handleLike} className="cursor-pointer">
            {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          </button>
          {likeCount}
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col lg:px-9 px-7">
        <CaptionWithToggle description={photo.description} />

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

export default PhotoCard;
