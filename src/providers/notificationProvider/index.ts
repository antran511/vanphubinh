import { Notification as SemiNoti } from "@douyinfe/semi-ui";
import { NotificationProvider } from "@refinedev/core";

export const notificationProvider = (): NotificationProvider => {
  return {
    open: ({ key, message, type, description }) => {
      switch (type) {
        case "error":
          SemiNoti.error({
            id: key,
            title: description,
            content: message,
          });
          break;
        case "success":
          SemiNoti.success({
            id: key,
            title: description,
            content: message,
          });
          break;
        default:
          SemiNoti.open({
            id: key,
            title: description,
            content: message,
          });
          break;
      }
    },
    close: (key) => {
      SemiNoti.close(key);
    },
  };
};
