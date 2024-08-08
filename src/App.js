// import Navbar from "./components/navbar/navbar";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/auth/login";
import Dashboard from "./pages/home/dashboard";
import Auth from "./hooks/auth";
import SignUp from "./pages/auth/signup";
import { useEffect } from "react";
import EmailActivation from "./pages/auth/emailActivation";
import ResendEmail from "./pages/auth/resendEmail";
import NotFound from "./pages/auth/notFound";
import Profile from "./pages/home/profile";



function App() {
  const { getUser, getToken } = Auth();
  const navigate = useNavigate();
  const location = useLocation();
  let token = getToken();
  let user = getUser();

  useEffect(()=>{
    if (!token) {
      if((location.pathname.includes('/auth'))){
        navigate(location.pathname)
      }else{
        navigate('/auth/login')
      }
    }else if(token && !user?.emailVerified && !location.pathname.includes('/user/activation')){
      navigate('/activation-email/'+user?.id)
    }
  },[token])
  
  return (
    <div>
      <Routes>
        <Route path="/auth/login" element={token ? <NotFound/> : <Login />} />
        <Route path="/auth/sign-up" element={token ? <NotFound/> : <SignUp />} />
        <Route path="/user/activation/:access_token" element={<EmailActivation />} />
        <Route path="/activation-email/:id" element={<ResendEmail />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </div>
  );
}

export default App;
