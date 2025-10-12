// SliderWrapper.tsx (Server Component)
import Slider from "./Slider";
import { images } from "@/constants";

function getRandomNumber() {
  return Math.floor(Math.random() * 41) - 20;
}

export default function SliderWrapper() {
  const initialRotations = images.map(() => getRandomNumber());
  // TODO: accept images from the resource and pass them to <Slider /> later
  return <Slider initialRotations={initialRotations} />;
}
