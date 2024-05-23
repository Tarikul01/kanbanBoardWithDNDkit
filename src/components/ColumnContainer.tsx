import React, { useMemo, useState } from "react";
import { Column, Id, Task } from "../type/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlusIcons from "../Icons/PlusIcons";
import TaskCard from "./TaskCard";
interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (id: Id) => void;
  tasks: Task[];
}
const ColumnContainer = (props: Props) => {
  const { column, deleteColumn, updateColumn, createTask, tasks } = props;
  const [editMode, setEditMode] = useState(false);
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: column.id,
      data: { type: "Column", column },
      disabled: editMode,
    });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  // console.log("TASksssss",tasks,tasksIds)

  return (
    <div
      ref={setNodeRef}
      style={style}
      key={column.id}
      className="w-[350px] h-[500px] rounded-md flex flex-col bg-blue-300"
    >
      <div
        onClick={() => {
          setEditMode(true);
        }}
        {...attributes}
        {...listeners}
        className="text-md  h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-4 bg-slate-400 flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div className="flex justify-center items-center px-2 py-1 text-sm rounded-full">
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => {
                updateColumn(column.id, e.target.value);
              }}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button onClick={() => deleteColumn(column.id)} className="delete">
          Delete
        </button>
      </div>
      <div className="flex flex-grow flex-col g">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard task={task} />
          ))}
        </SortableContext>
      </div>
      <div className="Footer">
        <button
          onClick={() => createTask(column.id)}
          className="flex gap-2 items-center border-2 rounded-md p-4  bg-gray-800 hover:text-rose-500"
        >
          <PlusIcons />
          Add task
        </button>
      </div>
    </div>
  );
};

export default ColumnContainer;
