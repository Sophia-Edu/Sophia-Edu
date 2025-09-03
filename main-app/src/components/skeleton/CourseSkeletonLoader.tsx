import React from "react";
import { Skeleton } from "antd";

const CourseSkeletonLoader: React.FC = () => {
  return (
    <div className="flex sm:flex-row flex-col-reverse mt-[10px] gap-6 w-full">
      <div className="sm:block hidden w-[25%]">
        {[1, 2, 3].map((item) => (
          <div key={item} className="mb-4">
            <Skeleton.Button active block style={{ height: 40 }} />
            <div className="mt-2 pl-4">
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          </div>
        ))}
      </div>

      <div className="sm:w-[75%] relative main">
        <Skeleton.Image active style={{ width: "100%", height: 400 }} />
        <div className="mt-4">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </div>
    </div>
  );
};

export default CourseSkeletonLoader;