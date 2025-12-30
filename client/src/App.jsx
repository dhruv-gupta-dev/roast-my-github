import { useState } from 'react';
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
//  NEW LIVE CONNECTION:
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
          <img 
            src={roastData.avatar} 
            alt="Profile" 
            className="profile-img"
          />
          <h2>{roastData.name}</h2>
          <p className="stats">@{roastData.username} | ⭐ {roastData.total_stars} Stars | 💻 {roastData.fav_language}</p>
          
          <div className="roast-box">
            <p>{roastData.roast}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;