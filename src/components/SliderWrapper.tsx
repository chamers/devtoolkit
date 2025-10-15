// SliderWrapper.tsx (Server Component)
import Slider from "./Slider";
function getRandomNumber() {
  return Math.floor(Math.random() * 41) - 20;
}
export default function SliderWrapper(
  props: { images?: string[]; descriptions?: string[] } = {}
) {
  const { images = [], descriptions = [] } = props;
  const initialRotations = images.map(() => getRandomNumber());
  return (
    <Slider
      initialRotations={initialRotations}
      images={images}
      descriptions={descriptions}
    />
  );
}
