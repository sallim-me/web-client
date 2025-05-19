import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Provider from "./provider";
import BottomNavLayout from "./components/Layout/BottomNavLayout";

import Login from "./pages/Account/Login/Login";
import SignUp from "./pages/Account/SignUp/SignUp";
import PostList from "./pages/Post/PostList/PostList";
import PostCreate from "./pages/Post/PostCreate/PostCreate";
import PostDetail from "./pages/Post/PostDetail/PostDetail";
import ChatList from "./pages/Chat/ChatList/ChatList";
import ChatRoom from "./pages/Chat/ChatRoom/ChatRoom";
import MyPage from "./pages/My/MyPage/MyPage";
import MyPosts from "./pages/My/MyPosts/MyPosts";
import ScrappedPosts from "./pages/My/ScrappedPosts/ScrappedPosts";
import EditProfile from "./pages/My/EditProfile/EditProfile";

export function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route element={<BottomNavLayout />}>
            <Route path="/" element={<Navigate to="/post/list" replace />} />
            <Route path="/post/list" element={<PostList />} />
            <Route path="/post/create" element={<PostCreate />} />
            <Route path="/post/detail/:id" element={<PostDetail />} />
            <Route path="/chat" element={<ChatList />} />
            <Route path="/chat/:chatId" element={<ChatRoom />} />
            <Route path="/my-page" element={<MyPage />} />
            <Route path="/my-page/my-posts" element={<MyPosts />} />
            <Route path="/my-page/scrapped" element={<ScrappedPosts />} />
            <Route path="/my-page/edit-profile" element={<EditProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
