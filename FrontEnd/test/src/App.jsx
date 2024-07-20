// src/App.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './features/auth/authSlice';
import axiosInstance from './api/axios';

function App() {
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector(state => state.auth);

  useEffect( () => {
    const handleLogin = async () => {
      await dispatch(login({ username: 'username', password: 'password' }));
    };
    handleLogin();
  }, [dispatch]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('http://localhost:5000/v1/api/');
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  return (
    <div>
      <h1>React JWT Auth</h1>
      {accessToken ? (
        <div>
          <button onClick={fetchData}>Fetch Protected Data</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
