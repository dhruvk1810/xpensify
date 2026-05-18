import { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Router context
const RouterContext = createContext({
  currentPath: '/',
  navigate: () => {},
});

export function RouterProvider({ children }) {
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname + window.location.search || '/';
  });

  const navigate = useCallback((path) => {
    if (typeof path === 'number') {
      window.history.go(path);
      return;
    }
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export function Route({ path, element, children }) {
  const { currentPath } = useRouter();
  const pathname = currentPath.split('?')[0];
  if (pathname !== path) return null;
  return <>{element || children}</>;
}

export function Routes({ children }) {
  return <>{children}</>;
}

export function Link({ to, children, className }) {
  const { navigate } = useRouter();
  
  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
      className={className}
    >
      {children}
    </a>
  );
}

export function NavLink({ to, children, className }) {
  const { currentPath, navigate } = useRouter();
  const pathname = currentPath.split('?')[0];
  const isActive = pathname === to;

  const resolvedClassName = typeof className === 'function'
    ? className({ isActive })
    : className;

  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
      className={resolvedClassName}
    >
      {children}
    </a>
  );
}

export function useNavigate() {
  const { navigate } = useRouter();
  return navigate;
}

export function useLocation() {
  const { currentPath } = useRouter();
  const [pathname, search = ''] = currentPath.split('?');
  return { pathname, search: search ? `?${search}` : '' };
}

export function Navigate({ to }) {
  const { navigate } = useRouter();
  
  useEffect(() => {
    navigate(to);
  }, [navigate, to]);
  
  return null;
}

export function Outlet() {
  return null;
}

export function BrowserRouter({ children }) {
  return <RouterProvider>{children}</RouterProvider>;
}
