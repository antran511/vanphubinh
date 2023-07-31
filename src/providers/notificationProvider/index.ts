import { Toast } from "@douyinfe/semi-ui";
import { NotificationProvider } from "@refinedev/core";

export const notificationProvider = (): NotificationProvider => {
  return {
    open: ({ key, message, type, description }) => {
      console.log("open", key, message, type, description);
      switch (type) {
        case "error":
          Toast.error({
            id: key,
            content: description,
          });
          break;
        case "success":
          Toast.success({
            id: key,
            content: description,
          });
          break;
        default:
          Toast.info({
            id: key,
            content: description,
          });
          break;
      }
    },
    close: (key) => {
      Toast.close(key);
    },
  };
};
