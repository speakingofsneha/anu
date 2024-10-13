/* Refs used: 
https://www.npmjs.com/package/react-calendar 
https://blog.logrocket.com/react-calendar-tutorial-build-customize-calendar/ */ 

import { useEffect, useRef } from "react"; // Importing useEffect and useRef hooks from React

// Importing the ReactCalendar component from the react-calendar library
import ReactCalendar from "react-calendar";

import "./index.scss"; // Importing SCSS styles for the component

// Defining the Props interface for the Calendar component
interface Props {
  onChange: (date: Date) => void; // onChange prop is a function that takes a Date parameter and returns void
}

// Calendar component that renders a ReactCalendar
// Positioned absolute to the top right corner of its container
function Calendar({ onChange }: Props) {
  // Effect to adjust the position of the calendar based on its location in the viewport
  useEffect(() => {
    if (!calendarRef.current) return; // If calendarRef is not initialized, exit the effect

    // Get the position of the calendar element
    const position = calendarRef.current.getBoundingClientRect();
    
    // Get the dimensions of the viewport
    const viewport = { height: window.innerHeight, width: window.innerWidth };

    // Check if the calendar is positioned below the viewport's center
    if (position.y > viewport.height / 2) {
      // If so, adjust the calendar position to be above the input field
      calendarRef.current.style.top = "auto";
      calendarRef.current.style.bottom = "calc(32px + 8px * 2)"; // 32px is the height of the input field, 8px is for padding
    }
  }, []); // Run this effect only once after the initial render

  // Reference to the calendar element
  const calendarRef = useRef<HTMLDivElement>(null);

  // Render the calendar component
  return (
    <div ref={calendarRef} className="absolute right-0 top-[calc(100%+8px)]">
      <ReactCalendar
        locale="en-US" // Set the locale to "en-US"
        // Customize the navigation label to display only the abbreviated month and year
        navigationLabel={({ label }) =>
          label.split(" ")[0].slice(0, 3) + " " + label.split(" ")[1]
        }
        onClickDay={onChange} // Callback function for when a day is clicked
      />
    </div>
  );
}

export default Calendar; // Export Calendar component
