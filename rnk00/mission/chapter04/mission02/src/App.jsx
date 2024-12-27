import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import SearchPage from './pages/Search/search';
import CategoryPage from './pages/Category/category';
import LoginPage from './pages/Login/login';
import SignupPage from './pages/Signup/signup';

import RootLayout from './layout/root-layout';
import MovieRouter from './router/movierouter';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout/>, // RootLayout에서 Sidebar와 Outlet을 관리
    children: [ // children에 있는 게 Outlet인가?%%%
      {
        path: 'search', // 페이지 경로
        element: <SearchPage />
      },
      {
        path: 'movie', 
        element: <CategoryPage />
      },
      {
        path: 'movie/:category_or_movieid', 
        element: <MovieRouter/> // 카테고리에 해당하는 영화 리스트 or 상세 페이지
      },
      {
        path: 'login', 
        element: <LoginPage />
      },
      {
        path: 'signup', 
        element: <SignupPage />
      }
    ]
  }
]);

const App = () => {
    return (
        <RouterProvider router={router} />
    );
};

export default App;
