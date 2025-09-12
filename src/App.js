import React, { useState, useEffect } from 'react';

function App() {
  // Beispiel-Daten
  const [cards] = useState([
    { 
      id: 1, 
      image: '/assets/images/questions/RuhigOderLebendigExtended02.jpg',
      option_left: {
        text: 'Gemeinsames Auto',
        image: '/assets/images/options/RuhigOderLebendig_slow.jpg',
        color: '#F2F2F2'
      },
      option_right: {
        text: 'Eigenes Auto',
        image: '/assets/images/options/RuhigOderLebendig_lively.jpg',
        color: '#F2F2F2'
      }
    },
    { 
      id: 2, 
      image: '/assets/images/questions/RuhigOderLebendigExtended02.jpg',
      option_left: {
        text: 'Ruhig',
        image: '/assets/images/options/RuhigOderLebendig_slow.jpg',
        color: '#E4B081'
      },
      option_right: {
        text: 'Lebendig',
        image: '/assets/images/options/RuhigOderLebendig_lively.jpg',
        color: '#FBAC4F'
      }
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [choicesMade, setChoicesMade] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Swipe/Click nach links = Option 1 / option_left
  const handleOptionLeft = () => {
    const choice = {
      card: cards[currentIndex],
      chosenOption: cards[currentIndex].option_left
    };
    setChoicesMade([...choicesMade, choice]);
    setCurrentIndex(currentIndex + 1);
    setDragOffset(0);
  };

  // Swipe/Click nach rechts = Option 2 / option_right
  const handleOptionRight = () => {
    const choice = {
      card: cards[currentIndex],
      chosenOption: cards[currentIndex].option_right
    };
    setChoicesMade([...choicesMade, choice]);
    setCurrentIndex(currentIndex + 1);
    setDragOffset(0);
  };

  // Zurücksetzen
  const handleReset = () => {
    setCurrentIndex(0);
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
      handleOptionRight(); // Nach rechts
    } else if (dragOffset < -100) {
      handleOptionLeft(); // Nach links
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
    
    // Swipe-Schwellwert: 100 Pixel
    if (dragOffset > 100) {
      handleOptionRight(); // Nach rechts
    } else if (dragOffset < -100) {
      handleOptionLeft(); // Nach links
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

  useEffect(() => {
    if (currentIndex >= cards.length && cards.length > 0) {
      handleReset(); // Automatischer Reset
    }
  }, [currentIndex, cards.length]);

  let currentCard = cards[currentIndex];

  if (!currentCard) {
    currentCard = cards[0];
  }


  return (
    <div style={{ 
      padding: '10px', 
      textAlign: 'center',
      fontFamily: '"Patrick Hand", cursive !important', 
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
        borderRadius: '15px',
        flex: '1',
        backgroundColor: '#fff',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        position: 'relative',

        width: '100%',
        maxWidth: '614px',
        margin: '0 auto', // Zentrieren

        
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

        {/* Kartenbild */}
        <img 
          src={currentCard.image}
          alt={currentCard.name}
          draggable={false} // Verhindert Standard Dragging des Bildes
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none' // Verhindert Interaktionen mit dem Bild
          }}
        />

        {/* Heller Gradient-Overlay unten */}
        <div style={{
          position: 'absolute',
          bottom: '-1px', // Leicht überlappend
          left: '0',
          right: '0',
          height: '1px', // Nur 1px hoch
          background: 'white',
          boxShadow: '0 0 60px 60px rgba(255,255,255,0.6), 0 0 120px 80px rgba(255,255,255,0.3)',
          pointerEvents: 'none', // Damit Swipe-Events durchgehen
          visibility: 'hidden'
        }}>
        </div>

        {/* Swipe-Indikatoren */}
        {dragOffset < -50 && ( // links swipen
          <div style={{
            position: 'absolute',
            top: '60px',
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            transform: 'rotate(45deg)',
          }}>
            <img 
              src={currentCard.option_left.image}
              alt={currentCard.option_left.text}
              style={{
                height: '70px',
                borderRadius: '25px',
                border: `5px solid ${currentCard.option_left.color}`,
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>
        )}

        {dragOffset > 50 && ( // rechts swipen
          <div style={{
            position: 'absolute',
            top: '60px',
            left: '20px',
            display: 'flex',
            alignItems: 'center',
            transform: 'rotate(-45deg)',
          }}>
            <img 
              src={currentCard.option_right.image}
              alt={currentCard.option_right.text}
              style={{
                height: '70px',
                borderRadius: '25px',
                border: `5px solid ${currentCard.option_right.color}`, 
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{
        position: 'absolute',
        bottom: '10px', // Über dem Status
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'grid', // Grid statt flex
        gridTemplateColumns: '1fr 1fr', // Gleich breite Spalten
        gap: '20px',
        fontSize: '16px', // Etwas größer für bessere Lesbarkeit
        fontFamily: '"Patrick Hand", cursive',
        width: 'auto',
        maxWidth: '1000px',
      }}>
        {/* Linke Option Button */}
        <button 
          onClick={handleOptionLeft}
          style={{
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', 
            padding: '15px',
            gap: '8px',
            backgroundColor: currentCard.option_left.color,
            fontFamily: '"Patrick Hand", cursive',
            fontSize: '24px'  
          }}
        >
          <span>{currentCard.option_left.text}</span>
        </button>
        
        {/* Rechte Option Button */}
        <button 
          onClick={handleOptionRight}
          style={{
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', 
            padding: '15px',
            gap: '8px',
            backgroundColor: currentCard.option_right.color,
            fontFamily: '"Patrick Hand", cursive',
            fontSize: '24px' 
          }}
        >
          <span>{currentCard.option_right.text}</span>
        </button>
      </div>
    </div>
  );
}

export default App;