// SliderWrapper.tsx (Server Component)
import Slider from "./Slider";
function getRandomNumber() {
  // Generates a random integer in the range [-20, 20]
  return Math.floor(Math.random() * 41) - 20;
}

export default function SliderWrapper(
  props: { images?: string[]; descriptions?: string[] } = {}
) {
  const { images = [], descriptions = [] } = props;

  // Note: Using Math.random() in a server component can cause hydration issues.
  // For static props like this, it is often better to generate them client-side or use a seeded random for SSR.
  // However, this will work for now with the fixes in Slider.tsx.
  const initialRotations = images.map(() => getRandomNumber());

  return (
    <Slider
      initialRotations={initialRotations}
      images={images}
      descriptions={descriptions}
    />
  );
}
