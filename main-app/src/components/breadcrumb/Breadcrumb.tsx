import React from 'react';
import { Breadcrumb as AntBreadcrumb } from 'antd';

interface BreadcrumbItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  // Render all items as non-clickable, while keeping dynamic structure
  const breadcrumbItems = items.map((item, index) => {
    const isLastItem = index === items.length - 1;
    return {
      title: (
        <span className={isLastItem ? "text-gray-800 font-medium" : "text-gray-600"}>
          {item.icon && <span className="mr-1">{item.icon}</span>}
          {item.title}
        </span>
      ),
    };
  });

  return (
    <AntBreadcrumb
      className={`mb-4 ${className || ''}`}
      items={breadcrumbItems}
      separator=">"
    />
  );
};

export default Breadcrumb;
