import * as React from "react";
import { BlogTabsProps, TabProps } from "@/types";
import { TABS } from "@/lib/data";

/**
 * Tab Component
 * @description Represents an individual tab in the tab list.
 *
 * Props:
 * - `label` (string): The text to display for the tab.
 * - `isActive` (boolean): Indicates if the tab is currently active.
 * - `onClick` (function): Function to execute when the tab is clicked.
 *
 * Accessibility:
 * - `aria-selected`: Indicates if the tab is selected.
 * - `aria-controls`: Links the tab to its associated content panel.
 */
const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`self-stretch px-7 py-1 my-auto rounded-md w-[108px] transition-colors
      ${
        isActive
          ? "text-white bg-blue-900 shadow"
          : "text-neutral-500 hover:bg-neutral-300"
      }
      focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2`}
    role="tab"
    aria-selected={isActive}
    aria-controls={`${label.toLowerCase()}-panel`}
  >
    {label}
  </button>
);

/**
 * BlogTabs Component
 * @description Displays a list of tabs for filtering blog posts by category.
 *
 * Props:
 * - `activeTab` (string): The currently selected tab.
 * - `onTabChange` (function): Function to handle tab selection changes.
 *
 * Accessibility:
 * - `role="tablist"`: Indicates that the navigation element is a list of tabs.
 * - `aria-label`: Provides a label for the tab list for screen readers.
 *
 * Features:
 * - Dynamically generates tabs based on the `TABS` data.
 * - Highlights the active tab and handles interactions via `onTabChange`.
 */
export const BlogTabs: React.FC<BlogTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav
      className="flex items-center self-start p-0.5 text-sm leading-snug text-center whitespace-nowrap rounded-lg bg-neutral-200"
      role="tablist"
      aria-label="Blog categories"
    >
      {TABS.map((tab) => (
        <Tab
          key={tab}
          label={tab}
          isActive={activeTab === tab}
          onClick={() => onTabChange(tab)}
        />
      ))}
    </nav>
  );
};
