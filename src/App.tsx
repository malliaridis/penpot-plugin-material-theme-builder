import "./App.css";
import { ThemeBuilder } from "./components/theme-builder/ThemeBuilder.tsx";
import { ReactNode } from "react";
import { ThemeTools } from "./components/theme-tools/ThemeTools.tsx";
import { Tabs } from "./components/tabs/Tabs.tsx";
import { useState, FC } from "react";
import Footer from "./components/footer/Footer.tsx";
import { ToastContextProvider } from "./components/toast-loader/ToastContextProvider.tsx";

const App: FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  let content: ReactNode | undefined;
  switch (currentTab) {
    case 0: {
      content = <ThemeBuilder />;
      break;
    }
    case 1: {
      content = <ThemeTools />;
      break;
    }
  }

  return (
    <ToastContextProvider>
      <div className="container">
        <Tabs
          currentTabIndex={currentTab}
          tabs={["Themes", "Tools"]}
          onTabChange={(tab) => {
            setCurrentTab(tab);
          }}
        />
        {content}
        <Footer />
      </div>
    </ToastContextProvider>
  );
};

export default App;
