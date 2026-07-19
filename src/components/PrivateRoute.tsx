import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  isAuthed: boolean;
}

const PrivateRoute = ({ isAuthed }: PrivateRouteProps) => {
  return isAuthed ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
