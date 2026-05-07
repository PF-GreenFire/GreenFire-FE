import api from "./axios";

export const getNotificationsAPI = async ({ unreadOnly = false, size = 30 } = {}) => {
  const params = new URLSearchParams({ unreadOnly: String(unreadOnly), size: String(size) });
  const { data } = await api.get(`/api/notifications?${params.toString()}`);
  return data;
};

export const getUnreadCountAPI = async () => {
  const { data } = await api.get(`/api/notifications/unread-count`);
  return data?.count ?? 0;
};

export const markNotificationReadAPI = async (notificationCode) => {
  await api.post(`/api/notifications/${notificationCode}/read`);
};

export const markAllNotificationsReadAPI = async () => {
  await api.post(`/api/notifications/read-all`);
};
