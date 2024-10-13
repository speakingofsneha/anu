import { useEffect, useLayoutEffect, useState } from 'react';

// Interface to define the shape of the window size
interface Props {
  width: number; // Width of the window
  height: number; // Height of the window
}

// Custom hook to track the size of the window
function useWindowSize(): Props {
  // State to hold the window size
  const [windowSize, setWindowSize] = useState<Props>({
    width: 0,
    height: 0,
  });

  // Function to update the window size state
  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  // Determine whether to use useLayoutEffect or useEffect based on the environment (client-side or server-side rendering)
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  // Effect to update window size when the window is resized
  useIsomorphicLayoutEffect(() => {
    // Add event listener for window resize
    window.addEventListener('resize', handleSize);
    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener('resize', handleSize);
  }, []); // Dependencies array is empty, so this effect only runs once after initial render

  // Return the current window size
  return windowSize;
}

export default useWindowSize; 
