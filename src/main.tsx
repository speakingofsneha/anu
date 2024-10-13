import ReactDOM from "react-dom/client"; // Importing ReactDOM's createRoot method

import { Provider } from "react-redux"; // Importing Provider from react-redux for Redux integration

import { HashRouter } from "react-router-dom"; // Importing HashRouter from react-router-dom for routing

import Routes from "@routes/index"; // Importing the main Routes component
import store from "@store/index"; // Importing the Redux store

import "@styles/index.css"; // Importing global CSS styles

// Rendering the application
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}> {/* Wrapping the application with the Redux Provider component to provide the store */}
    <HashRouter> {/* Wrapping the application with the HashRouter for routing */}
      <Routes /> {/* Rendering the main Routes component */}
    </HashRouter>
  </Provider>
);
