export type AlarmType = "chat" | "comment" | "reply";

export interface Alarm {
  id: number;
  type: AlarmType;
  content: string;
  date: string;
  isRead: boolean;
  targetId: string;
  targetType: "chat" | "post";
  postTitle?: string;
}

export interface AlarmState {
  alarms: Alarm[];
  isLoading: boolean;
  error: string | null;
}
