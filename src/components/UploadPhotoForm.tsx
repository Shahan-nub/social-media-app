"use client"; // This component must be a client component

import { authenticator } from "@/lib/imagekit-authenticator";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useEffect, useRef, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Textarea } from "./ui/textarea";

const UploadPhotoForm = () => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const { status } = useSession();
  
  // console.log(session);
  // console.log(status);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const abortController = new AbortController();

  /**
   * Authenticates and retrieves the necessary upload credentials from the server.
   *
   * This function calls the authentication API endpoint to receive upload parameters like signature,
   * expire time, token, and publicKey.
   *
   * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
   * @throws {Error} Throws an error if the authentication request fails.
   */

  const validateFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    //validate title and desc
    if(title.length === 0){
      toast.error("Please enter a title before uploading.");
      return;
    }

    if(description.length === 0){
      toast.error("Please enter a description before uploading.");
      return;
    }


    // Access the file input element using the ref
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      toast.error("Please select a file to upload");
      return;
    }

    const file = fileInput.files[0];
    //validation for video
    const isPhoto = validateFile(file);

    // console.log("isPhoto: ", isPhoto);

    if (!isPhoto) {
      toast.error("Please upload an image file.");
      return;
    }

    setIsUploading(true);
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name, // Optionally set a custom file name
        // Progress callback to update upload progress state
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal,
      });
      // console.log("Upload response:", uploadResponse);

      const photoUrl = uploadResponse.url;

      console.log(photoUrl);
      // Now send to backend
      await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          photoUrl,
        }),
      });

      // console.log(res);

      if (uploadResponse.$ResponseMetadata.statusCode === 200) {
        toast.success("File uploaded successfully.");
        setTitle("");
        setDescription("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setProgress(0);
      }

      setIsUploading(false);
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
    }
  };

  return (
    <Card className="w-full max-w-sm lg:max-w-md ">
      <CardHeader>
        <CardTitle>Upload your picture</CardTitle>
        <CardAction></CardAction>
      </CardHeader>
      <CardContent className="grid w-full max-w-sm lg:max-w-md items-center gap-3">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          placeholder="enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        ></Input>

        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="enter description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></Textarea>

        <Label htmlFor="picture">File</Label>
        <Input id="picture" type="file" ref={fileInputRef} />

        <Button onClick={handleUpload} className="text-white">
          Upload
        </Button>
        <div
          className={`${isUploading ? "flex flex-col gap-2 mt-2" : "hidden"}`}
        >
          <p>Upload progress:</p>
          <Progress value={progress} max={100}></Progress>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadPhotoForm;
