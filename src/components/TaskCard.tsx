import React from "react";
import { Task } from "../type/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
interface Props {
  task: Task;
}
const TaskCard = ({ task }: Props) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
    //   disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-600 my-2 p-2.5 h-[50px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500"
      >
       
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      key={task.id}
      {...attributes}
      {...listeners}
      className="bg-slate-600 my-2 p-2.5 h-[50px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500"
    >
      {task.content}
    </div>
  );
};

export default TaskCard;
