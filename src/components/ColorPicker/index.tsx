import { useEffect, useRef, useState } from "react"; // Importing necessary hooks from React
import { createPortal } from "react-dom"; // Importing createPortal for rendering outside of the component tree

import Logo from "@components/Logo"; // Importing Logo component

// Importing predefined colors from Tailwind CSS
import {
  blue,
  red,
  green,
  orange,
  yellow,
  amber,
  cyan,
  gray,
} from "tailwindcss/colors";

import useOnClickOutside from "@hooks/useOnClickOutside"; // Custom hook to handle click events outside the component

// Props interface for the ColorPicker component
interface Props {
  color?: string; // Current selected color
  changeColor: (color: string) => void; // Function to change color
  closeColorPicker: (e?: MouseEvent | TouchEvent) => void; // Function to close the color picker
  parentRef: React.RefObject<HTMLDivElement>; // Reference to the parent element
}

function ColorPicker({
  color, // Current selected color
  changeColor, // Function to change color
  closeColorPicker, // Function to close the color picker
  parentRef, // Reference to the parent element
}: Props) {
  const [customColor, setCustomColor] = useState(color ?? ""); // State for custom color input

  const colorPickerRef = useRef<HTMLDivElement>(null); // Reference to the color picker element

  // Predefined colors
  const colors = [
    blue[500],
    red[500],
    green[500],
    orange[500],
    yellow[500],
    amber[500],
    cyan[500],
    gray[500],
  ];

  useEffect(() => {
    if (!colorPickerRef.current || !parentRef.current) return; // If refs are not available, exit

    colorPickerRef.current.focus(); // Focus on the color picker

    const parentRect = parentRef.current!.getBoundingClientRect(); // Get parent element's dimensions

    // Set color picker position based on parent element
    colorPickerRef.current.style.width = `${parentRect.width}px`;
    colorPickerRef.current.style.top = `${parentRect.top}px`;
    colorPickerRef.current.style.left = `${parentRect.left}px`;

    // Adjust position if color picker is below the viewport's center
    if (
      colorPickerRef.current.getBoundingClientRect().top >
      window.innerHeight / 2 + colorPickerRef.current.offsetHeight
    ) {
      colorPickerRef.current.style.transform = `translateY(-${
        colorPickerRef.current.offsetHeight + 8 + 8 + 24
      }px)`;
      return;
    }
  }, []); // Run this effect only once after the initial render

  // Close color picker when clicked outside
  useOnClickOutside(colorPickerRef, closeColorPicker);

  // Render color picker using createPortal to render outside of the component tree
  return createPortal(
    <div
      onClick={(e) => {
        e.preventDefault(); // Prevent default click behavior
        e.stopPropagation(); // Stop event propagation
      }}
      ref={colorPickerRef} // Reference to the color picker element
      className="absolute z-10 flex h-fit w-full flex-col divide-y divide-background rounded-lg bg-white p-1 ring-1 ring-background"
    >
      {/* Title */}
      <span className="w-fit p-2 text-xs text-text/50">Colors</span>

      {/* Predefined color options */}
      <ul className="flex flex-wrap gap-2 px-2 py-3">
        {colors.map((color) => (
          <span
            key={color}
            onClick={() => changeColor(color)}
            role="button"
            tabIndex={0}
            className="grid aspect-square h-8 w-8 cursor-default place-items-center rounded-lg transition-all hover:bg-black/5"
          >
            <Logo color={color} size={16} />
          </span>
        ))}
      </ul>

      {/* Custom color input */}
      <div className="flex w-full items-center gap-4 p-2">
        <span className="whitespace-nowrap text-xs text-text/50">
          Custom Color:{" "}
        </span>
        <div className="flex h-8 w-full items-center gap-2 overflow-hidden rounded-lg bg-black/5 px-3">
          <Logo color={customColor} size={12} />
          <input
            onChange={(e) => setCustomColor(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                changeColor(customColor);
              }
            }}
            placeholder="#1992FA"
            type="text"
            value={customColor}
            className="w-full truncate bg-transparent py-2 text-sm text-text outline-none"
          />
        </div>
      </div>
    </div>,
    document.body // Render in the body element
  );
}

export default ColorPicker; // Export ColorPicker component
