"use client";

import React, { useState } from "react";
import { Table, type TableProps, message } from "antd";
import { DragOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

export interface DragSortItem {
  id: number;
  sortOrder: number;
}

export interface DragSortTableProps<T extends DragSortItem>
  extends Omit<TableProps<T>, "components"> {
  /** 数据源 */
  dataSource: T[];
  /** 拖拽排序回调 */
  onSort: (newOrder: T[]) => void | Promise<void>;
  /** 自定义列定义 */
  columns: ColumnsType<T>;
}

/**
 * 可复用的拖拽排序表格组件
 * 使用 @hello-pangea/dnd (react-beautiful-dnd 的 React 19 兼容 fork)
 */
export function DragSortTable<T extends DragSortItem>({
  dataSource,
  onSort,
  columns,
  ...tableProps
}: DragSortTableProps<T>) {
  const [data, setData] = useState<T[]>(dataSource);

  // Sync with external data source changes
  React.useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex === destIndex) {
      return;
    }

    // Create new sorted array
    const newData = [...data];
    const [removed] = newData.splice(sourceIndex, 1);
    newData.splice(destIndex, 0, removed);

    // Recalculate sortOrder
    const updatedData = newData.map((item, index) => ({
      ...item,
      sortOrder: index,
    }));

    setData(updatedData);

    try {
      await onSort(updatedData);
      message.success("排序已更新");
    } catch (error) {
      message.error("排序更新失败");
      // Revert on error
      setData(dataSource);
    }
  };

  // Add drag handle column
  const columnsWithDrag: ColumnsType<T> = [
    {
      title: "",
      key: "drag-handle",
      width: 50,
      align: "center",
      onHeaderCell: () => ({
        style: { cursor: "default" },
      }),
      render: (_, record, index) => (
        <span
          className="drag-handle cursor-grab active:cursor-grabbing text-duralux-text-muted hover:text-duralux-text-primary transition-colors flex items-center justify-center"
          style={{ touchAction: "none" }}
        >
          <DragOutlined />
        </span>
      ),
    },
    ...columns,
  ];

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="table-rows" direction="vertical">
        {(provided) => (
          <Table<T>
            {...tableProps}
            dataSource={data}
            columns={columnsWithDrag}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              ...tableProps.pagination,
            }}
            className={`dark:bg-duralux-bg-dark-card rounded-lg overflow-hidden ${tableProps.className || ""}`}
            components={{
              body: {
                row: (rowProps: any) => {
                  const record = rowProps["data-row-key"];
                  const index = data.findIndex((item) => item.id.toString() === record);
                  return (
                    <Draggable
                      key={record}
                      draggableId={record}
                      index={index}
                      disableInteractiveElementBoundaries
                    >
                      {(draggableProvided, draggableSnapshot) => (
                        <tr
                          {...rowProps}
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                          style={{
                            ...rowProps.style,
                            ...draggableProvided.draggableProps.style,
                            background: draggableSnapshot.isDragging
                              ? "rgba(99, 102, 241, 0.1)"
                              : undefined,
                          }}
                          className={`${rowProps.className || ""} ${
                            draggableSnapshot.isDragging ? "dragging-row" : ""
                          }`}
                        />
                      )}
                    </Draggable>
                  );
                },
              },
            }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          />
        )}
      </Droppable>
    </DragDropContext>
  );
}
