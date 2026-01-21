// SliderWrapper.tsx (Server Component)
import Slider from "./slider";

function getRandomNumber() {
  return Math.floor(Math.random() * 41) - 20; // [-20, 20]
}

export default function SliderWrapper(
  props: { images?: string[]; descriptions?: string[] } = {}
) {
  const { images = [], descriptions = [] } = props;

  // ✅ No slicing anymore (images is already imgUrls)
  const initialRotations = images.map(() => getRandomNumber());

  return (
    <Slider
      initialRotations={initialRotations}
      images={images}
      descriptions={descriptions}
    />
  );
}
