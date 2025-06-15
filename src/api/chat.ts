import { axiosInstance } from "@/lib/axios";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// 채팅방 생성 요청 타입
export interface CreateChatRoomRequest {
  productId: number;
}

// 채팅방 응답 타입
export interface ChatRoomResponse {
  id: string;
  productId: number;
  buyerId: number;
  sellerId: number;
  createdAt: string;
}

// 채팅방 목록 응답 타입 (실제 서버 응답 구조)
export interface ChatRoomWithUnreadCountResponse {
  id: number;
  productId: number;
  sellerId: number;
  buyerId: number;
  latestChatMessageId: number | null;
  createdAt: string; // ISO date string
  unreadCount: number;
  latestMessage: string | null;
  latestMessageTime: string | null; // ISO date string
}

// 메시지 전송 요청 타입 (웹소켓용)
export interface SendMessageRequest {
  content: string;
  messageType?: string;
}

// 메시지 응답 타입
export interface ChatMessageResponse {
  id: number;
  content: string;
  senderId: number;
  senderNickname: string;
  messageType: string;
  sentAt: string;
  isRead: boolean;
}

// 메시지 DTO (Spring Boot 기준)
export interface ChatMessageDTO {
  id: number;
  chatRoomId: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
}

// 메시지 목록 응답 타입 (페이징)
export interface GetMessagesResponse {
  status: number;
  code: string;
  message: string;
  data: {
    content: ChatMessageResponse[];
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
}

// 채팅방 상태 응답 타입
export interface ChatRoomStatusResponse {
  isOnline: boolean;
  lastSeenAt: string;
}

// API 응답 래퍼 타입들
export interface ApiResponseChatRoomResponse {
  status: number;
  code: string;
  message: string;
  data: ChatRoomResponse;
}

export interface ApiResponseListChatRoomWithUnreadCountResponse {
  status: number;
  code: string;
  message: string;
  data: ChatRoomWithUnreadCountResponse[];
  timestamp: string;
}

export interface ApiResponseChatMessageResponse {
  status: number;
  code: string;
  message: string;
  data: ChatMessageResponse;
}

export interface ApiResponseChatRoomStatusResponse {
  status: number;
  code: string;
  message: string;
  data: ChatRoomStatusResponse;
}

export interface ApiResponseVoid {
  status: number;
  code: string;
  message: string;
  data: Record<string, never>;
}

// 웹소켓 메시지 전송 타입 (STOMP 용)
export interface WebSocketSendMessage {
  roomId: string;
  content: string;
  messageType: string;
}

// 웹소켓 수신 메시지 타입
export interface WebSocketReceiveMessage {
  id: number;
  content: string;
  senderId: number;
  senderNickname: string;
  messageType: string;
  sentAt: string;
  roomId: string;
}

// 웹소켓 연결 상태 타입
export interface WebSocketConnectionStatus {
  connected: boolean;
  error?: string;
}

// 웹소켓 메시지 전송 타입 (STOMP 용)
export interface WebSocketSendMessage {
  content: string;
}

// 웹소켓 수신 메시지 타입 (API 문서 기준)
export interface WebSocketReceiveMessage {
  id: number;
  chatRoomId: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
}

// 웹소켓 클래스
export class ChatWebSocketClient {
  private client: Client | null = null;
  private isConnecting = false;
  private subscriptions: Map<string, any> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private connectionCallbacks: ((connected: boolean, error?: string) => void)[] = [];
  private messageCallbacks: Map<string, (message: WebSocketReceiveMessage) => void> = new Map();

  // 연결 상태 콜백 등록
  onConnectionChange(callback: (connected: boolean, error?: string) => void) {
    this.connectionCallbacks.push(callback);
  }

  // 메시지 수신 콜백 등록
  onMessage(roomId: string, callback: (message: WebSocketReceiveMessage) => void) {
    this.messageCallbacks.set(roomId, callback);
    console.log(`Message callback registered for room: ${roomId}`);
  }

