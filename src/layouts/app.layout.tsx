import { useEffect } from "react"; // Importing useEffect from React

// Importing components, store, actions, selectors, utilities, and hooks
import Sidebar from "@components/Sidebar";
import Welcome from "@components/Welcome";
import store from "@store/index";
import { loadUser } from "@store/modules/user/actions";
import { selectLists } from "@store/modules/lists/selectors";
import { selectUser } from "@store/modules/user/selectors";
import svgToDataUri from "@utils/svg-to-data-uri";
import { useDispatch, useSelector } from "react-redux";
import { ActionCreators } from "redux-undo";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useHotkeys from "@hooks/useHotkeys";

// Function component for the main app layout
function AppLayout() {
  // React Router hooks for navigation and accessing URL parameters
  const navigate = useNavigate();
  const { slug } = useParams();

  // Redux hooks for dispatching actions and selecting data from the store
  const dispatch = useDispatch();
  const lists = useSelector(selectLists);
  const user = useSelector(selectUser);

  // Effect to load user data when the component mounts or 'lists' dependency changes
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // Effect to handle changes in 'lists', 'slug', and update document title and favicon accordingly
  useEffect(() => {
    if (lists.length === 1) return;

    const list = lists.find((l) => (!slug ? l.slug === "" : l.slug === slug));

    if (!list) {
      navigate("/");
      return;
    }

    if (document.title !== `${list.name} · anu`) {
      document.title = `${list.name} · anu`;
    }

    // Generating SVG for favicon
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" fill="${
        list.color ?? "#1992FA"
        }" />
      </svg>
    `;

    // Updating favicon
    let link: HTMLLinkElement | null =
      document.querySelector("link[rel~='icon']");

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";

      document.head.appendChild(link);
    }
    link.href = svgToDataUri(svg);
  }, [lists, navigate, slug]);

  // Custom hook to handle hotkeys for undo and redo actions
  useHotkeys({
    element: document.body,
    hotkeys: [
      {
        ctrlKey: true,
        handler: () => {
          const state = store.getState();

          // Undo action when Ctrl + Z is pressed
          if (state.lists.past.length > 2) {
            dispatch(ActionCreators.undo());
          }
        },
        key: "Z",
      },
      {
        ctrlKey: true,
        key: "Z",
        shiftKey: true,
        handler: () => {
          const state = store.getState();

          // Redo action when Ctrl + Shift + Z is pressed
          if (state.lists.future.length > 0) {
            dispatch(ActionCreators.redo());
          }
        },
      },
    ],
  });

  // Render the layout
  return (
    <div className="max-w-screen relative flex h-screen w-full overflow-hidden p-6 sm:p-4 md:p-6 lg:p-8">
      {!user.username && <Welcome />} {/* Show welcome component if user is not logged in */}
      <Sidebar /> {/* Sidebar component */}
      <Outlet /> {/* Render nested routes */}
    </div>
  );
}

export default AppLayout; // Export main app layout
