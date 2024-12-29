import { useState } from "react";
import { ChevronDown, ChevronUp, Edit, Plus } from "react-feather";
import "./ThemeSelector.css";
import { PluginTheme } from "../../model/material.ts";

interface ThemeSelectorProps {
  /**
   * Theme names / identifiers to use in the selection.
   */
  themes: PluginTheme[];

  /**
   * Whether an undefined option should be displayed for creating a new theme.
   */
  allowNewTheme: boolean;

  /**
   * The pre-selected theme.
   */
  currentTheme: string | undefined;

  /**
   * Callback function for when the theme changes.
   *
   * @param themeName The theme name / identifier that was selected. Value is
   * undefined if no theme is selected, that is, when the user wants to create
   * a new theme, for example.
   */
  onThemeChanged: (themeName: string | undefined) => void;

  /**
   * Whether the theme selector should be disabled.
   */
  disabled: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  allowNewTheme,
  currentTheme,
  onThemeChanged,
  disabled,
}: ThemeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onThemeChange = (theme: string | undefined) => {
    onThemeChanged(theme);
    setIsOpen(false);
  };

  const themeOptions: (string | undefined)[] = [];
  if (allowNewTheme) {
    themeOptions.push(undefined, ...themes.map((theme) => theme.name));
  } else {
    themeOptions.push(...themes.map((theme) => theme.name));
  }

  return (
    <div className="form-group">
      <span className="input-label body-m">Theme</span>
      <div
        tabIndex={0}
        className={isOpen ? "select select-active" : "select"}
        onClick={() => {
          setIsOpen(!disabled && !isOpen);
        }}
        aria-disabled={disabled}
      >
        <div className="selected-option">
          {currentTheme ? (
            <Edit className="option-icon-small" />
          ) : (
            <Plus className="option-icon" />
          )}
          <span className="option-label">
            {currentTheme ? currentTheme : "Create New Theme"}
          </span>
          {isOpen ? (
            <ChevronUp className="option-icon" />
          ) : (
            <ChevronDown className="option-icon" />
          )}
        </div>
        {isOpen && (
          <div className="options">
            {themeOptions.map((option) => (
              <div
                key={option}
                className="option"
                onClick={(event) => {
                  event.stopPropagation();
                  onThemeChange(option);
                }}
              >
                {option ? option : "Create New Theme"}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { ThemeSelector };
