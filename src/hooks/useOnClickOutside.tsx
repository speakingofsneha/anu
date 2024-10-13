import React, { useEffect } from "react";

// Custom hook to detect clicks or touches outside a specified element
function useOnClickOutside(
  ref: React.RefObject<HTMLElement>, // Ref object referring to the target element
  handler: (e: MouseEvent | TouchEvent) => void // Function to call when a click or touch event occurs outside the element
) {
  useEffect(() => {
    // Function to handle click or touch events
    const listener = (e: MouseEvent | TouchEvent) => {
      // Check if the target element exists and if the clicked or touched element is inside it
      if (!ref.current || ref.current.contains(e.target as Node)) {
        return; // If so, do nothing
      }
      // If the clicked or touched element is outside the target element, call the provided handler function
      handler(e);
    };

    // Add event listeners for mouse down and touch start events
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    // Cleanup function to remove event listeners when the component unmounts or the dependency changes
    return () => {
      document.removeEventListener("mousedown", listener); // Remove mouse down event listener
      document.removeEventListener("touchstart", listener); // Remove touch start event listener
    };
  }, [ref, handler]); // Dependencies for the useEffect hook
}

export default useOnClickOutside; 
