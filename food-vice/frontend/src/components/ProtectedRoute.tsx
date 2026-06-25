
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ErrorScreen, LoadingDialog } from "./Shared/Feedback";


export function ProtectedRoute(){
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingDialog message="Verifying your account..." />;
   
  if (!user) {

    if(location.pathname === "/signup"){
       return <Navigate to="/auth/signup" replace />;
    }


    
    return <Navigate to="/auth/login" replace />;
  
  }

  if(user.banned && user.banUntil===null ){
    return <ErrorScreen title="You are Banned" message={`Reason for Ban:\n${user.banReason}}`}/>
  }

  if(user.banned && new Date(user.banUntil) > new Date()){
    return <ErrorScreen title="You are Banned" message={`Reason for Ban:\n${user.banReason}\n${user.banUntil ? `Ban Until: ${new Date(user.banUntil).toLocaleDateString()}`:""}`}/>
  }

  return <Outlet />;
};

