import './App.css';
import { useRef, useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import PulseLoader from "react-spinners/PulseLoader";
import { Howl } from 'howler';
import initReactFastclick from 'react-fastclick';
import beachSoundFile from './audio/beach.mp3';
import introSoundFile from './audio/whoosh.mp3';
import clickSoundFile from './audio/click.mp3';


export default function App() {
  const [canvasDisplayed, setCanvasDisplayed] = useState(false);
  const [showBackground, setShowBackground] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const startScene = useRef();

  var beachSound = new Howl({
    src: [beachSoundFile],
    volume: 0.3,
    loop: true
  });

  var introSound = new Howl({
    src: [introSoundFile],
    volume: 0.5
  });

  var clickSound = new Howl({
    src: [clickSoundFile],
    volume: 0.5
  });

  useEffect(() => {
    // Function to check if the canvas element has display: block every second
    function observeCanvasDisplay() {
      // Get all canvas elements on the page
      const canvasElements = document.getElementsByTagName('canvas');

      // Loop through each canvas element
      for (const canvas of canvasElements) {
        // Check if the canvas has display: block
        const style = window.getComputedStyle(canvas);
        if (style.getPropertyValue('display') === 'block') {
          console.log('Canvas finished loading');
          const canvas = document.querySelector('canvas');
          const parentDiv = canvas.parentNode;
          parentDiv.style.display = 'none';
          // Set canvasDisplayed state to true
          setIsLoading(false);
          setCanvasDisplayed(true);
          initReactFastclick();
          // Stop observing once the condition is met
          return;
        }
      }
      // If the condition is not met, set canvasDisplayed state to false
      setCanvasDisplayed(false);
      // Call setTimeout recursively to check again after 1 second
      setTimeout(observeCanvasDisplay, 1000);
    }

    // Start observing the canvas display
    observeCanvasDisplay();

    // Clean up the observer when the component unmounts
    return () => clearTimeout(observeCanvasDisplay);
  }, []);

  function onLoad(spline) {
    const startObj = spline.findObjectById('229e8cc6-b2a9-4551-9672-dedcd9cb8961');
    startScene.current = startObj;
  }

  function showCanvas() {
    const canvas = document.querySelector('canvas');
    const parentDiv = canvas.parentNode;
    parentDiv.style.display = 'block';

    startScene.current.emitEvent('mouseUp');
    setShowBackground(false);
  }

  function handleClick() {
    clickSound.play();
    introSound.play();
    beachSound.play();
    showCanvas();
  }

  return (
    <>
      {showBackground && (
        <div className="background">

          {isLoading && (
            <div className="loader">
              <PulseLoader
                color={"#A3D5FF"}
                size={30}
                margin={15}
                speedMultiplier={0.75}
              />
            </div>
          )}
          <div
            className="startBtn-container"
            style={{ display: canvasDisplayed ? 'flex' : 'none' }}
            >
            <button
              type="button"
              id="start"
              onClick={handleClick}
            >
              START
            </button>
            <p
              id="soundText"
            >
              Turn on the sound for the full experience.
            </p>
          </div>
        </div>
      )}
      <Spline
        scene="https://prod.spline.design/ksJvWp2rq3GX7Gjd/scene.splinecode"
        loading="eager"
        onLoad={onLoad}
      />
    </>
  );
}