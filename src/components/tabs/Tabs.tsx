import { TabItem } from "./TabItem.tsx";
import "./Tabs.css";

interface TabsProps {
  tabs: string[];
  currentTabIndex: number;
  onTabChange: (tab: number) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, currentTabIndex, onTabChange }) => {
  const isLoading = false;

  const tabNodes = tabs.map((tab) => {
    const tabIndex = tabs.indexOf(tab);
    return (
      <TabItem
        selected={tabIndex === currentTabIndex}
        disabled={isLoading}
        onClick={() => {
          onTabChange(tabIndex);
        }}
      >
        {tab}
      </TabItem>
    );
  });

  return <div className="tab-container">{tabNodes}</div>;
};

export { Tabs };
