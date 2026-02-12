# AAC Sentence Builder - Enhanced Edition

An improved version of the AAC (Augmentative and Alternative Communication) educational app for building sentences through drag-and-drop interactions.

## 🎯 Key Improvements

### 1. **Code Organization**
- **Modular Architecture**: Separated concerns into distinct modules
  - `AudioManager`: Handles all sound effects and music
  - `Speech`: Text-to-speech functionality
  - `GameState`: Centralized state management
  - `ImagePreloader`: Asset loading and caching
  - `DragDropHandler`: Drag-and-drop interactions
  - `Game`: Core game logic
  - `UI`: User interface controls

- **External Files**: Better maintainability
  - `styles.css`: All styling in one place
  - `trials-data.js`: Game content separated from logic
  - `app.js`: Main application code

- **Constants Configuration**: Easy to modify settings
  ```javascript
  const CONFIG = {
      TOTAL_TRIALS: 10,
      HIGH_SCORE_THRESHOLD: 8,
      CELEBRATION_DURATION: 5000,
      // ... more settings
  };
  ```

### 2. **Accessibility Improvements**
- **ARIA Labels**: Proper semantic HTML and ARIA attributes
- **Keyboard Navigation**: 
  - Tab through interactive elements
  - Enter/Space to activate symbols
  - Ctrl+F for fullscreen
  - Ctrl+M to mute/unmute
- **Screen Reader Support**: Descriptive labels and live regions
- **Focus Indicators**: Clear visual feedback for keyboard users

### 3. **User Experience Enhancements**

#### Visual Improvements
- **Progress Bar**: Shows completion status
- **Loading States**: Spinner while images load
- **Smooth Animations**: Fade-in, slide-in effects
- **Drag Feedback**: Visual cues when dragging over drop zone
- **Touch Feedback**: Visual response to touch interactions
- **Responsive Design**: Optimized for mobile and tablet

#### Audio/Sound
- **Volume Control**: Mute/unmute button
- **Better Audio Management**: Stops music when moving to next trial
- **Error Handling**: Graceful fallbacks if audio fails

#### Functionality
- **Auto-save Progress**: Resume where you left off (persists for 1 hour)
- **Image Preloading**: Faster trial transitions
- **Next Trial Preload**: Loads assets in background
- **Better Error Messages**: Clear feedback for users

### 4. **Performance Optimizations**
- **DOM Caching**: Elements referenced once, not repeatedly queried
- **Image Preloading**: Reduces wait times between trials
- **Efficient Event Handling**: Uses event delegation where appropriate
- **Resource Management**: Proper cleanup of audio and images

### 5. **Bug Fixes & Robustness**
- **Error Boundaries**: Try-catch blocks for critical operations
- **Audio Fallbacks**: Handles audio playback failures gracefully
- **Image Loading**: Handles missing images without breaking
- **Data Validation**: Checks trial data structure on load
- **Browser Compatibility**: Better cross-browser support

### 6. **Mobile/Touch Enhancements**
- **Touch-Optimized**: Larger touch targets on mobile
- **DragDropTouch**: Polyfill for touch drag-and-drop
- **Visual Feedback**: Touch-active states
- **Responsive Layout**: Adapts to screen size

## 📁 File Structure

```
aac-app/
├── index_improved.html    # Main HTML file
├── styles.css            # All CSS styles
├── app.js               # Main application logic
├── trials-data.js       # Game content/data
├── images/              # GIF animations
│   ├── dog_smelling.gif
│   ├── girl_running.gif
│   └── ...
├── symbols/             # Symbol images
│   ├── dog.png
│   ├── girl.png
│   └── ...
└── sounds/              # Audio files
    ├── drop.mp3
    ├── celebration_song.mp3
    └── incorrect_answer.mp3
```

## 🚀 How to Use

