/* Refs used:
https://youtu.be/SJTazZUQVDE?si=2IJoWJuoUzUivP-7 
https://youtu.be/dRLYO1-dhQU?si=iuV4-5caCuP6i52m */ 

// Importing necessary modules and components
import { createRef, useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Link, useNavigate, useParams } from "react-router-dom";

// Importing custom components and hooks
import ColorPicker from "@components/ColorPicker";
import Logo from "@components/Logo";
import LordIcon from "@components/LordIcon";
import useOnClickOutside from "@hooks/useOnClickOutside";

// Importing Redux actions, selectors, and types
import { addList, removeList, reorderList,updateList } from "@store/modules/lists/actions";
import { selectLists } from "@store/modules/lists/selectors";
import { AddList, List, Task } from "@store/modules/lists/types";

// Importing icons
import { PlusIcon } from "@heroicons/react/24/outline";

// Define a default list object
const defaultList: AddList = {
  color: "#1992FA",
  name: "",
  slug: "",
};

// Define the Sidebar component
function Sidebar() {
  // Initialize necessary hooks and state variables
  const navigate = useNavigate();
  const { slug } = useParams();
  const dispatch = useDispatch();
  const lists = useSelector(selectLists);

  // State variables for managing various actions
  const [choosingColor, setChoosingColor] = useState(false);
  const [choosingColorSlug, setChoosingColorSlug] = useState<string | null>( null);
  const [addingList, setAddingList] = useState(false);
  const [addingListSlug, setAddingListSlug] = useState<string | null>(null);
  const [creatingList, setCreatingList] = useState(false);
  const [list, setList] = useState(defaultList);
  const [removingList, setRemovingList] = useState(false);
  const [removingListSlug, setRemovingListSlug] = useState<string | null>(null);
  const [renamingList, setRenamingList] = useState(false);
  const [renamingListSlug, setRenamingListSlug] = useState<string | null>(null);

  // Define refs for DOM elements
  const addListRef = useRef<HTMLDivElement>(null);
  const addListButtonRef = useRef<HTMLButtonElement>(null);
  const colorPickerButtonRef = createRef<HTMLButtonElement>();
  const addListInputRef = useRef<HTMLInputElement>(null);
  const renameListInputRef = useRef<HTMLInputElement>(null);
  const colorPickerParentRef = useRef<HTMLDivElement>(null);

  // Function to close color picker when clicked outside
  const closeColorPicker = useCallback(
    (e?: MouseEvent | TouchEvent) => {
      if (e && e.target === colorPickerButtonRef.current) return;
      setChoosingColor(false);
      setChoosingColorSlug(null);
    },
    [colorPickerButtonRef, setChoosingColor, setChoosingColorSlug]
  );

  // Function to focus on the input field for adding a list
  const focus = useCallback(() => {
    if (!addListInputRef.current) return;
    if (document.activeElement === addListInputRef.current) return;
    addListInputRef.current.focus();
  }, []);

  // Function to handle adding a new list
  const handleAddList = useCallback(() => {
    if (!list.name || lists.find((l) => l.name === list.name)) return;
    const slug = list.name.toLowerCase().replace(" ", "-");

    setAddingList(true);
    setAddingListSlug(slug);

    dispatch(
      addList({
        list: {
          ...list,
          slug,
        },
      })
    );

    setTimeout(() => {
      setAddingList(false);
      setAddingListSlug(null);
    }, 250);

    setCreatingList(false);
    setList(defaultList);

    navigate(`/${slug}`);
  }, [dispatch, list, lists, navigate]);

   // Function to handle toggling the color picker
  const handleChoosingColor = useCallback(
    (slug?: string) => {
      if (choosingColorSlug === slug || (!slug && slug !== "")) {
        setChoosingColor((choosingColor) => !choosingColor);
        setChoosingColorSlug(null);
        return;
      }
      setChoosingColor((choosingColor) => !choosingColor);
      setChoosingColorSlug(slug);
    },
    [choosingColorSlug, setChoosingColor, setChoosingColorSlug]
  );

  // Function to handle removing a list
  const handleRemoveList = useCallback(
    (list: List) => {
      if (list.slug === "") return;

      setRemovingList(true);
      setRemovingListSlug(list.slug);
      setTimeout(() => {
        dispatch(removeList({ slug: list.slug }));
        setRemovingList(false);
        setRemovingListSlug(null);

        if (list.slug === slug) navigate("/");
      }, 250);
    },
    [dispatch, navigate, slug]
  );

  // Function to handle updating a list
  const handleUpdateList = useCallback(
    (list: List) => {
      dispatch(updateList({ list }));
    },
    [dispatch]
  );

    // Function to handle renaming a list
  const handleRenameList = useCallback(
    (slug: string, name: string) => {
      dispatch(
        updateList({
          list: {
            slug,
            name,
          },
        })
      );
      setRenamingList(false);
      setRenamingListSlug(null);
    },
    [dispatch, setRenamingList, setRenamingListSlug]
  );

  // Function to handle reordering lists
  const handleReorderList = (result: DropResult) => {
    if (!list) return;
    dispatch(reorderList({ result }));
  };

  // Find the home list based on the slug
  const home = useMemo(() => lists.find((l) => l.slug === "")!, [lists]);

  // Function to check if a list is active
  const isActiveList = useCallback(
    (s: string) => (s === "" ? !slug : slug === s),
    [slug]
  );

  // Function to start creating a new list
  const startCreatingList = useCallback(() => {
    setCreatingList(true);

    setTimeout(() => {
      focus();
    });
  }, [focus]);

  // Function to start renaming a list
  const startRenamingList = useCallback(
    (slug: string) => {
      setRenamingList(true);
      setRenamingListSlug(slug);

      setTimeout(() => {
        renameListInputRef.current?.focus();
        renameListInputRef.current?.select();
      });
    },
    [setRenamingList, setRenamingListSlug, renameListInputRef]
  );

  // Close list creation when clicking outside the add list element
  useOnClickOutside(addListRef, () => {
    if (choosingColor) return;

    setCreatingList(false);
    setList(defaultList);
  }); 

  return (
     // The sidebar panel with a glassmorphic effect and a border
    <aside className="hidden h-full w-full flex-col justify-between rounded-2xl bg-glass sm:flex sm:max-w-[256px] md:max-w-[320px] lg:max-w-[384px]" style={{backdropFilter: "blur(2px)", border: "2px solid #CDC7CE" }}>
      {/* Container for the lists */}
      <div className="hide-scrollbar h-full overflow-auto sm:p-4 md:p-6 lg:p-8">
         {/* Navigation section */}
        <nav>
          {/* Drag and drop context for reordering lists */}
          <DragDropContext onDragEnd={handleReorderList}>
            {/* Droppable area for lists */}
            <Droppable droppableId="droppable-tasks">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex h-full w-full flex-col"
                >
                   {/* Render the home list */}
                  <li className="group my-1">
                    <Link
                      to={home.slug}
                      className={`flex w-full cursor-default items-center gap-4 rounded-lg px-3 py-3 transition-colors ${
                        isActiveList(home.slug) && "bg-glass"
                      } hover:bg-glass group-first:rounded-t-2xl`}
                    >
                      {/* Button to choose color for the home list */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleChoosingColor(home.slug);
                        }}
                        ref={
                          !creatingList && choosingColorSlug === ""
                            ? colorPickerButtonRef
                            : undefined
                        }
                        type="button"
                        className="relative grid aspect-square h-6 w-6 cursor-default place-items-center rounded-lg bg-transparent transition-all hover:ring-1 hover:ring-black/5"
                      >
                        {/* Display color picker when choosing color for home list */}
                        <Logo color={home.color} size={12} />
                        {choosingColor && home.slug === choosingColorSlug && (
                          <div
                            ref={
                              !creatingList && choosingColorSlug === ""
                                ? colorPickerParentRef
                                : undefined
                            }
                            className="absolute left-0 top-[calc(100%+8px)] z-10 w-64"
                          >
                            <ColorPicker
                              color={home.color}
                              changeColor={(color) => {
                                handleUpdateList({ ...home, color });
                                closeColorPicker();
                              }}
                              closeColorPicker={closeColorPicker}
                              parentRef={colorPickerParentRef}
                            />
                          </div>
                        )}
                      </button>
                      {/* Render the list name or input field for renaming */}
                      {renamingList && home.slug === renamingListSlug ? (
                        <input
                          defaultValue={home.name}
                          onBlur={(e) =>
                            handleRenameList(home.slug, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (!renameListInputRef.current) return;

                            if (e.key === "Enter") {
                              handleRenameList(
                                home.slug,
                                renameListInputRef.current.value
                              );
                            }
                          }}
                          ref={renameListInputRef}
                          type="text"
                          className="w-full truncate bg-transparent text-left text-base text-lighttxt outline-none"
                        />
                      ) : (
                        <span
                          onClick={(e) => {
                            if (e.detail !== 2) return;

                            startRenamingList(home.slug);
                          }}
                          //styles home list
                          className="min-h-[20px] w-full truncate text-left text-base text-lighttxt"
                        >
                          {home.name}
                        </span>
                      )}
                       {/* Button to remove the home list */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveList(home);
                        }}
                        className="relative aspect-square h-6 w-6 cursor-default rounded-lg bg-transparent text-base text-lighttxt/75"
                      >
                        <span className="absolute inset-0 m-auto h-3 -translate-y-px text-center font-medium">
                          {/* Display the number of tasks for the home list */}
                          {lists.map((l) => l.tasks).flat().length}
                        </span>
                      </button>
                    </Link>
                  </li>
                  {/* Render other lists */}
                  {lists
                    .filter((l) => l.slug !== "")
                    .map((l, index) => (
                      <Draggable
                        key={l.slug}
                        draggableId={l.slug}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className={`group my-1 origin-top ${
                              addingList && addingListSlug === l.slug
                                ? "animate-add-item"
                                : removingList && removingListSlug === l.slug
                                ? "animate-remove-item"
                                : removingList &&
                                  removingListSlug &&
                                  index >
                                    lists
                                      .filter((l) => l.slug !== "")
                                      .map((l) => l.slug)
                                      .indexOf(removingListSlug)
                                ? "animate-slide-lists-up"
                                : ""
                            }`}
                          >
                            <Link
                              to={l.slug}
                              className={`flex w-full cursor-default items-center gap-4 rounded-lg px-3 py-3 transition-colors ${
                                isActiveList(l.slug) && "bg-glass"
                              } hover:bg-glass group-first:rounded-t-2xl`}
                            >
                              {/* Button to choose color for the list */}
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleChoosingColor(l.slug);
                                }}
                                ref={
                                  !creatingList && choosingColorSlug === l.slug
                                    ? colorPickerButtonRef
                                    : undefined
                                }
                                type="button"
                                className="relative grid aspect-square h-6 w-6 cursor-default place-items-center rounded-lg bg-transparent transition-all hover:ring-1 hover:ring-black/5"
                              >
                                <Logo color={l.color} size={12} />
                                 {/* Display color picker when choosing color for the list */}
                                {choosingColor &&
                                  l.slug === choosingColorSlug && (
                                    <div
                                      ref={
                                        !creatingList &&
                                        choosingColorSlug === l.slug
                                          ? colorPickerParentRef
                                          : undefined
                                      }
                                      className="absolute left-0 top-[calc(100%+8px)] z-10 w-64"
                                    >
                                      <ColorPicker
                                        color={l.color}
                                        changeColor={(color) => {
                                          handleUpdateList({ ...l, color });
                                          closeColorPicker();
                                        }}
                                        closeColorPicker={closeColorPicker}
                                        parentRef={colorPickerParentRef}
                                      />
                                    </div>
                                  )}
                              </button>
                              {/* Render the list name or input field for renaming */}
                              {renamingList && l.slug === renamingListSlug ? (
                                <input
                                  defaultValue={l.name}
                                  onBlur={(e) =>
                                    handleRenameList(l.slug, e.target.value)
                                  }
                                  onKeyDown={(e) => {
                                    if (!renameListInputRef.current) return;

                                    if (e.key === "Enter") {
                                      handleRenameList(
                                        l.slug,
                                        renameListInputRef.current.value
                                      );
                                    }
                                  }}
                                  ref={renameListInputRef}
                                  type="text"
                                  className="w-full truncate bg-transparent text-left text-base text-text outline-none"
                                />
                              ) : (
                                <span
                                  onClick={(e) => {
                                    if (e.detail !== 2) return;

                                    startRenamingList(l.slug);
                                  }}
                                  className="min-h-[20px] w-full truncate text-left text-base text-lighttxt"
                                >
                                  {l.name}
                                </span>
                              )}
                              {/* Handles deleting a list, & styles it's icon */}
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemoveList(l);
                                }}
                                //styles the number of tasks for lists in the sidebar
                                className="relative aspect-square h-6 w-6 cursor-default rounded-lg text-base text-lighttxt/75"
                               >
                                <span className="absolute inset-0 m-auto h-3 -translate-y-px text-center font-medium opacity-100 transition-opacity group-hover:opacity-0">
                                  {
                                    l.tasks.filter(
                                      (task: Task) => task.list.slug === l.slug
                                    ).length
                                  }
                                </span>
                                <div className="absolute inset-0 m-auto flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                  <LordIcon
                                    src="https://cdn.lordicon.com/kfzfxczd.json"
                                    trigger="hover"
                                    colors={{ primary: "#FFFFFF" }}
                                    size={12}
                                  />
                                </div>
                              </button>
                            </Link>
                          </li>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                  <li
                   // Defines list with various dynamic classes based on state variables (addingList and removingList) to control animations.
                    className={`group my-1 ${
                      addingList
                        ? "animate-slide-lists-down"
                        : removingList
                        ? "animate-slide-lists-up"
                        : ""
                    }`}
                  >
                    <div
                      onClick={startCreatingList}
                      onKeyDown={(e) => {
                        if (!addListRef.current) return;

                        if (e.key === "Enter") {
                          handleAddList();
                        }

                        if (e.key === "Escape") {
                          setCreatingList(false);
                          setList(defaultList);
                        }
                      }}
                      ref={addListRef}
                      tabIndex={0}
                      className="flex w-full items-center gap-4 rounded-lg rounded-b-2xl px-3 transition-colors hover:bg-transparent"
                    >
                      <span className="grid aspect-square h-6 w-6 place-items-center rounded-lg bg-transparent">
                        {creatingList ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleChoosingColor();
                            }}
                            ref={
                              creatingList && choosingColorSlug === null
                                ? colorPickerButtonRef
                                : undefined
                            }
                            // Button to toggle color selection for the list, which (triggers the handleChoosingColor function.)
                            type="button"
                            className="relative z-10 grid aspect-square h-6 w-6 cursor-default place-items-center rounded-lg bg-transparent transition-all hover:ring-1 hover:ring-black/5"
                          >
                            <Logo color={list.color ?? "gray"} size={12} />
                            {choosingColor && (
                              <div
                                ref={
                                  creatingList && choosingColorSlug === null
                                    ? colorPickerParentRef
                                    : undefined
                                }
                                className="absolute left-0 top-[calc(100%+8px)] z-10 w-64"
                              >
                                <ColorPicker
                                  color={list.color}
                                  changeColor={(color) => {
                                    setList((list) => ({ ...list, color }));
                                    closeColorPicker();
                                  }}
                                  closeColorPicker={closeColorPicker}
                                  parentRef={colorPickerParentRef}
                                />
                              </div>
                            )}
                          </button>
                        ) : (
                          <PlusIcon className="w-3 stroke-2 text-foreground/50" />
                        )}
                      </span>
                      {creatingList ? (
                        // Depending on the state, it either displays an input field to enter the list name or a static text "create new list".
                        <input
                          onChange={(e) =>
                            setList((list) => ({
                              ...list,
                              name: e.target.value,
                            }))
                          }
                          placeholder="create new list"
                          ref={addListInputRef}
                          type="text"
                          value={list.name}
                          className="w-full truncate bg-transparent py-[14px] text-left text-base text-lighttxt outline-none transition-colors"
                        />
                      ) : (
                        <span className="w-full cursor-default truncate py-[14px] text-left text-base text-lighttxt"style={{ opacity: 0.5 }}>
                          create new list
                        </span>
                      )}
                      {creatingList && (
                         // Another button to create new list (triggers the handleAddList function.)
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddList();
                          }}
                          ref={addListButtonRef}
                          type="button"
                          className="relative aspect-square h-6 w-6 cursor-default rounded-lg bg-transparent text-base text-lighttxt/75"
                        >
                          <PlusIcon className="absolute inset-0 m-auto w-3 stroke-2 color--foreground" />
                        </button>
                      )}
                    </div>
                  </li>
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar; // Export Sidebar Component
