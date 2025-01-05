/**
 * Progress data for messages that are sent for interacting with a toast loader.
 */
interface ToastData {
  /**
   * Toast types that can be used for distinguishing the same data.
   */
  type: ToastType;

  /**
   * The message to display in the toast loader.
   */
  message?: string;

  /**
   * The loaded progress.
   */
  loaded?: number;

  /**
   * The total value of the progress.
   */
  total?: number;

  /**
   * Whether the current toast loader is closeable.
   */
  closable?: boolean;

  /**
   * The reference for distinguishing progress updates of different actions
   * that are run in parallel.
   */
  ref: number;
}

const toastTypes = [
  "progress-started",
  "progress-updated",
  "progress-completed",
] as const;

type ToastType = (typeof toastTypes)[number];

export { toastTypes };
export type { ToastData, ToastType };
