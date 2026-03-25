"use client";

import React, { useRef, useCallback } from "react";
import { Table, type TableProps, message } from "antd";
import { DragOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

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
 * 使用 HTML5 原生 Drag & Drop API 实现
 */
export function DragSortTable<T extends DragSortItem>({
  dataSource,
  onSort,
  columns,
  ...tableProps
}: DragSortTableProps<T>) {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // 添加拖拽手柄列到最前面
  const columnsWithDrag: ColumnsType<T> = [
    {
      title: "",
      key: "drag-handle",
      width: 50,
      align: "center",
      onHeaderCell: () => ({
        style: { cursor: "default" },
      }),
      render: (_, record) => (
        <span
          className="drag-handle cursor-grab active:cursor-grabbing text-duralux-text-muted hover:text-duralux-text-primary transition-colors flex items-center justify-center"
          style={{ touchAction: "none" }}
          draggable
          onDragStart={(e) => {
            dragItem.current = record.id;
            e.dataTransfer.effectAllowed = "move";
            // 设置拖拽预览
            const target = e.target as HTMLElement;
            target.style.opacity = "0.5";
          }}
          onDragEnd={(e) => {
            const target = e.target as HTMLElement;
            target.style.opacity = "1";
            dragItem.current = null;
            dragOverItem.current = null;
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={async (e) => {
            e.preventDefault();
            const draggedId = dragItem.current;
            const droppedId = record.id;

            if (draggedId === null || droppedId === null || draggedId === droppedId) {
              return;
            }

            // 找到拖拽项和目标项的索引
            const dragIndex = dataSource.findIndex((item) => item.id === draggedId);
            const dropIndex = dataSource.findIndex((item) => item.id === droppedId);

            if (dragIndex === -1 || dropIndex === -1) {
              return;
            }

            // 创建新的排序数组
            const newData = [...dataSource];
            const [draggedItem] = newData.splice(dragIndex, 1);
            newData.splice(dropIndex, 0, draggedItem);

            // 重新计算 sortOrder
            const updatedData = newData.map((item, index) => ({
              ...item,
              sortOrder: index,
            }));

            try {
              await onSort(updatedData);
              message.success("排序已更新");
            } catch (error) {
              message.error("排序更新失败");
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            dragOverItem.current = record.id;
          }}
          onDragLeave={() => {
            dragOverItem.current = null;
          }}
        >
          <DragOutlined />
        </span>
      ),
    },
    ...columns,
  ];

  // 自定义行样式，添加拖拽经过的高亮效果
  const getRowClassName = (record: T) => {
    if (dragOverItem.current === record.id) {
      return "drag-over-row border-y-2 border-duralux-primary";
    }
    return "";
  };

  return (
    <Table<T>
      {...tableProps}
      dataSource={dataSource}
      columns={columnsWithDrag}
      rowKey="id"
      rowClassName={getRowClassName}
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
        ...tableProps.pagination,
      }}
      className={`dark:bg-duralux-bg-dark-card rounded-lg overflow-hidden ${tableProps.className || ""}`}
    />
  );
}
