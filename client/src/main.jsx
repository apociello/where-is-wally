import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import MapSelectPage from './pages/MapSelectPage.jsx';
import GamePage from './pages/GamePage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import './index.css';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/maps', element: <MapSelectPage /> },
  { path: '/maps/:slug', element: <GamePage /> },
  { path: '*', element: <ErrorPage /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
