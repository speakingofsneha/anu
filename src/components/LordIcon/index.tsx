// Importing the defineElement function from the lord-icon-element library
import { defineElement } from "lord-icon-element";

// Importing the lottie module from lottie-web library
import lottie from "lottie-web";

// Defining the custom element for LordIcon using lottie's loadAnimation function
defineElement(lottie.loadAnimation);

// Type definition for the different triggers that can be used with LordIcon
export type LordIconTrigger =
  | "hover"
  | "click"
  | "loop"
  | "loop-on-hover"
  | "morph"
  | "morph-two-way";

// Type definition for the colors that can be applied to LordIcon
export type LordIconColors = {
  primary?: string; // Primary color
  secondary?: string; // Secondary color
};

// Type definition for the props accepted by LordIcon component
export type LordIconProps = {
  src?: string; // Source of the LordIcon animation
  trigger?: LordIconTrigger; // Trigger type for the animation
  colors?: LordIconColors; // Colors for the animation
  delay?: number; // Delay before animation starts
  size?: number; // Size of the LordIcon
};

// LordIcon functional component
const LordIcon = ({
  colors, // Colors for the animation
  src, // Source of the LordIcon animation
  size, // Size of the LordIcon
  trigger, // Trigger type for the animation
  delay, // Delay before animation starts
}: LordIconProps) => (
  // Rendering the <lord-icon> custom element with specified attributes and styles
  <lord-icon
    colors={`primary:${colors?.primary},secondary:${colors?.secondary}`} // Setting primary and secondary colors
    delay={delay} // Setting animation delay
    src={src} // Setting animation source
    style={{
      width: size, // Setting width of the LordIcon
      height: size, // Setting height of the LordIcon
    }}
    trigger={trigger} // Setting trigger type for the animation
  />
);

// Exporting the LordIcon component as default
export default LordIcon;
