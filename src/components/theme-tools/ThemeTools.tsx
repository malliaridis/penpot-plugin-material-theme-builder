import "./ThemeTools.css";
import { ToolSelector } from "../tool-selector/ToolSelector.tsx";
import React, { useState } from "react";
import { Tool } from "../../model/Tool.ts";

const ThemeTools: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<Tool>("configure");

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
      </div>
    </div>
  );
};

export { ThemeTools };
