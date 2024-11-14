import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import SearchPage from './pages/Search/search';
import MoviesPage from './pages/Movie/movie';
import CategoryPage from './pages/Category/category';
import LoginPage from './pages/Login/login';
import SignupPage from './pages/Signup/signup';

import RootLayout from './layout/root-layout';

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
        path: 'movie/:category', // 특정 카테고리의 영화 데이터를 보여주는 페이지 경로
        element: <MoviesPage />
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
