import { HomePageVideos } from "@/components/HomePageVideo";

type Props = {};
const page = (props: Props) => {
  return (
    <main className="flex w-full min-h-full items-center justify-center ">
      <HomePageVideos></HomePageVideos>
    </main>
  );
};

export default page;
