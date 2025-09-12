import React, { useState, useEffect } from 'react';

function App() {
  // Beispiel-Daten
  const [cards] = useState([
    { 
      id: 1, 
      name: 'Anna', 
      age: 25, 
      bio: 'Liebt Reisen und Fotografie',
      image: 'https://images.unsplash.com/photo-1756728207483-cd934b34e360?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    { 
      id: 2, 
      name: 'Maria', 
      age: 28, 
      bio: 'Kaffee-Enthusiastin',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face'
    },
    { 
      id: 3, 
      name: 'Lisa', 
      age: 24, 
      bio: 'Kunstliebhaberin aus München',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face'
    },
    { 
      id: 4, 
      name: 'Sarah', 
      age: 27, 
      bio: 'Outdoor-Abenteuer',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=face'
    },
    { 
      id: 5, 
      name: 'Julia', 
      age: 26, 
      bio: 'Musikerin und Buchliebhaberin',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face'
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState([]);
  const [passes, setPasses] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Swipe nach rechts (Like)
  const handleLike = () => {
    if (currentIndex < cards.length) {
      setLikes([...likes, cards[currentIndex]]);
      setCurrentIndex(currentIndex + 1);
      setDragOffset(0); // NEU: Position zurücksetzen
    }
  };

  // Swipe nach links (Pass)  
  const handlePass = () => {
    if (currentIndex < cards.length) {
      setPasses([...passes, cards[currentIndex]]);
      setCurrentIndex(currentIndex + 1);
      setDragOffset(0); // NEU: Position zurücksetzen
    }
  };

  // Zurücksetzen
  const handleReset = () => {
    setCurrentIndex(0);
    setLikes([]);
    setPasses([]);
    setDragOffset(0);
  };

  // Maus gedrückt - Ziehen startet
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX); // Startposition merken
  };

  // Maus bewegt - Karte mitziehen
  const handleMouseMove = (e) => {
    if (!isDragging) return; // Nur ziehen wenn Maus gedrückt
    
    const deltaX = e.clientX - startX; // Unterschied zur Startposition
    setDragOffset(deltaX);
  };

  // Maus losgelassen - Entscheidung treffen
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Swipe-Schwellwert: 100 Pixel
    if (dragOffset > 100) {
      handleLike(); // Nach rechts = Like
    } else if (dragOffset < -100) {
      handlePass(); // Nach links = Pass
    }
    
    // Position zurücksetzen
    setDragOffset(0);
  };

  // Touch gestartet - wie mouseDown
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX); // touches[0] = erster Finger
  };

  // Touch bewegt - wie mouseMove  
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    e.preventDefault(); // Verhindert Scrollen der Seite
    const deltaX = e.touches[0].clientX - startX;
    setDragOffset(deltaX);
  };

  // Touch beendet - wie mouseUp
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Swipe-Schwellwert: 100 Pixel (gleich wie Mouse)
    if (dragOffset > 100) {
      handleLike();
    } else if (dragOffset < -100) {
      handlePass();
    }
    
    setDragOffset(0);
  };

  const enterFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch(err => {
          console.log('Fullscreen nicht möglich:', err);
        });
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    };
  }, []);

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
      padding: '10px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      height: '100vh', 
      height: '100dvh', // Für neuere Browser
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '20px', 
      position: 'relative', //Für absolute Positionierung der Buttons
      boxSizing: 'border-box',
      overflow: 'hidden', // WICHTIG: Kein Overflow
      maxHeight: '100vh' // Zusätzliche Sicherheit
    }}>      
      {/* Aktuelle Karte */}
      <div style={{
        //border: '2px solid #ddd',
        borderRadius: '15px',
        flex: '1',
        backgroundColor: '#fff',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        position: 'relative',
        
        // Transform für Bewegung und Rotation
        transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.1}deg)`,
        
        // Cursor und User-Select
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        
        // Smooth Transition nur wenn nicht gezogen wird
        transition: isDragging ? 'none' : 'transform 0.3s ease'
      }}
        // Mouse-Events
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Auch wenn Maus das Element verlässt

        // Touch-Events
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd} // Falls Touch abgebrochen wird
      >
        {!isFullscreen && (
          <button
            onClick={enterFullscreen}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            ⛶
          </button>
        )}
        <img 
          src={currentCard.image}
          alt={currentCard.name}
          draggable={false} // Verhindert Standard Dragging des Bildes
          style={{
            width: '100%',
            height: '100%', // 70% der Kartenhöhe
            objectFit: 'cover',
            pointerEvents: 'none' // Verhindert Interaktionen mit dem Bild
          }}
        />

        {/* NEU: Heller Gradient-Overlay unten */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          //height: '120px', // Höhe des Fades
          height: '1px', // Nur 1px hoch
          background: 'white',
          boxShadow: '0 0 60px 60px rgba(255,255,255,0.6), 0 0 120px 80px rgba(255,255,255,0.3)',
          pointerEvents: 'none' // Damit Swipe-Events durchgehen
        }}>
        </div>



        {/* NEU: Swipe-Indikatoren */}
        {dragOffset > 50 && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'green', 
            fontWeight: 'bold',
            fontSize: '18px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '5px 10px',
            borderRadius: '5px'
          }}>
            LIKE! ❤️
          </div>
        )}
        
        {dragOffset < -50 && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            color: 'red', 
            fontWeight: 'bold',
            fontSize: '18px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '5px 10px',
            borderRadius: '5px'
          }}>
            PASS! ❌
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{
        position: 'absolute',
        bottom: '10px', // Über dem Status
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px'
      }}>
        <button 
          onClick={handlePass}
          style={{ 
            width: '60px',
            height: '60px',
            backgroundColor: '#ff4757',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
        >
          ✕
        </button>
        
        <button 
          onClick={handleLike}
          style={{ 
            width: '60px',
            height: '60px',
            backgroundColor: '#2ed573',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
        >
          ♥
        </button>
      </div>
    </div>
  );
}

export default App;