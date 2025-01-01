import "./ThemeTools.css";
import { ToolSelector } from "../tool-selector/ToolSelector.tsx";
import React, { useState } from "react";
import { Tool } from "../../model/Tool.ts";
import { ConfigureThemeForm } from "./ConfigureThemeForm.tsx";
import { SwapValuesForm } from "./SwapValuesForm.tsx";

const ThemeTools: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<Tool>("configure");

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
    case "configure": {
      return <ConfigureThemeForm />;
    }
    case "swap": {
      return <SwapValuesForm />;
    }
  }
}
export { ThemeTools };
