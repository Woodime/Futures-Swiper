import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';

function App() {

  
  const getUserId = () => {
    let userId = localStorage.getItem('swipeAppUserId');
    if (!userId) {
      // Einfache UUID generieren
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('swipeAppUserId', userId);
    }
    return userId;
  };

  // Helper-Funktionen für localStorage
  const saveChoicesToStorage = (choices) => {
    try {
      localStorage.setItem('swipeAppChoices', JSON.stringify(choices));
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    }
  };

  const loadChoicesFromStorage = () => {
    try {
      const saved = localStorage.getItem('swipeAppChoices');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Fehler beim Laden:', error);
      return [];
    }
  };


  // Firestore-Funktionen
  const saveChoiceToFirestore = async (choice) => {
    try {
      await addDoc(collection(db, 'choices'), {
        ...choice,
        userId: getUserId(), 
        createdAt: new Date(),
        userAgent: navigator.userAgent.substring(0, 100) // Kurzer User-Agent
      });
      console.log('Choice saved to Firestore');
    } catch (error) {
      console.error('Fehler beim Speichern in Firestore:', error);
    }
  };


  
  const importChoices = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        setChoicesMade(imported);
        saveChoicesToStorage(imported);
      } catch (error) {
        alert('Fehler beim Importieren der Datei');
      }
    };
    reader.readAsText(file);
  };



  // Beispiel-Daten
  const [cards] = useState([
    { 
      id: 1, 
      image: '/assets/images/questions/Wagen02.jpg',
      option_left: {
        text: 'Eigener Wagen',
        image: '/assets/images/options/EigenerWagen.jpg',
        color: '#F1EADC'
      },
      option_right: {
        text: 'Gemeinsames Fahrzeug',
        image: '/assets/images/options/GemeinsamesFahrzeug.jpg',
        color: '#F1EADC'
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
    { 
      id: 3, 
      image: '/assets/images/questions/SchnellOderBewusst.jpg',
      option_left: {
        text: 'Schnell',
        image: '/assets/images/options/SchnellOderBewusst_schnell.jpg',
        color: '#E16D54'
      },
      option_right: {
        text: 'Bewusst',
        image: '/assets/images/options/SchnellOderBewusst_bewusst.jpg',
        color: '#432774'
      }
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [choicesMade, setChoicesMade] = useState(() => {
    // Lade gespeicherte Choices beim App-Start
    return loadChoicesFromStorage();
  });

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Swipe/Click nach links = Option 1 / option_left
  const handleOptionLeft = async () => {
    const choice = {
      card: cards[currentIndex],
      chosenOption: cards[currentIndex].option_left,
      timestamp: new Date().toISOString() 
    };
    const newChoices = [...choicesMade, choice];
    setChoicesMade(newChoices);

    // Speichern lokal und in Firestore
    saveChoicesToStorage(newChoices);
    await saveChoiceToFirestore(choice);

    setCurrentIndex(currentIndex + 1);
    setDragOffset(0);
  };

  // Swipe/Click nach rechts = Option 2 / option_right
  const handleOptionRight = async () => {
    const choice = {
      card: cards[currentIndex],
      chosenOption: cards[currentIndex].option_right,
      timestamp: new Date().toISOString() 
    };
    const newChoices = [...choicesMade, choice];
    setChoicesMade(newChoices);

    // Speichern lokal und in Firestore
    saveChoicesToStorage(newChoices);
    await saveChoiceToFirestore(choice);


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

  

  const exportChoices = () => {
    const dataStr = JSON.stringify(choicesMade, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'swipe-app-choices.json';
    link.click();
    
    URL.revokeObjectURL(url);
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

  // Alle Bilder Laden
  useEffect(() => {
    const preloadImages = async () => {
      const imageUrls = [];
      cards.forEach(card => {
        imageUrls.push(card.image);
        imageUrls.push(card.option_left.image);
        imageUrls.push(card.option_right.image);
      });

      let loadedImages = 0;
      const totalImages = imageUrls.length;

      const loadImage = (url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            loadedImages++;
            setLoadingProgress(Math.round((loadedImages / totalImages) * 100));
            resolve();
          };
          img.onerror = () => {
            console.error('Fehler beim Laden des Bildes:', url);
            loadedImages++;
            setLoadingProgress(Math.round((loadedImages / totalImages) * 100));
            resolve(); // Auch bei Fehler auflösen, damit Promise.all nicht hängen bleibt
          };
          img.src = url;
        });
      };

      await Promise.all(imageUrls.map(url => loadImage(url)));

      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };

    preloadImages();
  }, [cards]);

  let currentCard = cards[currentIndex];

  if (!currentCard) {
    currentCard = cards[0];
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        fontFamily: '"Patrick Hand", cursive'
      }}>
        <div style={{
          fontSize: '32px',
          marginBottom: '20px',
          color: '#333'
        }}>
          Loading...
        </div>
        <div style={{
          width: '200px',
          height: '8px',
          backgroundColor: '#ddd',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${loadingProgress}%`,
            height: '100%',
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{
          marginTop: '10px',
          fontSize: '18px',
          color: '#666'
        }}>
          {loadingProgress}%
        </div>
      </div>
    );
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

        {/* Preload Images */}
        <div style={{ display: 'none' }}>
          <img src={currentCard.option_left.image} alt="preload" />
          <img src={currentCard.option_right.image} alt="preload" />
        </div>

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
            padding: '5px',
            backgroundColor: currentCard.option_left.color,
            borderRadius: '25px',
          }}>
            <img 
              src={currentCard.option_left.image}
              alt={currentCard.option_left.text}
              style={{
                height: '70px',
                borderRadius: '20px',
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
            padding: '5px',
            backgroundColor: currentCard.option_right.color,
            borderRadius: '25px',
          }}>
            <img 
              src={currentCard.option_right.image}
              alt={currentCard.option_right.text}
              style={{
                height: '70px',
                borderRadius: '20px',
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