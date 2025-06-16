import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Provider from "./provider";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Account/Login/Login";
import SignUp from "./pages/Account/SignUp/SignUp";
import PostList from "./pages/Post/PostList/PostList";
import PostCreate from "./pages/Post/PostCreate/PostCreate";
import PostDetail from "./pages/Post/PostDetail/PostDetail";
import ChatList from "./pages/Chat/ChatList/ChatList";
import ChatRoom from "./pages/Chat/ChatRoom/ChatRoom";
import MyPage from "./pages/My/MyPage/MyPage";
import MyPosts from "./pages/My/MyPosts/MyPosts";
import Scrapped from "./pages/My/Scrapped/Scrapped";
import EditProfile from "./pages/My/EditProfile/EditProfile";

export function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route element={<Layout showHeader showBottomNav />}>
            <Route path="/" element={<Navigate to="/post/list" replace />} />
            <Route path="/post/list" element={<PostList />} />
            <Route path="/post/detail/:id" element={<PostDetail />} />
          </Route>

          {/* 인증이 필요한 페이지들을 ProtectedRoute로 감쌉니다. */}
          <Route element={<ProtectedRoute />}>
            {/* 헤더와 바텀 네비게이션이 필요한 페이지들 */}
            <Route element={<Layout showHeader showBottomNav />}>
              {/* 채팅 및 마이페이지 관련 경로는 인증 필요 */}
              <Route path="/chat" element={<ChatList />} />
              <Route path="/my-page" element={<MyPage />} />
              <Route path="/my-page/my-posts" element={<MyPosts />} />
              <Route path="/my-page/scraps" element={<Scrapped />} />
              <Route path="/my-page/edit-profile" element={<EditProfile />} />
            </Route>

            {/* 게시글 작성/수정 및 상세 페이지는 인증 필요 시 ProtectedRoute 내부로 이동 */}
            <Route path="/post/create" element={<PostCreate />} />
            <Route path="/chat/:chatId" element={<ChatRoom />} />
          </Route>

          {/* 필요하다면 인증되지 않은 사용자에게 보여줄 404 페이지 등을 여기에 추가 */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
