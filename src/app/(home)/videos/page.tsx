import VideoHero from "@/components/hero/VideoHero";
import { HomePageVideos } from "@/components/HomePageVideo";

const page = () => {
  return (
    <main className="flex flex-col w-full min-h-full items-center justify-center ">
      <VideoHero></VideoHero>
      <HomePageVideos></HomePageVideos>
    </main>
  );
};

export default page;
