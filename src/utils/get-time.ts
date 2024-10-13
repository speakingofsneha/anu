// Function to get the time of day
const getTime = (): string => {
  const date = new Date(); // Get the current date and time
  const hours = date.getHours(); // Get the current hour

  // Check the current hour and return the corresponding time of day
  if (hours >= 22 || hours < 5) { // If it's between 10 PM and 5 AM
    return "night"; // Return "night"
  } else if (hours < 12) { // If it's before noon
    return "morning"; // Return "morning"
  } else if (hours < 18) { // If it's before 6 PM
    return "afternoon"; // Return "afternoon"
  } else { // If it's after 6 PM and before 10 PM
    return "evening"; // Return "evening"
  }
};

export default getTime; // Export the getTime function
