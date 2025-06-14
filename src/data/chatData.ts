// 채팅방 데이터 타입 정의
export interface Message {
  id: number;
  content: string;
  time: string;
  isMine: boolean;
}

export interface MessageGroup {
  id: number;
  date: string;
  items: Message[];
}

export interface ChatRoom {
  id: number;
  postId: string;
  nickname: string;
  postTitle: string;
  lastMessage: string;
  lastTime: string;
  unread: boolean;
  messages: MessageGroup[];
}

// 채팅방 데이터
export const chatRooms: ChatRoom[] = [
  {
    id: 1,
    postId: "1",
    nickname: "김철수",
    postTitle: "삼성 냉장고 팝니다",
    lastMessage: "아직 구매 가능할까요?",
    lastTime: "14:34",
    unread: false,
    messages: [
      {
        id: 1,
        date: "2024년 3월 15일",
        items: [
          {
            id: 1,
            content: "안녕하세요! 냉장고 아직 있나요?",
            time: "14:30",
            isMine: false,
          },
          {
            id: 2,
            content: "네, 아직 있습니다!",
            time: "14:31",
            isMine: true,
          },
          {
            id: 3,
            content: "아직 구매 가능할까요?",
            time: "14:34",
            isMine: false,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    postId: "2",
    nickname: "이영희",
    postTitle: "중고 자전거 판매",
    lastMessage: "내일 오후 2시에 만날 수 있을까요?",
    lastTime: "어제",
    unread: true,
    messages: [
      {
        id: 1,
        date: "2024년 3월 16일",
        items: [
          {
            id: 1,
            content: "자전거 상태는 어떤가요?",
            time: "10:15",
            isMine: false,
          },
          {
            id: 2,
            content: "거의 새것과 같습니다. 한번 보시겠어요?",
            time: "10:20",
            isMine: true,
          },
          {
            id: 3,
            content: "내일 오후 2시에 만날 수 있을까요?",
            time: "10:25",
            isMine: false,
          },
          {
            id: 4,
            content: "네, 가능합니다! 장소는 어디로 할까요?",
            time: "10:30",
            isMine: true,
          },
          {
            id: 5,
            content: "강남역 근처로 하겠습니다.",
            time: "10:35",
            isMine: false,
          },
          {
            id: 6,
            content: "좋습니다! 그럼 내일 뵙겠습니다.",
            time: "10:40",
            isMine: true,
          },
          {
            id: 7,
            content: "네, 감사합니다!",
            time: "10:45",
            isMine: false,
          },
          {
            id: 8,
            content: "천만에요! 좋은 하루 되세요.",
            time: "10:50",
            isMine: true,
          },
          {
            id: 9,
            content: "감사합니다! 내일 뵙겠습니다.",
            time: "10:55",
            isMine: false,
          },
          {
            id: 10,
            content: "네, 내일 뵙겠습니다!",
            time: "11:00",
            isMine: true,
          },
          {
            id: 11,
            content: "혹시 다른 시간대도 괜찮으신가요?",
            time: "11:05",
            isMine: false,
          },
          {
            id: 12,
            content: "오후 2시가 가장 좋습니다. 다른 시간은 어려울 것 같아요.",
            time: "11:10",
            isMine: true,
          },
          {
            id: 13,
            content: "알겠습니다. 그럼 오후 2시에 강남역 근처에서 뵙겠습니다.",
            time: "11:15",
            isMine: false,
          },
          {
            id: 14,
            content: "네, 감사합니다! 내일 뵙겠습니다.",
            time: "11:20",
            isMine: true,
          },
          {
            id: 15,
            content: "🐿️",
            time: "11:20",
            isMine: true,
          },
          {
            id: 16,
            content: "👍",
            time: "11:30",
            isMine: false,
          },
          {
            id: 17,
            content: "👍",
            time: "11:30",
            isMine: false,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    postId: "3",
    nickname: "박민수",
    postTitle: "아이폰 13 프로",
    lastMessage: "빠른 답변 감사합니다!",
    lastTime: "월",
    unread: false,
    messages: [
      {
        id: 1,
        date: "2024년 3월 17일",
        items: [
          {
            id: 1,
            content: "아이폰 상태는 어떤가요?",
            time: "15:30",
            isMine: false,
          },
          {
            id: 2,
            content: "깨끗한 상태입니다. 한번 보시겠어요?",
            time: "15:35",
            isMine: true,
          },
          {
            id: 3,
            content: "빠른 답변 감사합니다!",
            time: "15:40",
            isMine: false,
          },
        ],
      },
    ],
  },
];
