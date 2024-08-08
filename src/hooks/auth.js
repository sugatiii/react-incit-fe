import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const navigate = useNavigate();

  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);
    return userToken;
  };

  const getUser = () => {
    const userString = localStorage.getItem("user");
    const user_detail = JSON.parse(userString);
    return user_detail;
  };

  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());

  const logOut = () => {
    localStorage.clear();

    setTimeout(()=>{
      navigate("/auth/login");
    },1000)
  };

  const saveToken = (user, token) => {
    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    if(user?.emailVerified){
      navigate("/dashboard");
    }else{
      navigate("/activation-email");
    }
  };

  const saveUser = (user, navigate= true) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    if(navigate){
      if(user?.emailVerified){
        navigate("/dashboard");
      }else{
        navigate(`/activation-email`);
      }
    }
  };

  let headers = {
    "Content-type": "application/json",
  }

  if(token){
    headers = {
      ...headers,
      "Authorization": token
    }
  }

  const http = axios.create({
    baseURL: process.env.REACT_APP_API_HOST,
    headers: headers,
  });

  return {
    setToken: saveToken,
    token,
    user,
    getUser,
    getToken,
    http,
    logOut,
    saveUser
  };
}

export default Auth;