1. **Setup**: Place all files in the same directory with the correct folder structure
2. **Open**: Launch `index_improved.html` in a web browser
3. **Start**: Click the "START" button to begin
   - The app will automatically enter fullscreen mode (if browser permits)
   - If fullscreen is blocked, you can manually click the fullscreen button
4. **Play**: 
   - Watch the animation
   - Drag the correct "who" and "doing" words to the sentence area
   - Click "Check Answer"
   - Celebration music will play for correct answers and continue until you move to the next trial
   - Continue through all 10 trials
5. **Results**: View your score and performance summary
   - High scores (8+) trigger a celebration animation
   - Celebration music plays completely even after the animation fades

## ⌨️ Keyboard Shortcuts

- **Tab**: Navigate between elements
- **Enter/Space**: Activate buttons, speak symbol text
- **Ctrl+F**: Toggle fullscreen
- **Ctrl+M**: Mute/unmute sounds

## 🎨 Customization

### Changing Number of Trials
Edit `trials-data.js` - add or remove trial objects

### Modifying Styling
Edit `styles.css` - uses CSS variables for easy theming:
```css
:root {
    --primary-color: #3498db;
    --success-color: #2ecc71;
    --danger-color: #e74c3c;
    /* ... more variables */
}
```

### Adjusting Game Settings
Edit `CONFIG` object in `app.js`:
```javascript
const CONFIG = {
    TOTAL_TRIALS: 10,           // Number of trials
    HIGH_SCORE_THRESHOLD: 8,    // Min score for celebration
    CELEBRATION_DURATION: 5000, // Milliseconds
    SPEECH_RATE: 0.9,          // TTS speed
    // ...
};
```

## 🔧 Browser Requirements

- **Modern Browser**: Chrome, Firefox, Safari, Edge (recent versions)
- **JavaScript**: Must be enabled
- **Audio**: Web Audio API support
- **Speech**: Speech Synthesis API (optional, degrades gracefully)

## 📱 Mobile Support

- Fully responsive design
- Touch-optimized controls
- DragDropTouch polyfill for mobile drag-and-drop
- Larger touch targets on small screens

## 🐛 Troubleshooting

### Audio Not Playing
- Click the START button to unlock audio (required by browsers)
- Check volume control (mute button)
- Ensure audio files are in the correct directory

### Images Not Loading
- Verify file paths match exactly
- Check that `images/` and `symbols/` folders exist
- Open browser console for specific errors

### Progress Not Saving
- Check if localStorage is enabled
- Private/incognito mode may prevent saving
- Progress expires after 1 hour

## 📊 Data Structure

Each trial in `trials-data.js` follows this structure:
```javascript
{
    gif: "images/action.gif",        // Animation to show
    correctWho: "The subject",       // Correct subject
    whoImg: "symbols/subject.png",   // Subject image
    correctDoing: "is verb",         // Correct action
    doingImg: "symbols/verb.png",    // Action image
    distWho: "Distractor subject",   // Wrong subject
    distWhoImg: "symbols/dist.png",  // Wrong subject image
    distDoing: "is wrong",           // Wrong action
    distDoingImg: "symbols/wrong.png" // Wrong action image
}
```

## 🎓 Educational Value

This app helps users:
- Build sentence structure understanding
- Practice subject-verb-object patterns
- Develop visual-to-language mapping
- Improve AAC device familiarity
- Enhance communication skills

## 📈 Future Enhancement Ideas

- Difficulty levels (easy/medium/hard)
- Customizable trial sets
- Performance analytics
- Multi-language support
- Custom symbol uploads
- Practice mode (no scoring)
- Timed challenges
- Achievement system

## 📄 License

Educational use permitted. Modify as needed for your specific AAC needs.

## 🤝 Contributing

Suggestions for improvement are welcome! Consider:
- Additional trial content
- UI/UX enhancements
- Accessibility improvements
- Bug fixes
- Performance optimizations

---

**Version**: 2.0 Enhanced Edition  
**Last Updated**: 2024  
**Compatibility**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
