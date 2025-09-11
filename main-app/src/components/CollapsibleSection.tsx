import React, { useState } from 'react';
import { Button } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  badge?: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
  className = '',
  headerClassName = '',
  contentClassName = '',
  badge
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`border border-gray-200 rounded-md bg-white ${className}`}>
      <div 
        className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors ${headerClassName}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Button 
            type="text" 
            size="small" 
            icon={isExpanded ? <DownOutlined /> : <RightOutlined />}
            className="p-0 w-6 h-6 flex items-center justify-center"
          />
          <h4 className="font-semibold text-gray-900 m-0">{title}</h4>
          {badge && <div className="ml-2">{badge}</div>}
        </div>
      </div>
      
      {isExpanded && (
        <div className={`border-t border-gray-200 p-3 ${contentClassName}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
