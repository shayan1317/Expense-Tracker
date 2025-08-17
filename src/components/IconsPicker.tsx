import { EXPENSE_ICONS, INCOME_ICONS } from "@utils/constants";
import React, { useMemo, useState } from "react";

// Predefined icons for expenses and income

const IconsPicker = ({
  type = "expense",
  selectedIcon,
  onIconSelect,
  className = "",
}: {
  type: string;
  selectedIcon: string;
  onIconSelect: (name: string) => void;
  className: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const icons = type === "expense" ? EXPENSE_ICONS : INCOME_ICONS;
  console.log("icons", icons, selectedIcon);
  const selectedIconData = useMemo(
    () =>
      Object.values(icons).find((icon) => icon.name === selectedIcon) ||
      icons[type === "income" ? "salary" : "shopping"]?.icon,
    [selectedIcon]
  );
  const iconColor = selectedIconData.color;
  const IconComponent = selectedIconData.icon;
  console.log("IconComponent", IconComponent);
  return (
    <div className={`relative ${className}`}>
      {/* Selected Icon Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        {IconComponent && (
          <IconComponent className="text-lg" style={{ color: iconColor }} />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Icon Grid */}
          <div className="absolute top-14 left-0 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Choose {type} icon:
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {Object.values(icons).map((iconData, index) => {
                const IconComponent = iconData.icon;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      onIconSelect(iconData?.name || "");
                      setIsOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                      selectedIcon === iconData.name
                        ? "bg-blue-50 border-2 border-blue-200"
                        : "border border-transparent"
                    }`}
                    title={iconData.name}
                  >
                    <IconComponent
                      className="text-xl mb-1"
                      style={{ color: iconData.color }}
                    />
                    <span className="text-xs text-gray-600 text-center">
                      {iconData.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IconsPicker;
