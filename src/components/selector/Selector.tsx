import { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import "./Selector.css";

interface SelectorProps<T> {
  /**
   * Label to display for the selection input field.
   */
  label: string | undefined;

  /**
   * Item names / identifiers to use in the selection.
   */
  items: readonly T[];

  /**
   * The pre-selected item.
   */
  currentItem: T;

  /**
   * Callback function for when the theme changes.
   *
   * @param item The item that was selected. Value is undefined if no item is
   * selected.
   */
  onItemChanged: (item: T) => void;

  /**
   * Mapper function for mapping an item to a string.
   *
   * @param item The item to map.
   */
  itemToString: (item: T) => string;

  /**
   * Mapper function for mapping an item to an icon.
   *
   * @param item The item to map.
   */
  itemToIcon: (item: T) => ReactNode;

  /**
   * Whether the selector should be disabled.
   */
  disabled: boolean;
}

function Selector<T>({
  label,
  items,
  currentItem,
  onItemChanged,
  itemToString,
  itemToIcon,
  disabled,
}: SelectorProps<T>): React.ReactNode {
  const [isOpen, setIsOpen] = useState(false);

  const onItemChange = (item: T) => {
    onItemChanged(item);
    setIsOpen(false);
  };

  return (
    <div className="form-group">
      <span
        className={label ? "input-label body-m" : "input-label-hidden body-m"}
      >
        {label ? label : undefined}
      </span>
      <div
        tabIndex={0}
        className={isOpen ? "select select-active" : "select"}
        onClick={() => {
          setIsOpen(!disabled && !isOpen);
        }}
        aria-disabled={disabled}
      >
        <div className="selected-option">
          {itemToIcon(currentItem)}
          <span className="option-label">{itemToString(currentItem)}</span>
          {isOpen ? (
            <ChevronUp className="option-icon" />
          ) : (
            <ChevronDown className="option-icon" />
          )}
        </div>
        {isOpen && (
          <div className="options">
            {items.map((option) => (
              <div
                key={itemToString(option)}
                className="option"
                onClick={(event) => {
                  event.stopPropagation();
                  onItemChange(option);
                }}
              >
                {itemToString(option)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { Selector };
