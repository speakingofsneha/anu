import { cloneElement } from "react"; // Importing cloneElement function from React
import _ from "lodash"; // Importing lodash library 

// Declaring Props interface extending standard HTML button attributes
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactElement;
  size?: "sm";
}

// Button component function taking Props interface as argument
function Button(props: Props) {
  const { icon, size } = props; // Destructuring props into icon and size

  // Function to determine size classes based on size prop
  const handleSize = () => {
    switch (size) {
      case "sm":
        return "h-6 w-6"; // Small size classes
      default:
        return "h-8 w-8"; // Default size classes
    }
  };

   // Returning JSX for button element
  return (
    <button
      {..._.omit(props, ["icon", "size"])}
      className={`grid ${handleSize()} flex-shrink-0 cursor-default place-items-center rounded-lg bg-black/5 transition-all hover:bg-black/10 disabled:opacity-50`}
    >
      {icon && cloneElement(icon)}
    </button>
  );
}

export default Button; // Export Button component
