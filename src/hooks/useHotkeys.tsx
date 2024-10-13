import { useCallback, useEffect } from "react";

// Interface to define the structure of each hotkey
interface HotkeyProps {
  ctrlKey?: boolean; // Optional flag for Ctrl key
  key: string; // The key associated with the hotkey
  handler: () => void; // The function to call when the hotkey is triggered
  shiftKey?: boolean; // Optional flag for Shift key
}

// Interface for the props expected by the useHotkeys hook
interface Props {
  element: HTMLElement | null; // The HTML element to which the hotkeys are attached
  hotkeys: HotkeyProps[]; // An array of hotkey configurations
}

// Custom hook for handling hotkeys
function useHotkeys({ element, hotkeys }: Props) {
  // Define a memoized callback function for handling key events
  const handler = useCallback(
    (e: KeyboardEvent) => {
      // Normalize key to lowercase for comparison
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey; // Boolean indicating if Ctrl key is pressed
      const shift = e.shiftKey; // Boolean indicating if Shift key is pressed

      // Iterate over each hotkey
      hotkeys.forEach((hotkey) => {
        // Check if the pressed key matches the hotkey's key
        if (hotkey.key.toLowerCase() !== key) return;

        // Check if Ctrl key is required and not pressed
        if (hotkey.ctrlKey && !ctrl) return;
        
        // Check if Shift key is required and not pressed
        if (hotkey.shiftKey && !shift) return;

        // Check if both Ctrl and Shift are required but not pressed together
        if (hotkey.ctrlKey && !hotkey.shiftKey && !(ctrl && !shift)) return;
        
        // Check if neither Ctrl nor Shift are required but one of them is pressed
        if (!hotkey.ctrlKey && hotkey.shiftKey && !(!ctrl && shift)) return;

        // Prevent default browser behavior if Ctrl or Shift key is used
        if (hotkey.ctrlKey || hotkey.shiftKey) {
          e.preventDefault();
        }

        // Call the handler function associated with the matched hotkey
        hotkey.handler();
      });
    },
    [hotkeys] // Dependencies for the useCallback hook
  );

  // Attach event listener when the element is available
  useEffect(() => {
    if (!element) return; // If element is null, do nothing

    element.addEventListener("keydown", handler); // Add event listener for keydown event

    // Cleanup function to remove event listener when component unmounts
    return () => {
      element.removeEventListener("keydown", handler); // Remove event listener
    };
  }, [handler, element]); // Dependencies for the useEffect hook
}

export default useHotkeys;