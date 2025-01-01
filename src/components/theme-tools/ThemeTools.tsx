import "./ThemeTools.css";
import { ToolSelector } from "../tool-selector/ToolSelector.tsx";
import React, { useState } from "react";
import { Tool } from "../../model/Tool.ts";
import { ConfigureThemeForm } from "./ConfigureThemeForm.tsx";
import { SwapValuesForm } from "./SwapValuesForm.tsx";

const ThemeTools: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<Tool>("swap-variant");

  const form = getToolForm(currentTool);

  return (
    <div className="content">
      <p className="body-m">
        Tools that allow you to make bulk changes in your files and assets.
      </p>
      <div className="column-16">
        <ToolSelector
          currentTool={currentTool}
          onToolChanged={setCurrentTool}
          disabled={false}
        />
        {form}
      </div>
    </div>
  );
};

function getToolForm(currentTool: Tool) {
  switch (currentTool) {
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
}
export { ThemeTools };
