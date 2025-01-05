import { Edit, Plus } from "react-feather";
import "./ThemeSelector.css";
import { PluginTheme } from "../../model/material.ts";
import { Selector } from "../selector/Selector.tsx";

interface ThemeSelectorProps {
  /**
   * Label to use for the form field.
   */
  label: string | undefined;
  /**
   * Theme names / identifiers to use in the selection.
   */
  themes: (PluginTheme | undefined)[];

  /**
   * Whether an undefined option should be displayed for creating a new theme.
   */
  allowNewTheme: boolean;

  /**
   * Whether to use the theme's source color as icon, or an edit / add icon.
   */
  useColorAsIcon: boolean;

  /**
   * The pre-selected theme.
   */
  currentTheme: PluginTheme | undefined;

  /**
   * Callback function for when the theme changes.
   *
   * @param themeName The theme name / identifier that was selected. Value is
   * undefined if no theme is selected, that is, when the user wants to create
   * a new theme, for example.
   */
  onThemeChanged: (themeName: PluginTheme | undefined) => void;

  /**
   * Whether the theme selector should be disabled.
   */
  disabled: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  label,
  themes,
  allowNewTheme,
  useColorAsIcon,
  currentTheme,
  onThemeChanged,
  disabled,
}: ThemeSelectorProps) => {
  const themeOptions: (PluginTheme | undefined)[] = [...themes];
  if (allowNewTheme) themeOptions.unshift(undefined);
  const placeholder = allowNewTheme ? "Create New Theme" : "Select Theme";

  return (
    <Selector
      label={label}
      items={themeOptions}
      currentItem={currentTheme}
      onItemChanged={onThemeChanged}
      itemToString={(theme) => theme?.name ?? placeholder}
      itemToIcon={(theme) =>
        theme && useColorAsIcon ? (
          <div
            className="color-icon"
            style={{ backgroundColor: theme.source.color }}
          />
        ) : theme ? (
          <Edit className="option-icon-small" />
        ) : allowNewTheme ? (
          <Plus className="option-icon" />
        ) : undefined
      }
      disabled={disabled}
    />
  );
};

export { ThemeSelector };
