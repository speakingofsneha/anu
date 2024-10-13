// Importing necessary dependencies and components from React and other modules
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Checkbox from "@components/Checkbox";
import Logo from "@components/Logo";
import LordIcon from "@components/LordIcon";
import useHotkeys from "@hooks/useHotkeys";
import useOnClickOutside from "@hooks/useOnClickOutside";
import { selectLists } from "@store/modules/lists/selectors";
import { Task } from "@store/modules/lists/types";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";

// Defining the default task object structure
const defaultTask = {
  content: "",
  done: false,
  list: {
    slug: "",
  },
};

// Defining the Props interface for the TaskWriter component
interface Props {
  addTask: (task: Omit<Task, "id">) => void;
}

// TaskWriter component definition
function TaskWriter({ addTask }: Props) {
  // Extracting the slug from URL parameters using useParams hook
  const { slug } = useParams();

  // Selecting lists from the Redux store
  const lists = useSelector(selectLists);

  // State variables to manage the TaskWriter component
  const [choosingList, setChoosingList] = useState(false);
  const [task, setTask] = useState<Omit<Task, "id">>(defaultTask);

  // Refs for input and list elements
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Effect to update the task list slug when the slug parameter changes
  useEffect(() => {
    setTask((task) => ({
      ...task,
      list: {
        slug: slug ?? "",
      },
    }));
  }, [slug]);

   // Function to handle adding a task
  const handleAddTask = () => {
    if (!task.content) return;

    addTask({
      content: task.content,
      done: task.done,
      list: {
        slug: task.list.slug ?? slug ?? "",
      },
    });

     // Resetting the task state
    setTask({
      ...defaultTask,
      list: {
        slug: task.list.slug ?? slug ?? "",
      },
    });
  };

  // Function to focus on the input field
  const focus = () => {
    if (!inputRef.current) return;

    if (document.activeElement === inputRef.current) return;

    inputRef.current.focus();
  };

  // Function to blur the input field and reset the task content
  const blur = () => {
    if (!inputRef.current) return;

    inputRef.current.blur();

    setTask((task) => ({
      ...task,
      content: "",
    }));
  };

  // Function to toggle the checked state of the task
  const toggleChecked = () => {
    setTask((task) => ({
      ...task,
      done: !task.done,
    }));
  };

  // Custom hook to handle hotkeys
  useHotkeys({
    element: document.body,
    hotkeys: [
      {
        ctrlKey: true,
        handler: focus,
        key: "K",
      },
    ],
  });

  // Custom hook to handle clicks outside the list element
  useOnClickOutside(listRef, () => setChoosingList(false));

  // Rendering the TaskWriter component
  return (
    <div
      onClick={focus} // When clicked, focus function is called to focus on the input field
      className="group pointer-events-auto flex w-full items-center gap-3 rounded-xl bg-white px-3 transition-colors sm:gap-4 sm:rounded-2xl sm:bg-black/5 sm:px-4 sm:focus-within:bg-foreground sm:hover:bg-black/10 sm:focus-within:hover:bg-foreground sm:active:hover:bg-foreground"
    >
      <div className="pointer-events-none hidden -translate-x-3 scale-50 opacity-0 transition-transform group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:scale-100 group-focus-within:opacity-100 group-active:pointer-events-auto group-active:translate-x-0 group-active:scale-100 group-active:opacity-100 sm:block">
        {/* Checkbox component for marking the task as done */}
        <Checkbox checked={task.done} onChange={toggleChecked} />
      </div>
      <input
        onChange={(e) =>
          setTask((task) => ({ ...task, content: e.target.value })) // Update task content when input changes
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddTask(); // When Enter key is pressed, call handleAddTask function to add the task
          }
  
          if (e.key === "Escape") {
            blur(); // When Escape key is pressed, blur the input field and reset the task content
          }
        }}
        placeholder="create new task"
        ref={inputRef}
        type="text"
        value={task.content}
        className="w-full truncate bg-transparent py-3 text-base text-text outline-none transition-transform placeholder:text-text/50 sm:-translate-x-8 sm:py-4 sm:group-focus-within:translate-x-0 sm:group-active:translate-x-0 md:py-5"
      />
      <div
        ref={listRef}
        className="pointer-events-none relative hidden opacity-0 transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-active:opacity-100 sm:block"
      >
        <button
          onClick={() => setChoosingList((choosingList) => !choosingList)} // Toggle choosingList state to show/hide list options
          type="button"
          className="h-8 cursor-default rounded-lg bg-black/5 px-3 transition-colors hover:bg-black/10"
        >
          <div className="flex items-center gap-2">
            {/* Logo component representing the selected task list */}
            <Logo
              color={lists.find((list) => list.slug === task.list.slug)?.color}
              size={12}
            />
            {/* Icon indicating list selection */}
            <LordIcon
              src="https://cdn.lordicon.com/zheynzsx.json"
              trigger="hover"
              colors={{ primary: "#808080" }}
              size={16}
            />
          </div>
        </button>
        {choosingList && (
          <ul className="absolute right-0 top-[calc(100%+12px)] z-10 flex min-w-[192px] flex-col gap-1 rounded-lg bg-glass p-1 ring-1 ring-black/5"style={{backdropFilter: "blur(15px)", border: "1px solid #CDC7CE" }}>
            {/* Display list options */}
            {lists.map((list) => (
              <li
                key={list.slug}
                className="[&>*]:first:rounded-t-lg [&>*]:last:rounded-b-lg"
              >
                <button
                  onClick={() => {
                    setTask((task) => ({ // Update selected list in task state
                      ...task,
                      list: {
                        slug: list.slug,
                      },
                    }));
  
                    setChoosingList(false); // Hide list options
                  }}
                  className={`flex w-full items-center gap-3 rounded px-3 py-2 ${
                    task.list.slug === list.slug
                      ? "bg-black/5 hover:bg-black/10"
                      : "bg-transparent hover:bg-black/5"
                  } cursor-default transition-colors`}
                >
                  {/* Display list name and icon */}
                  <Logo color={list.color} size={12} />
                  <span
                    className={`w-full pr-8 text-start text-sm ${
                      task.list.slug === list.slug
                        ? "text-lighttxt"
                        : "text-lighttxt/80"
                    }`}
                  >
                    {list.name}
                  </span>
                  {/* Display check icon if list is selected */}
                  {task.list.slug === list.slug && (
                    <CheckIcon className="w-2 flex-shrink-0 stroke-[3px] text-lighttxt" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );  
}

export default TaskWriter; // Export TaskWriter component