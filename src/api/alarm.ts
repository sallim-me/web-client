import { Alarm } from "../types/alarm";
import { axiosInstance } from "../lib/axios";

export const getAlarms = async (): Promise<Alarm[]> => {
  const { data } = await axiosInstance.get<Alarm[]>("/api/alarms");
  return data;
};

export const markAlarmAsRead = async (alarmId: number): Promise<void> => {
  await axiosInstance.patch(`/api/alarms/${alarmId}/read`);
};

export const markAllAlarmsAsRead = async (): Promise<void> => {
  await axiosInstance.patch("/api/alarms/read-all");
};
