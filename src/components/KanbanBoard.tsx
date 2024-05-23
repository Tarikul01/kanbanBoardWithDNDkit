import React, { useMemo, useState } from "react";
import PlusIcons from "../Icons/PlusIcons";
import { Column, Id, Task } from "../type/types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [tasks,setTasks]=useState<Task[]>([])
  
  const sensors= useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3
      }
    })
  );

  console.log(columns);
  const createNewColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  };
  function generateId() {
    return Math.floor(Math.random() * 10001);
  }
  const deleteColumn = (id: Id) => {
    const filterColumn = columns.filter((col) => col.id !== id);
    setColumns(filterColumn);
  };
  const onDragStart = (event: DragStartEvent) => {
    console.log("Drag Event", event);
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };
  
  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null)
    const { active, over } = event;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) return;
    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };
  const onDragOver=(event:DragOverEvent)=>{
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    const isActiveTask=active.data.current?.type==="Task";
    const isOverTask=over.data.current?.type==="Task";

    // in dropping a stask over another task
    if(isActiveTask && isOverTask){
      setTasks((tasks)=>{
        const activeIndex=tasks.findIndex((t)=>t.id===activeId);
        const overIndex=tasks.findIndex((t)=> t.id===overId);

        tasks[activeIndex].columnId=tasks[overIndex].columnId
         return arrayMove(tasks,activeIndex,overIndex);
      })

    }
    const isOvercolumn=over.data.current?.type==="Column";
    //  dropping task over same column 
    if(isActiveTask && isOvercolumn){
      setTasks((tasks)=>{
        const activeIndex=tasks.findIndex((t)=>t.id===activeId);
        // const overIndex=tasks.findIndex((t)=> t.id===overId);

        tasks[activeIndex].columnId=overId;
         return arrayMove(tasks,activeIndex,activeIndex);
      })
    }
  }
  const updateColumn=(id:Id,title:string)=>{
    const newColumn=columns.map(col=>{
        if(col.id!==id){
            return col
        }
        return {...col,title}
    })
 setColumns(newColumn);
  }
  const createTask=(columnId:Id)=>{
    const newTask:Task={
      id:generateId(),
      columnId,
      content:`Task ${tasks.length+1}`
    }
setTasks([...tasks,newTask])
  }


  return (
    <>
      <div className="m-auto flex min-h-screen items-center overflow-y-hidden overflow-x-auto px-[40px]">
        <DndContext  sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
          <div className="m-auto flex gap-4">
            <div className="flex gap-4">
              <SortableContext items={columnsId}>
                {columns.map((col) => (
                  <ColumnContainer column={col} deleteColumn={deleteColumn}
                   updateColumn={updateColumn} createTask={createTask}
                   tasks={tasks.filter(task=>task.columnId===col.id)}
                   
                   />
                ))}
              </SortableContext>
            </div>
            <button
              onClick={createNewColumn}
              className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-blue-800  p-4 ring-rose-500 hover:ring-2 border-2 flex gap-2 "
            >
              <PlusIcons /> Add column
            </button>
          </div>
          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  column={activeColumn}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  tasks={tasks}
                />
              )}
              {activeTask && <TaskCard task={activeTask} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </>
  );
};

export default KanbanBoard;
