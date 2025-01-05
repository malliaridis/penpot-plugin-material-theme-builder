import { Edit3, Repeat, Sliders } from "react-feather";
import "./ToolSelector.css";
import { Selector } from "../selector/Selector.tsx";
import { Tool, tools } from "../../model/Tool.ts";
import React from "react";

interface ToolSelectorProps {
  /**
   * The pre-selected tool.
   */
  currentTool: Tool;

  /**
   * Callback function for when the tool changes.
   *
   * @param tool The tool that was selected.
   */
  onToolChanged: (tool: Tool) => void;

  /**
   * Whether the tool selector should be disabled.
   */
  disabled: boolean;
}

const ToolSelector: React.FC<ToolSelectorProps> = ({
  currentTool,
  onToolChanged,
  disabled,
}: ToolSelectorProps) => {
  return (
    <Selector
      label="Tool"
      items={tools}
      currentItem={currentTool}
      onItemChanged={onToolChanged}
      itemToString={(tool) => {
        switch (tool) {
          case "swap-variant":
            return "Restyle Shapes";
          case "change-theme":
            return "Change Theme";
          case "replace-theme": {
            return "Replace Theme Values";
          }
        }
      }}
      itemToIcon={(tool) => {
        switch (tool) {
          case "swap-variant":
            return <Sliders className="option-icon" />;
          case "change-theme":
            return <Repeat className="option-icon" />;
          case "replace-theme":
            return <Edit3 className="option-icon" />;
        }
      }}
      disabled={disabled}
    />
  );
};

export { ToolSelector };
