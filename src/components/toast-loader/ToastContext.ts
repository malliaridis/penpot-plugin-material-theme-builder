import { createContext } from "react";
import { ToastData } from "../../model/ToastData.ts";

interface IToastContext {
  update: (data: ToastData) => void;
  isProcessing: boolean;
}

const ToastContext = createContext<IToastContext>({
  update: () => undefined,
  isProcessing: false,
});

export { ToastContext };
export type { IToastContext };
