import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [username, setUsername] = useState('');
  const [roastData, setRoastData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Counter logic
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const hasVisited = localStorage.getItem("has_visited_roast_app");
    if (!hasVisited) {
      fetch("https://api.counterapi.dev/v1/dhruv-gupta-roast/roast-app/up")
        .then(res => res.json()).then(data => setVisitCount(data.count));
      localStorage.setItem("has_visited_roast_app", "true");
    } else {
      fetch("https://api.counterapi.dev/v1/dhruv-gupta-roast/roast-app")
        .then(res => res.json()).then(data => setVisitCount(data.count));
    }
  }, []);
  // END Counter logic

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
      console.error(error);
      alert("Something went wrong! Check the console.");
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

      {/*THIS IS THE COUNTER UI THAT USES THE LOGIC */}
      <footer style={{ marginTop: '4rem', textAlign: 'center', color: '#888' }}>
        <p style={{ marginBottom: '10px' }}>Made with ❤️ by Dhruv Gupta</p>
        <div style={{ 
          display: 'inline-block', padding: '5px 15px', background: '#1a1a1a', 
          borderRadius: '20px', border: '1px solid #333', fontSize: '0.9rem'
        }}>
          👀 {visitCount > 0 ? visitCount : "..."} Unique Views
        </div>
      </footer>
    </div>
  );
}

export default App;