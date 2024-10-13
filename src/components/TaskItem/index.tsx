import { useCallback, useRef, useState } from "react";
//importing sound effect.ref- https://pixabay.com/sound-effects/search/notification/?pagi=3 
import toggleSound from 'src/components/Assets/toggle-sound.mp3'; 

// Importing necessary hooks and components
import { useDispatch } from "react-redux";
import Button from "@components/Button";
import Calendar from "@components/Calendar";
import Checkbox from "@components/Checkbox";
import Logo from "@components/Logo";
import LordIcon from "@components/LordIcon";
import useOnClickOutside from "@hooks/useOnClickOutside";
import useWindowSize from "@hooks/useWindowSize";
import { updateTask } from "@store/modules/lists/actions";
import { Task } from "@store/modules/lists/types";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Props interface for TaskItem component
interface Props {
  adding: boolean; // Indicates if a task is being added
  addingId: string | null; // ID of the task being added
  color: string; // Color for the task logo
  removing: boolean; // Indicates if a task is being removed
  removingId: string | null; // ID of the task being removed
  removeTask: (id: string) => void; // Function to remove a task
  task: Task; // The task object
}

// TaskItem component definition
function TaskItem({ adding, addingId, color, removeTask, removing, removingId, task }: Props) {
  const dispatch = useDispatch(); // Hook to dispatch Redux actions

  // Local state for date picker and renaming task
  const [choosingDate, setChoosingDate] = useState(false);
  const [choosingDateTaskId, setChoosingDateTaskId] = useState<string | null>(null);
  const [renamingTask, setRenamingTask] = useState(false);

  // Refs for date picker and rename task text area
  const datePickerRef = useRef<HTMLDivElement>(null);
  const renameTaskTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Function to handle renaming a task
  const handleRenameTask = useCallback(
    (content: string) => {
      dispatch(
        updateTask({
          task: {
            ...task,
            content,
          },
        })
      );

      setRenamingTask(false);
    },
    [dispatch, task]
  );

  // Function to handle updating a task
  const handleUpdateTask = useCallback(
    (task: Task) => {
      dispatch(updateTask({ task }));
    },
    [dispatch]
  );

   // Function to start renaming a task
  const startRenamingTask = useCallback(
    (e: React.MouseEvent) => {
      const height = e.currentTarget.getBoundingClientRect().height;
      const width = e.currentTarget.getBoundingClientRect().width;

      setRenamingTask(true);

      setTimeout(() => {
        if (!renameTaskTextareaRef.current) {
          setRenamingTask(false);
          return;
        }

        renameTaskTextareaRef.current.focus();
        renameTaskTextareaRef.current.select();
        renameTaskTextareaRef.current.style.height = `${height}px`;
        renameTaskTextareaRef.current.style.width = `${width}px`;
      });
    },
    [setRenamingTask, renameTaskTextareaRef]
  );

  // Function to toggle task done state
  const toggleTaskDone = () => {
    if (!task.done) { // Only play sound if the task is not done 
      const audio = new Audio(toggleSound);
      audio.volume = 0.1;
      audio.play();
    }
    dispatch(updateTask({ task: { ...task, done: !task.done } }));
  };

  // Hook to handle clicks outside the date picker
  useOnClickOutside(datePickerRef, () => {
    setChoosingDate(false);
    setChoosingDateTaskId(null);
  });

  // Hook to get window size
  const { width } = useWindowSize();

  return (
    <li
      // Conditional class based on whether a task is being added or removed
      className={`${
        adding && addingId === task.id
          ? "animate-add-item"
          : removing && removingId === task.id
          ? "animate-remove-item"
          : ""
      } group pointer-events-auto flex h-auto w-full origin-top items-center gap-4 bg-white px-3 transition-all sm:px-4 ${
        task.done ? "opacity-40" : ""
      }`}
    >
      {/* Checkbox to mark the task as done */}
      <Checkbox checked={task.done} onChange={toggleTaskDone} />
      {renamingTask ? (
        <textarea
          defaultValue={task.content}
          onBlur={(e) => handleRenameTask(e.target.value)}
          onKeyDown={(e) => {
            if (!renameTaskTextareaRef.current) return;

            if (e.key === "Enter") {
              handleRenameTask(renameTaskTextareaRef.current.value);
            }
          }}
          ref={renameTaskTextareaRef}
          className="hide-scrollbar resize-none bg-transparent py-3 text-left text-base sm:text text-text outline-none sm:min-h-[52px] sm:py-4 md:min-h-[60px] md:py-5"
        />
      ) : ( // Render task content if not renaming
        <span
          onClick={(e) => {
            if (e.detail !== 2) return;

            startRenamingTask(e);
          }}
          className="min-h-[44px] w-full py-3 text-base text-text sm:min-h-[52px] sm:py-4 md:min-h-[60px] md:py-5"
        >
          {/* Render task content with Markdown support */}
          <ReactMarkdown
            allowedElements={["a", "del", "em", "p", "strong"]}
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ ...props }) => (
                <span className="group/a whitespace-nowrap">
                  <a
                    {...props}
                    className="text-primary underline group-hover/a:pr-[2px]"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                  <ArrowUpRightIcon className="translate-y inline-block w-0 -translate-x-1 stroke-2 text-primary opacity-0 transition-all group-hover/a:w-2 group-hover/a:translate-x-0 group-hover/a:opacity-100" />
                </span>
              ),
            }}
            className={`markdown w-full break-all ${
              task.done ? "pointer-events-none" : ""
            }`}
          >
            {task.done ? `~${task.content}~` : task.content}
          </ReactMarkdown>
        </span>
      )}
      {/* Area for task metadata */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="sm:block">
          <Logo color={color} size={12} />
        </div>
        {/* Display task date if available */}
        {task.date && (
          <span className="whitespace-nowrap text-xs font-medium text-text/50 sm:block">
            {new Date(task.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            {new Date(task.date).getFullYear() !== new Date().getFullYear() &&
              ` · ${new Date(task.date).getFullYear()}`}
          </span>
        )}
        <div ref={datePickerRef} className="relative sm:block">
        {/* Button to open calendar for selecting date */}
        {(width === 0 ? window.innerWidth : width) >= 768 ? (
          <Button
            icon={
              <LordIcon
                src="https://cdn.lordicon.com/qjuahhae.json"
                trigger="hover"
                colors={{ primary: "#808080" }}
                size={16}
              />
            }
            onClick={() => {
              setChoosingDateTaskId(task.id);
              setChoosingDate((choosingDate) => !choosingDate);
            }}
          />
        ) : ( // Small screen button
          <Button
            icon={
              <LordIcon
                src="https://cdn.lordicon.com/qjuahhae.json"
                trigger="hover"
                colors={{ primary: "#808080" }}
                size={12}
              />
            }
            onClick={() => {
              setChoosingDateTaskId(task.id);
              setChoosingDate((choosingDate) => !choosingDate);
            }}
            size="sm"
          />
        )}
          {/* Calendar for selecting date */}
          {choosingDate && choosingDateTaskId === task.id && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-10">
              <Calendar
                onChange={(d) => {
                  handleUpdateTask({ ...task, date: d.toISOString() });

                  setChoosingDate(false);
                  setChoosingDateTaskId(null);
                }}
              />
            </div>
          )}
        </div>
        {/* Button to remove the task */}
        {(width === 0 ? window.innerWidth : width) >= 768 ? (
          // For larger screens (width >= 768 pixels)
          <Button
            onClick={() => removeTask(task.id)}
            icon={
              <LordIcon
                src="https://cdn.lordicon.com/kfzfxczd.json"
                trigger="hover"
                colors={{ primary: "#808080" }}
                size={16}
              />
            }
          />
        ) : (
          // For smaller screens (width < 768 pixels)
          <Button
            onClick={() => removeTask(task.id)}
            icon={
              <LordIcon
                src="https://cdn.lordicon.com/kfzfxczd.json"
                trigger="hover"
                colors={{ primary: "#808080" }}
                size={12}
              />
            }
            size="sm"
          />
        )}
      </div>
    </li>
  );
}

export default TaskItem; // Export TaskItem component 