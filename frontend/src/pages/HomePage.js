import { useState, useEffect } from "react";
import axios from "axios";
import { MainPage } from "../components/MainPage";

export const HomePage = () => {
  const [showMainPage, setShowMainPage] = useState(false);
  const [fadeClass, setFadeClass] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/status")
      .then((response) => {
        if (response.status === 200) {
          if (response.data.status === 'Ready') {
            setShowMainPage(true);
            setFadeClass('fade-in');
          } else {
            window.location.href = "/setup";
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        window.location.href = "/setup";
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={`transition-container ${fadeClass}`}>
      <div className={`transition-page-content ${fadeClass}`}>
        {loading && <div className="loading">Loading...</div>}
        {!loading && showMainPage && <MainPage />}
      </div>
    </div>
  );
};
