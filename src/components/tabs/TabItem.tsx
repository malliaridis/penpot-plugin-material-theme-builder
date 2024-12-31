import "./TabItem.css";

interface TabItemProps {
  children: React.ReactNode;
  onClick: () => void;
  selected: boolean;
  disabled: boolean;
}

const TabItem: React.FC<TabItemProps> = ({
  children,
  onClick,
  selected,
  disabled,
}) => {
  return (
    <button
      role="tab"
      type="button"
      data-appearance={selected ? "primary" : "secondary"}
      className="tab-item"
      aria-selected={selected}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export { TabItem };
