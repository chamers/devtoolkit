"use client";

import { HexColorInput, HexColorPicker } from "react-colorful";

interface Props {
  value: string;
  onPickerChange: (color: string) => void;
}

const ColorPicker = ({ value, onPickerChange }: Props) => {
  return (
    <div className="relative space-y-3">
      <div className="flex flex-row items-center gap-2 rounded-md border px-2 py-1">
        <span className="text-sm text-muted-foreground">#</span>
        <HexColorInput
          color={value}
          onChange={onPickerChange}
          aria-label="Hex color"
          className="h-8 flex-1 bg-transparent outline-none"
        />
      </div>
      <HexColorPicker color={value} onChange={onPickerChange} />
    </div>
  );
};

export default ColorPicker;
