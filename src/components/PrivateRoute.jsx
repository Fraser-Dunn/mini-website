import { Navigate, Outlet } from "react-router-dom";

// import Spinner from "./Spinner";

const PrivateRoute = (props) => {
  return props.isAuthed ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
