import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [username, setUsername] = useState('');
  const [roastData, setRoastData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleRoast = async () => {
    if (!username) return;
    setLoading(true);
    setRoastData(null); 

    try {
      const response = await axios.post('https://roast-backend-15fj.onrender.com/api/github', { 
        username: username 
      });
      setRoastData(response.data);
    } catch (error) {
  const errorMessage = error.response?.data?.error || "Something went wrong!";
  alert(errorMessage); 
  console.error(error);
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🔥 Roast My GitHub</h1>
      
      <div className="input-group">
        <input 
          type="text" 
          placeholder="Enter GitHub Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRoast()}
        />
        <button onClick={handleRoast} disabled={loading}>
          {loading ? "Roasting..." : "Roast Me!"}
        </button>
      </div>

      {roastData && (
        <div className="result-card">
          <img src={roastData.avatar} alt="Profile" className="profile-img" />
          <h2>{roastData.name}</h2>
          <p className="stats">@{roastData.username} | ⭐ {roastData.total_stars} Stars | 💻 {roastData.fav_language}</p>
          <div className="roast-box"><p>{roastData.roast}</p></div>
        </div>
      )}

      {/* 2. THIS IS THE UI THAT USES THE LOGIC */}
      <footer style={{ marginTop: '4rem', textAlign: 'center', color: '#888' }}>
        <p style={{ marginBottom: '10px' }}>Made with ❤️ by Dhruv Gupta</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
      <img 
        src="https://visitor-badge.laobi.icu/badge?page_id=dhruv-gupta-dev.roast-my-github" 
        alt="Visitor Counter" 
      />
      </div>
      </footer>
    </div>
  );
}

export default App;