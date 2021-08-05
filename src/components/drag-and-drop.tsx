import React, { ReactNode } from "react";
import {
  Draggable,
  DraggableProps,
  Droppable,
  DroppableProps,
  DroppableProvided,
  DroppableProvidedProps,
} from "react-beautiful-dnd";

// 原DroppableProps中children属性是一个函数，这里改为普通的ReactNode
type DropProps = Omit<DroppableProps, "children"> & { children: ReactNode };

export const Drop = ({ children, ...props }: DropProps) => {
  return (
    <Droppable {...props}>
      {(provided) => {
        if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            ...provided.droppableProps,
            ref: provided.innerRef,
            provided,
          }); // 第二个参数代表给clone的children增加的props
        }
        return <div />;
      }}
    </Droppable>
  );
};
// 转发ref：通过组件向子组件自动传递 引用ref 的技术
// 主要是用于：组件给用户使用时，能够有传递ref的功能
type DropChildProps = Partial<
  { provided: DroppableProvided } & DroppableProvidedProps
> &
  React.HTMLAttributes<HTMLDivElement>; //就是用于作为Drop的child，同时也可以传入普通的div

export const DropChild = React.forwardRef<HTMLDivElement, DropChildProps>( // 符合api要求
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
      {props.provided?.placeholder}
    </div>
  )
);

type DragProps = Omit<DraggableProps, "children"> & { children: ReactNode };

export const Drag = ({ children, ...props }: DragProps) => {
  return (
    <Draggable {...props}>
      {(provided) => {
        if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            ...provided.draggableProps,
            ...provided.dragHandleProps,
            ref: provided.innerRef,
          }); // 第二个参数代表给clone的children增加的props
        }
        return <div />;
      }}
    </Draggable>
  );
};
