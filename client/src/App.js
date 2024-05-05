import {Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import  { useEffect }  from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from "./Redux/Slices/userSlice";
import UpdateProfile from "./pages/UpdateProfile";


function App() {
  const dispatch = useDispatch();
  const {token} = useSelector( (state) => state.user)
  


  useEffect(() => {
    if(localStorage.getItem("token")){
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(setUser(token))
    }
  }, [dispatch]);

  return (
    <div className="max-w-[1200px] m-auto h-screen ">
        <Header />

        <Routes>
              <Route path="/" element={token ? <HomePage/> : <Navigate to="/auth"/>  } />
              <Route path="/auth" element={!token? <AuthPage /> : <Navigate to="/" /> } />
              <Route path="/update" element={token ? <UpdateProfile/> : <Navigate to="/auth" /> } />
              <Route path="/profile" element={token ? <UserPage /> : <Navigate to="/auth" />} />
              <Route path="/:username" element={token ? <UserPage /> : <Navigate to="/auth" />} />
              <Route path="/:username/post/:pid" element={<PostPage />}/>
        </Routes>
    </div>
  );
}

export default App;
