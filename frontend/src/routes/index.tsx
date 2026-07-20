import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';

import { Landing } from '@/pages/Landing';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { ResetPassword } from '@/pages/ResetPassword';
import { BlogListing } from '@/pages/BlogListing';
import { BlogDetail } from '@/pages/BlogDetail';
import { DashboardHome } from '@/pages/DashboardHome';
import { MyBlogs } from '@/pages/MyBlogs';
import { CreateBlog } from '@/pages/CreateBlog';
import { Profile } from '@/pages/Profile';
import { Settings } from '@/pages/Settings';
import { NotFound } from '@/pages/NotFound';
import { Bookmarks } from '@/pages/Bookmarks';
import { About } from '@/pages/About';
import { Categories } from '@/pages/Categories';
import { Trending } from '@/pages/Trending';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/blogs', element: <BlogListing /> },
      { path: '/blog/:slug', element: <BlogDetail /> },
      { path: '/categories', element: <Categories /> },
      { path: '/trending', element: <Trending /> },
      { path: '/about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/reset-password/:token',
        element: <ResetPassword />,
      },
    ],
  },
  {
    element: <DashboardLayout />,
    children: [
      { path: '/dashboard', element: <DashboardHome /> },
      { path: '/dashboard/blogs', element: <MyBlogs /> },
      { path: '/dashboard/create', element: <CreateBlog /> },
      { path: '/dashboard/edit/:id', element: <CreateBlog /> },
      { path: '/dashboard/profile', element: <Profile /> },
      { path: '/dashboard/bookmarks', element: <Bookmarks /> },
      { path: '/dashboard/settings', element: <Settings /> },
    ],
  },
]);
