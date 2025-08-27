import React, { useState } from 'react';

function App() {
  // Beispiel-Daten
  const [cards] = useState([
    { id: 1, name: 'Anna', age: 25, bio: 'Liebt Reisen und Fotografie' },
    { id: 2, name: 'Maria', age: 28, bio: 'Kaffee-Enthusiastin' },
    { id: 3, name: 'Lisa', age: 24, bio: 'Kunstliebhaberin aus München' },
    { id: 4, name: 'Sarah', age: 27, bio: 'Outdoor-Abenteuer' },
    { id: 5, name: 'Julia', age: 26, bio: 'Musikerin und Buchliebhaberin' },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState([]);
  const [passes, setPasses] = useState([]);

  // Swipe nach rechts (Like)
  const handleLike = () => {
    if (currentIndex < cards.length) {
      setLikes([...likes, cards[currentIndex]]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Swipe nach links (Pass)  
  const handlePass = () => {
    if (currentIndex < cards.length) {
      setPasses([...passes, cards[currentIndex]]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Zurücksetzen
  const handleReset = () => {
    setCurrentIndex(0);
    setLikes([]);
    setPasses([]);
  };

  // Alle Karten durchgesehen
  if (currentIndex >= cards.length) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>
          🎉 Alle Karten durchgesehen!
        </h2>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '20px', 
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'inline-block'
        }}>
          <p style={{ margin: '10px 0', fontSize: '18px' }}>
            ❤️ Likes: {likes.length}
          </p>
          <p style={{ margin: '10px 0', fontSize: '18px' }}>
            ❌ Passes: {passes.length}
          </p>
        </div>
        
        <div>
          <button 
            onClick={handleReset}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            🔄 Neu starten
          </button>
        </div>

        {/* Zeige Matches */}
        {likes.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h3>Deine Matches:</h3>
            {likes.map(card => (
              <div key={card.id} style={{ 
                backgroundColor: '#e8f5e8', 
                padding: '10px', 
                margin: '5px',
                borderRadius: '5px' 
              }}>
                {card.name}, {card.age}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>
        💕 Swipe App
      </h1>
      
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Klicke Like oder Pass
      </p>
      
      {/* Aktuelle Karte */}
      <div style={{
        border: '2px solid #ddd',
        borderRadius: '15px',
        padding: '30px 20px',
        margin: '20px auto',
        backgroundColor: '#fff',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>
          {currentCard.name}, {currentCard.age}
        </h2>
        <p style={{ margin: '0', color: '#666', fontSize: '16px' }}>
          {currentCard.bio}
        </p>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: '30px' }}>
        <button 
          onClick={handlePass}
          style={{ 
            padding: '15px 25px', 
            margin: '0 10px',
            backgroundColor: '#ff4757',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          ❌ Pass
        </button>
        
        <button 
          onClick={handleLike}
          style={{ 
            padding: '15px 25px', 
            margin: '0 10px',
            backgroundColor: '#2ed573',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          ❤️ Like
        </button>
      </div>

      {/* Status */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px'
      }}>
        <p style={{ margin: '5px 0', color: '#666' }}>
          Karte {currentIndex + 1} von {cards.length}
        </p>
        <p style={{ margin: '5px 0', color: '#666' }}>
          Likes: {likes.length} | Passes: {passes.length}
        </p>
      </div>
    </div>
  );
}

export default App;