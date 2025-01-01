import { Message, PluginData } from "../model/message.ts";

/**
 * Message service that is extended by any service implementation that is based
 * on the messaging mechanism this service provides.
 */
class MessageService {
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
