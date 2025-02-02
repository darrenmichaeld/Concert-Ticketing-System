import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom';
import { Suspense } from 'react';
import Main from '../pages/main';

// ----------------------------------------------------------------------

export function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <Suspense fallback="">
          <Main/>
        </Suspense>
      ),
    },
    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
