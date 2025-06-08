import PhotoHero from "@/components/hero/PhotoHero";
import { HomePagePhotos } from "@/components/HomePagePhoto"

const page = () => {
  return (
    <main className="flex flex-col w-full min-h-full items-center justify-center ">
          <PhotoHero></PhotoHero>
          <HomePagePhotos></HomePagePhotos>
    </main>
  )
}
export default page;