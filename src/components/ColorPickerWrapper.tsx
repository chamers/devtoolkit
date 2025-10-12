"use client";

import { useState } from "react";
import ColorPicker from "@/components/ColorPicker";
import useMounted from "@/hooks/useMounted";

const ColorPickerWrapper = () => {
  const [color, setColor] = useState<string>("#6B7280"); // default gray-500
  const mounted = useMounted();
  if (!mounted) return null;
  return (
    <div className="my-6 space-y-4">
      <div className="flex items-center gap-3">
        <div
          aria-label="Selected color swatch"
          className="h-8 w-8 rounded-md border"
          style={{ backgroundColor: color }}
        />
        <code className="text-sm">{color}</code>
      </div>

      <ColorPicker value={color} onPickerChange={setColor} />
    </div>
  );
};

export default ColorPickerWrapper;
