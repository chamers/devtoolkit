// SliderWrapper.tsx (Server Component)
import Slider from "./slider";

function getRandomNumber() {
  // Generates a random integer in the range [-20, 20]
  return Math.floor(Math.random() * 41) - 20;
}

export default function SliderWrapper(
  props: { images?: string[]; descriptions?: string[] } = {}
) {
  const { images = [], descriptions = [] } = props;

  // 💡 NEW CHANGE: Slice the arrays to exclude the first element (index 0)
  // The slider will now work with the content that starts from the original index 1.
  const sliderImages = images.slice(1);
  const sliderDescriptions = descriptions.slice(1);

  // Generate rotations only for the images that will be in the slider
  const initialRotations = sliderImages.map(() => getRandomNumber());

  return (
    <Slider
      initialRotations={initialRotations}
      images={sliderImages} // Pass the sliced array
      descriptions={sliderDescriptions} // Pass the sliced array
    />
  );
}
