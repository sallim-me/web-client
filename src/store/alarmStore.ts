import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Alarm, AlarmState } from "@/types/alarm";
import { getAlarms, markAlarmAsRead, markAllAlarmsAsRead } from "@/api/alarm";

interface AlarmStore extends AlarmState {
  fetchAlarms: () => Promise<void>;
  markAsRead: (alarmId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useAlarmStore = create<AlarmStore>()(
  devtools(
    (set) => ({
      alarms: [],
      isLoading: false,
      error: null,

      fetchAlarms: async () => {
        set({ isLoading: true, error: null });
        try {
          const alarms = await getAlarms();
          set({ alarms, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "알림을 불러오는데 실패했습니다.",
            isLoading: false,
          });
        }
      },

      markAsRead: async (alarmId: number) => {
        try {
          await markAlarmAsRead(alarmId);
          set((state) => ({
            alarms: state.alarms.map((alarm) =>
              alarm.id === alarmId ? { ...alarm, isRead: true } : alarm
            ),
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "알림 상태 변경에 실패했습니다.",
          });
        }
      },

      markAllAsRead: async () => {
        try {
          await markAllAlarmsAsRead();
          set((state) => ({
            alarms: state.alarms.map((alarm) => ({ ...alarm, isRead: true })),
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "알림 상태 변경에 실패했습니다.",
          });
        }
      },
    }),
    {
      name: "alarm-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);
