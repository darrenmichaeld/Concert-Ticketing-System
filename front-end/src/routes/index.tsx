import { Navigate, useRoutes } from 'react-router-dom';

import { Suspense } from 'react';
import Main from '../pages/main';

// ----------------------------------------------------------------------

export function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <Suspense>
          <Main/>
        </Suspense>
      ),
    },
    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
