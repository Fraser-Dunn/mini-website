import { Navigate, Outlet } from "react-router-dom";

// import Spinner from "./Spinner";

const PrivateRoute = ({ isAuthed }) => {
  return isAuthed ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
