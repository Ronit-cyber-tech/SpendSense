import React from "react";
import clsx from "clsx";

export const Card: React.FC<{ className?: string; title?: string; subtitle?: string; children?: React.ReactNode }> = ({ className, title, subtitle, children }) => {
  return (
    <div className={clsx("bg-white rounded-lg shadow-sm p-4", className)}>
      {title && <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
      </div>}
      <div className="mt-2">
        {children}
      </div>
    </div>
  );
};
export default Card;