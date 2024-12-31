import { Repeat, Sliders } from "react-feather";
import "./ToolSelector.css";
import { Selector } from "../selector/Selector.tsx";
import { Tool, tools } from "../../model/Tool.ts";

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
          case "configure":
            return "Configure Theme";
          case "swap":
            return "Swap Themes";
        }
      }}
      itemToIcon={(tool) => {
        switch (tool) {
          case "configure":
            return <Sliders className="option-icon" />;
          case "swap":
            return <Repeat className="option-icon" />;
        }
      }}
      disabled={disabled}
    />
  );
};

export { ToolSelector };
