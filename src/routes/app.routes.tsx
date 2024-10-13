import Layout from "@layouts/app.layout"; // Importing the main layout component

import List from "@pages/[slug]"; // Importing the List component

import { Routes, Route, Navigate } from "react-router-dom"; // Importing necessary components from react-router-dom

// Function component defining the routes of the application
function AppRoutes() {
  return (
    <Routes> {/* Root component for defining routes */}
      <Route path="/" element={<Layout />}> {/* Route for the root path */}
        <Route path="/" element={<List />} /> {/* Nested route for the root path */}
        <Route path="/:slug" element={<List />} /> {/* Nested route for dynamic paths */}
      </Route>
      <Route path="*" element={<Navigate to="/" />} /> {/* Fallback route for any other paths */}
    </Routes>
  );
}

export default AppRoutes; // Exporting the component defining application routes
