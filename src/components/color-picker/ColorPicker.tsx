import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./ColorPicker.css";
import { getValidSourceColor } from "../../utils/color-utils.ts";

/**
 * Color picker properties that are used during initialization.
 */
interface ColorPickerProps {
  /**
   *  The initial color to use.
   */
  color?: string;

  /**
   * Whether the input field is disabled.
   */
  disabled: boolean;
}

/**
 * Color picker reference that can be used to retrieve the color value stored.
 */
interface ColorPickerRef {
  getColor: () => string;
  setColor: (color: string) => void;
}

const ColorPicker = forwardRef<ColorPickerRef, ColorPickerProps>(
  (props, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [color, setColor] = useState(
      getValidSourceColor(props.color) ?? "#673AB7",
    );
    const [inputColor, setInputColor] = useState(color);

    useImperativeHandle(ref, () => ({
      getColor: () => color,
      setColor: (color: string) => {
        setInputColor(color);
        setColor(color);
      },
    }));

    const updateColor = (color: string) => {
      setColor(color);
      setInputColor(color);
    };

    useEffect(() => {
      const inputElement = inputRef.current;

      if (inputElement) {
        const handleBlur = () => {
          const validatedColor = getValidSourceColor(inputColor);

          if (validatedColor) updateColor(validatedColor);
          else setInputColor(color);
        };

        inputElement.addEventListener("blur", handleBlur);

        // Cleanup function to remove the event listener
        return () => {
          inputElement.removeEventListener("blur", handleBlur);
        };
      }
    }, [color, inputColor]);

    return (
      <div className="form-group">
        <label
          className="input-label body-m"
          htmlFor="input-source-color-value"
        >
          Source Color
        </label>
        <div
          id="source-color-input"
          className="input color-input"
          aria-disabled={props.disabled}
        >
          <input
            type="color"
            ref={inputRef}
            className="color-picker"
            id="input-source-color-block"
            value={color}
            onChange={(e) => {
              updateColor(e.target.value);
            }}
            disabled={props.disabled}
          />
          <input
            type="text"
            ref={inputRef}
            className="input color-input-text"
            id="input-source-color-value"
            value={inputColor}
            onChange={(e) => {
              setInputColor(e.target.value);
            }}
            disabled={props.disabled}
          />
        </div>
      </div>
    );
  },
);

export default ColorPicker;
export type { ColorPickerProps, ColorPickerRef };
