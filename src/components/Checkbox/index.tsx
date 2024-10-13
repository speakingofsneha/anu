import { CheckIcon } from "@heroicons/react/24/outline"; // Importing the CheckIcon from the Heroicons library

// Define the Props type, extending from React's InputHTMLAttributes to include all standard input attributes
type Props = React.InputHTMLAttributes<HTMLInputElement>;

// Checkbox component definition
function Checkbox({ checked, onChange }: Props) {
  return (
    <label className="flex h-fit w-fit"> {/* Flex container to ensure the label fits its content */}
      <input
        checked={checked} // Checkbox state controlled by the `checked` prop
        onChange={onChange} // Change handler passed via the `onChange` prop
        type="checkbox" // Input type set to checkbox
        className="peer pointer-events-none w-0 appearance-none opacity-0" // Hidden input with styles to make it invisible
      />
      <div
        aria-hidden="true" // Hides the element from screen readers
        className="pointer-events-auto relative aspect-square h-5 w-5 rounded-md bg-black/5 transition-colors hover:bg-black/10 peer-checked:bg-text sm:h-6 sm:w-6 sm:rounded-lg peer-checked:[&>*]:animate-pop-up peer-checked:[&>*]:opacity-100"
      >
        {/* Styled div representing the visual part of the checkbox */}
        <CheckIcon className="absolute inset-0 m-auto w-2 animate-none stroke-[6px] text-foreground opacity-0 transition-opacity" />
        {/* Check icon positioned absolutely within the div, centered, and initially hidden */}
      </div>
    </label>
  );
}

export default Checkbox; // Export Checkbox component 