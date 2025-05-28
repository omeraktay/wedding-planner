import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }){
    const { isAuthenticated, isLoading } = useAuth0();

    if(isLoading){
        return <p>Loading...</p>
    }

    if(!isAuthenticated){
        return <Navigate to='/' />
    }

    return children;
}

export default ProtectedRoute;