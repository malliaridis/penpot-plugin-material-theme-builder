import { ReactNode } from "react";
import "./ToastLoader.css";
import { X } from "react-feather";

interface ToastLoaderProps {
  children: ReactNode;
  progress: number;
  close: (() => void) | undefined;
}

const ToastLoader: React.FC<Partial<ToastLoaderProps>> = ({
  children,
  progress = 0,
  close = undefined,
}: Partial<ToastLoaderProps> = {}) => {
  return (
    <div className="toast-loader">
      <div className="toast-loader-content">
        {children}
        {close && <X onClick={close} />}
      </div>
      <div className="toast-progress-bar">
        <div
          className="toast-progress-bar-indicator"
          style={{ width: (progress * 100).toString() + "%" }}
        ></div>
      </div>
    </div>
  );
};

export { ToastLoader };
