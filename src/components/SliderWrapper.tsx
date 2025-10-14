// SliderWrapper.tsx (Server Component)
import Slider from "./Slider";
import { images } from "@/constants";

function getRandomNumber() {
  return Math.floor(Math.random() * 41) - 20;
}

export default function SliderWrapper({ images }: { images: string[] }) {
  const initialRotations = (images ?? []).map(() => getRandomNumber());
  return <Slider initialRotations={initialRotations} images={images ?? []} />;
}
