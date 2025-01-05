import { Message, PluginData } from "../model/message.ts";
import { ToastData } from "../model/ToastData.ts";

/**
 * Message service that is extended by any service implementation that is based
 * on the messaging mechanism this service provides.
 */
class MessageService {
  /**
   * Callback that is used for any update.
   */
  readonly onUpdate: (data: ToastData) => void;

  constructor(onUpdate: (data: ToastData) => void) {
    this.onUpdate = onUpdate;
  }

  /**
   * Sends a well-defined message to plugin.ts
   *
   * @param type The message type
   * @param data Data to send
   */
  sendMessage(type: string, data: object | undefined = undefined) {
    parent.postMessage(
      {
        source: "plugin",
        type,
        data,
      } as Message<PluginData>,
      "*",
    );
  }
}

export { MessageService };
