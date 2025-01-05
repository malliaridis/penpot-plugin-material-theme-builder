import "./ToastLoader.css";
import { ToastContext } from "./ToastContext.ts";
import { FC, ReactNode, useState } from "react";
import { ToastData } from "../../model/ToastData.ts";
import { ToastContainer, toast, Zoom } from "react-toastify";

interface ToastContextProviderProps {
  children: ReactNode;
}

/**
 * Toast context provider that allows the loading of a toast message
 * with loading bar. The implementation relies on window events that can be
 * used to show, hide and update the toast loader.
 *
 * @param children
 * @constructor
 * @see ToastData
 */
const ToastContextProvider: FC<ToastContextProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<number[]>([]);

  const onUpdate = (data: ToastData) => {
    let progress: number | undefined;
    let progressMessage: string | undefined;
    if (data.loaded && data.total) {
      progress = data.loaded / data.total;
      progressMessage = data.loaded.toString() + "/" + data.total.toString();
    }

    switch (data.type) {
      case "progress-started":
        setToasts([...toasts, data.ref]);
        toast(
          <>
            <span className="body-m primary">{data.message}</span>
            <span className="body-m secondary">{progressMessage}</span>
          </>,
          {
            toastId: data.ref,
            progress,
          },
        );
        break;
      case "progress-updated":
        toast.update(data.ref, {
          render: (
            <div className="toast-content">
              <span className="body-m primary">{data.message}</span>
              <span className="body-m secondary">{progressMessage}</span>
            </div>
          ),
          progress,
        });
        break;
      case "progress-completed":
        setToasts(toasts.filter((ref) => ref != data.ref));
        toast.dismiss(data.ref);
        break;
    }
  };

  return (
    <ToastContext.Provider
      value={{
        update: onUpdate,
        isProcessing: toasts.length > 0,
      }}
    >
      <>
        {children}
        <ToastContainer
          position="bottom-center"
          autoClose={false}
          closeButton={false}
          hideProgressBar={false}
          closeOnClick={false}
          draggable={false}
          transition={Zoom}
        />
      </>
    </ToastContext.Provider>
  );
};

export { ToastContextProvider };
