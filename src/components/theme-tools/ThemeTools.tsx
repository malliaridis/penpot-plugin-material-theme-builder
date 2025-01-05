import "./ThemeTools.css";
import { ToolSelector } from "../tool-selector/ToolSelector.tsx";
import React, { FC, useState } from "react";
import { Tool } from "../../model/Tool.ts";
import { ConfigureThemeForm } from "./ConfigureThemeForm.tsx";
import { SwapValuesForm } from "./SwapValuesForm.tsx";

const ThemeTools: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<Tool>("swap-variant");

  return (
    <div className="content">
      <div className="column-16">
        <div>
          <ToolSelector
            currentTool={currentTool}
            onToolChanged={setCurrentTool}
            disabled={false}
          />
        </div>
        <ToolInfo tool={currentTool} />
        <ToolForm tool={currentTool} />
      </div>
    </div>
  );
};

interface ToolProps {
  tool: Tool;
}

const ToolForm: FC<ToolProps> = ({ tool }) => {
  switch (tool) {
    case "swap-variant": {
      return <ConfigureThemeForm />;
    }
    case "change-theme": {
      return <SwapValuesForm />;
    }
    case "replace-theme": {
      return <div>Placeholder</div>;
    }
  }
};

const ToolInfo: FC<ToolProps> = ({ tool }) => {
  switch (tool) {
    case "swap-variant": {
      return (
        <p className="body-s no-margin">
          Tool that swaps the color values of a page or selection with colors of
          the same theme.
        </p>
      );
    }
    case "change-theme": {
      return (
        <p className="body-s no-margin">
          Tool that swaps the color values of a page or selection with color
          values of another theme.
        </p>
      );
    }
    case "replace-theme": {
      return (
        <p className="body-s no-margin">
          Tool that updates the color values of a local theme with the values of
          another theme.
        </p>
      );
    }
  }
};

export { ThemeTools };
