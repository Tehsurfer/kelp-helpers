import React from 'react';

function ReefRescueGame() {
  return (
    <div style={{ width: '100%', padding: 0, overflow: 'hidden' }}>
      <h2>Reef Rescue Game</h2>
      <iframe
        src="https://reef-rescue-ae3ffd7f3d53.herokuapp.com/"
        title="Reef Rescue Game"
        width="100%"
        height="700"
        overflow="hidden"
        frameBorder="0"
        scrolling="no"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        style={{ border: '1px solid #ccc', borderRadius: 8 }}
        allowFullScreen
      />
    </div>
  );
}

export default ReefRescueGame;