  // 웹소켓 연결
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client?.connected) {
        console.log("WebSocket already connected");
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error("Already connecting"));
        return;
      }

      console.log("Starting WebSocket connection...");
      this.isConnecting = true;
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        this.isConnecting = false;
        const error = "No authentication token found";
        this.notifyConnectionChange(false, error);
        reject(new Error(error));
        return;
      }

      // SockJS를 통한 WebSocket 연결
      // const wsUrl = process.env.NODE_ENV === 'production' 
      //   ? "https://sallim.me/ws-chat" 
      //   : "http://localhost:8080/ws-chat";
      // const wsUrl = process.env.REACT_APP_API_URL || "https://dev-back.sallim.me/ws-chat";
      let wsUrl = process.env.REACT_APP_API_URL || "https://dev-back.sallim.me";
      wsUrl += "/ws-chat";
      
      console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);
      const socket = new SockJS(wsUrl);
      this.client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: (str) => {
          console.log("STOMP Debug:", str);
        },
        reconnectDelay: this.reconnectInterval,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.client.onConnect = () => {
        console.log("✅ WebSocket connected successfully");
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.notifyConnectionChange(true);
        resolve();
      };

      this.client.onStompError = (frame) => {
        console.error("❌ STOMP error:", frame);
        this.isConnecting = false;
        const error = frame.headers?.message || "WebSocket connection failed";
        this.notifyConnectionChange(false, error);
        reject(new Error(error));
      };

      this.client.onWebSocketClose = () => {
        console.log("🔌 WebSocket disconnected");
        this.isConnecting = false;
        this.notifyConnectionChange(false);
        
        // 자동 재연결
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          setTimeout(() => {
            this.connect().catch(console.error);
          }, this.reconnectInterval);
        }
      };

      this.client.activate();
    });
  }

  // 채팅방 구독
  subscribeToChatRoom(roomId: string): void {
    if (!this.client?.connected) {
      console.error("❌ WebSocket not connected, cannot subscribe");
      return;
    }

    const destination = `/topic/room/${roomId}`;
    
    // 이미 구독 중인 경우 종료
    if (this.subscriptions.has(roomId)) {
      console.log(`⚠️  Already subscribed to room: ${roomId}`);
      return;
    }

    console.log(`🔔 Subscribing to: ${destination}`);

    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        console.log("📨 Raw message received:", message.body);
        const messageData: WebSocketReceiveMessage = JSON.parse(message.body);
        console.log("📨 Parsed message:", messageData);
        
        const callback = this.messageCallbacks.get(roomId);
        if (callback) {
          console.log("🎯 Calling message callback for room:", roomId);
          callback(messageData);
        } else {
          console.warn("⚠️  No callback registered for room:", roomId);
        }
      } catch (error) {
        console.error("❌ Failed to parse message:", error);
        console.error("Raw message body:", message.body);
      }
    });

    this.subscriptions.set(roomId, subscription);
    console.log(`✅ Successfully subscribed to chat room: ${roomId}`);
  }

  // 채팅방 구독 해제
  unsubscribeFromChatRoom(roomId: string): void {
    const subscription = this.subscriptions.get(roomId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(roomId);
      this.messageCallbacks.delete(roomId);
      console.log(`Unsubscribed from chat room: ${roomId}`);
    }
  }

  // 메시지 전송
  sendMessage(roomId: string, content: string): void {
    if (!this.client?.connected) {
      console.error("❌ WebSocket not connected, cannot send message");
      return;
    }

    const message = { content };
    const destination = `/app/chat/room/${roomId}`;
    
    console.log(`📤 Sending message to: ${destination}`);
    console.log(`📤 Message content:`, message);
    
    this.client.publish({
      destination,
      body: JSON.stringify(message),
    });

    console.log(`✅ Message sent to room ${roomId}: "${content}"`);
  }

  // 연결 해제
  disconnect(): void {
    if (this.client?.connected) {
      // 모든 구독 해제
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();
      this.messageCallbacks.clear();

      this.client.deactivate();
      console.log("WebSocket disconnected");
      this.notifyConnectionChange(false);
    }
  }

  // 연결 상태 확인
  isConnected(): boolean {
    return this.client?.connected || false;
  }

  // 연결 상태 변경 알림
  private notifyConnectionChange(connected: boolean, error?: string): void {
    this.connectionCallbacks.forEach(callback => {
      callback(connected, error);
    });
  }
}

