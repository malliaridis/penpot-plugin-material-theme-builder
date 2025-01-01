import { Edit, Plus } from "react-feather";
import "./ThemeSelector.css";
import { PluginTheme } from "../../model/material.ts";
import { Selector } from "../selector/Selector.tsx";

interface ThemeSelectorProps {
  /**
   * Theme names / identifiers to use in the selection.
   */
  themes: (PluginTheme | undefined)[];

  /**
   * Whether an undefined option should be displayed for creating a new theme.
   */
  allowNewTheme: boolean;

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
  themes,
  allowNewTheme,
  currentTheme,
  onThemeChanged,
  disabled,
}: ThemeSelectorProps) => {
  const themeOptions: (PluginTheme | undefined)[] = [...themes];
  if (allowNewTheme) themeOptions.unshift(undefined);

  return (
    <Selector
      label="Theme"
      items={themeOptions}
      currentItem={currentTheme}
      onItemChanged={onThemeChanged}
      itemToString={(theme) => theme?.name ?? "Create New Theme"}
      itemToIcon={(theme) =>
        theme ? (
          <Edit className="option-icon-small" />
        ) : (
          <Plus className="option-icon" />
        )
      }
      disabled={disabled}
    />
  );
};

export { ThemeSelector };
