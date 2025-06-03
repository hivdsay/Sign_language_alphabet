const videoElement = document.getElementById('video');
const predictionElement = document.getElementById('prediction');

function distance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getFingers(landmarks) {
  return {
    thumb: landmarks[4].x < landmarks[3].x,
    index: landmarks[8].y < landmarks[6].y,
    middle: landmarks[12].y < landmarks[10].y,
    ring: landmarks[16].y < landmarks[14].y,
    pinky: landmarks[20].y < landmarks[18].y
  };
}

function recognizeLetter(lm) {
  const f = getFingers(lm);

  if (f.thumb && !f.index && !f.middle && !f.ring && !f.pinky) return 'A';
  if (!f.thumb && f.index && f.middle && f.ring && f.pinky) return 'B';
  if (!f.thumb && !f.index && !f.middle && !f.ring && !f.pinky) return 'E';
  if (f.index && f.middle && !f.ring && !f.pinky) return 'U';
  if (f.index && f.middle && f.ring && !f.pinky) return 'W';
  if (f.index && !f.middle && !f.ring && !f.pinky) return 'D';
  if (!f.index && f.middle && !f.ring && !f.pinky) return 'I';
  if (!f.index && f.middle && f.ring && f.pinky) return 'Y';
  if (!f.thumb && f.index && !f.middle && !f.ring && !f.pinky) return 'L';
  if (!f.thumb && !f.index && !f.middle && f.ring && f.pinky) return 'M';
  if (!f.thumb && !f.index && f.middle && f.ring && f.pinky) return 'N';
  if (f.thumb && f.index && !f.middle && !f.ring && !f.pinky) return 'G';
  if (f.thumb && f.index && f.middle && !f.ring && !f.pinky) return 'H';
  if (!f.thumb && f.index && !f.middle && !f.ring && f.pinky) return 'K';
  if (!f.thumb && f.index && !f.middle && f.ring && !f.pinky) return 'V';
  if (f.thumb && !f.index && f.middle && !f.ring && f.pinky) return 'F';
  if (f.thumb && !f.index && f.middle && f.ring && !f.pinky) return 'P';
  if (!f.thumb && f.index && f.middle && !f.ring && f.pinky) return 'R';
  if (f.index && !f.middle && !f.ring && f.pinky) return 'X';
  if (!f.thumb && !f.index && f.middle && !f.ring && f.pinky) return 'Q';
  if (!f.thumb && f.index && f.middle && !f.ring && !f.pinky) return 'T';
  if (!f.thumb && !f.index && f.middle && f.ring && !f.pinky) return 'S';
  if (f.thumb && f.index && !f.middle && f.ring && f.pinky) return 'O';
  if (f.thumb && !f.index && !f.middle && f.ring && f.pinky) return 'C';

  return '-';
}

const hands = new Hands({
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.5
});

hands.onResults(results => {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const letter = recognizeLetter(results.multiHandLandmarks[0]);
    predictionElement.innerText = `Detected: ${letter}`;
  } else {
    predictionElement.innerText = 'Detecting...';
  }
});

const camera = new Camera(videoElement, {
  onFrame: async () => await hands.send({ image: videoElement }),
  width: 640,
  height: 480
});
camera.start();