// 전역 웹소켓 클라이언트 인스턴스
export const chatWebSocketClient = new ChatWebSocketClient();

const CHAT_URL = "/chat";

export const chatApi = {
  // 채팅방 생성
  createChatRoom: async (
    data: CreateChatRoomRequest
  ): Promise<ApiResponseChatRoomResponse> => {
    try {
      console.log("Creating chat room with data:", data);
      const response = await axiosInstance.post<ApiResponseChatRoomResponse>(
        `${CHAT_URL}/rooms`,
        data
      );
      console.log("Chat room creation response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Create chat room error:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      throw error;
    }
  },

  // 채팅방 목록 조회 (최신 메시지 순 + 읽지 않은 메시지 수)
  getChatRooms: async (): Promise<ApiResponseListChatRoomWithUnreadCountResponse> => {
    try {
      const response = await axiosInstance.get<ApiResponseListChatRoomWithUnreadCountResponse>(
        `${CHAT_URL}/rooms`
      );
      return response.data;
    } catch (error: any) {
      console.error("Get chat rooms error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // 채팅방 상세 조회
  getChatRoom: async (chatRoomId: string): Promise<ApiResponseChatRoomResponse> => {
    try {
      const response = await axiosInstance.get<ApiResponseChatRoomResponse>(
        `${CHAT_URL}/room/${chatRoomId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Get chat room error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // 내가 참여 중인 모든 채팅방 조회
  getMyChatRooms: async (): Promise<ApiResponseListChatRoomWithUnreadCountResponse> => {
    try {
      const response = await axiosInstance.get<ApiResponseListChatRoomWithUnreadCountResponse>(
        `${CHAT_URL}/my-rooms`
      );
      return response.data;
    } catch (error: any) {
      console.error("Get my chat rooms error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // 채팅방 입장
  enterChatRoom: async (roomId: string): Promise<ApiResponseVoid> => {
    try {
      console.log("Entering chat room:", roomId);
      const response = await axiosInstance.post<ApiResponseVoid>(
        `${CHAT_URL}/rooms/${roomId}/enter`
      );
      console.log("Enter chat room response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Enter chat room error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // 채팅방 퇴장
  exitChatRoom: async (roomId: string): Promise<ApiResponseVoid> => {
    try {
      console.log("Exiting chat room:", roomId);
      const response = await axiosInstance.post<ApiResponseVoid>(
        `${CHAT_URL}/rooms/${roomId}/exit`
      );
      console.log("Exit chat room response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Exit chat room error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // 채팅방 나가기 (완전 퇴장)
  leaveChatRoom: async (chatRoomId: string): Promise<ApiResponseVoid> => {
    try {
      console.log("Leaving chat room:", chatRoomId);
      const response = await axiosInstance.delete<ApiResponseVoid>(
        `${CHAT_URL}/room/${chatRoomId}/leave`
      );
      console.log("Leave chat room response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Leave chat room error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // 메시지 목록 조회
  getMessages: async (
    roomId: string,
    page: number = 0,
    size: number = 20
  ): Promise<GetMessagesResponse> => {
    try {
      const response = await axiosInstance.get<GetMessagesResponse>(
        `${CHAT_URL}/rooms/${roomId}/messages`,
        {
          params: { page, size }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Get messages error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // 메시지 전송
  sendMessage: async (
    roomId: string,
    data: SendMessageRequest
  ): Promise<ApiResponseChatMessageResponse> => {
    try {
      console.log("Sending message to room:", roomId, "with data:", data);
      const response = await axiosInstance.post<ApiResponseChatMessageResponse>(
        `${CHAT_URL}/rooms/${roomId}/messages`,
        data
      );
      console.log("Send message response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Send message error:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      throw error;
    }
  },

  // 메시지 읽음 처리 (특정 채팅방의 읽지 않은 메시지들 모두 읽음 처리)
  markMessagesAsRead: async (roomId: string): Promise<ApiResponseVoid> => {
    try {
      console.log("Marking messages as read for room:", roomId);
      const response = await axiosInstance.post<ApiResponseVoid>(
        `${CHAT_URL}/rooms/${roomId}/read`
      );
      console.log("Mark messages as read response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Mark messages as read error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // 채팅방 읽음 처리 (PUT 메서드)
  markRoomAsRead: async (roomId: string): Promise<ApiResponseVoid> => {
    try {
      console.log("Marking room as read:", roomId);
      const response = await axiosInstance.put<ApiResponseVoid>(
        `${CHAT_URL}/rooms/${roomId}/read`
      );
      console.log("Mark room as read response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Mark room as read error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // 채팅방 상태 조회
  getChatRoomStatus: async (roomId: string): Promise<ApiResponseChatRoomStatusResponse> => {
    try {
      const response = await axiosInstance.get<ApiResponseChatRoomStatusResponse>(
        `${CHAT_URL}/rooms/${roomId}/status`
      );
      return response.data;
    } catch (error: any) {
      console.error("Get chat room status error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // 채팅방에 필요한 추가 정보 조회 (상품 정보, 사용자 정보)
  getChatRoomDetails: async (chatRoom: ChatRoomWithUnreadCountResponse, currentUserId: number) => {
    try {
      // 상대방 ID 결정
      const otherUserId = chatRoom.sellerId === currentUserId ? chatRoom.buyerId : chatRoom.sellerId;
      
      // TODO: 실제 API 호출로 대체 필요
      // const [productInfo, userInfo] = await Promise.all([
      //   productApi.getProduct(chatRoom.productId),
      //   memberApi.getMember(otherUserId)
      // ]);

      // 임시 데이터 (실제 API 연동 전까지)
      return {
        productTitle: `상품 ${chatRoom.productId}`,
        productImageUrl: "",
        otherUserNickname: `사용자${otherUserId}`,
      };
    } catch (error) {
      console.error("Failed to get chat room details:", error);
      return {
        productTitle: `상품 ${chatRoom.productId}`,
        productImageUrl: "",
        otherUserNickname: `사용자`,
      };
    }
  },
};

// 유틸리티 함수들
export const chatUtils = {
  // 서버의 날짜 배열을 Date 객체로 변환 (하위 호환용)
  arrayToDate: (dateArray: number[]): Date => {
    if (!dateArray || dateArray.length < 6) {
      return new Date();
    }
    // [year, month, day, hour, minute, second] -> Date
    // 주의: month는 0-based이므로 -1 해야 함
    return new Date(
      dateArray[0], // year
      dateArray[1] - 1, // month (0-based)
      dateArray[2], // day
      dateArray[3], // hour
      dateArray[4], // minute
      dateArray[5] // second
    );
  },

  // ISO 날짜 문자열을 Date 객체로 변환
  isoStringToDate: (isoString: string | null): Date | null => {
    if (!isoString) return null;
    try {
      return new Date(isoString);
    } catch (error) {
      console.error('Invalid ISO date string:', isoString, error);
      return null;
    }
  },

  // 시간 포맷팅 (ISO 문자열 버전)
  formatTime: (isoString: string | null): string => {
    if (!isoString) return "";
    
    const messageTime = chatUtils.isoStringToDate(isoString);
    if (!messageTime || isNaN(messageTime.getTime())) {
      return "";
    }

    const now = new Date();
    const diff = now.getTime() - messageTime.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return messageTime.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "어제";
    } else if (days < 7) {
      return `${days}일 전`;
    } else {
      return messageTime.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      });
    }
  },

  // 시간 포맷팅 (날짜 배열 버전 - 하위 호환용)
  formatTimeArray: (dateArray: number[] | null): string => {
    if (!dateArray) return "";
    
    const messageTime = chatUtils.arrayToDate(dateArray);
    const now = new Date();
    const diff = now.getTime() - messageTime.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return messageTime.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "어제";
    } else if (days < 7) {
      return `${days}일 전`;
    } else {
      return messageTime.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      });
    }
  },

  // 채팅방 ID를 문자열로 변환
  roomIdToString: (id: number): string => {
    return id.toString();
  },
};
