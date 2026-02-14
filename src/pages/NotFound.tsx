import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6">
      <div className="text-center">
        <h1 className="mb-4 text-5xl md:text-6xl font-bold">404</h1>
        <p className="mb-4 text-lg md:text-xl text-muted-foreground">Página no encontrada</p>
        <a href="/" className="text-cta font-semibold underline hover:opacity-80 transition-opacity">
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
