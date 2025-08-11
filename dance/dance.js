import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Play, Pause, Download, Plus, Ruler } from 'lucide-react';
import { motion } from 'framer-motion';

const STAGE_WIDTH = 800;
const STAGE_HEIGHT = 400;
const DOT_SIZE = 24;
const COLORS = [
  '#ff4d4f', '#40a9ff', '#73d13d', '#9254de', '#fa8c16', '#ff85c0', '#36cfc9'
];

function Choreographer() {
  const [dancers, setDancers] = useState([
    { id: 1, color: COLORS[0], positions: { 0: { x: 100, y: 100 } } },
  ]);
  const [audio, setAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showRulers, setShowRulers] = useState(true);
  const stageRef = useRef(null);
  const animationFrame = useRef(null);

  useEffect(() => {
    return () => cancelAnimationFrame(animationFrame.current);
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newAudio = new Audio(url);
    newAudio.onloadedmetadata = () => setDuration(newAudio.duration);
    setAudio(newAudio);
  };

  const togglePlay = () => {
    if (!audio) return;
    if (!playing) {
      audio.currentTime = currentTime;
      audio.play();
      animateTime();
    } else {
      audio.pause();
      cancelAnimationFrame(animationFrame.current);
    }
    setPlaying(!playing);
  };

  const animateTime = () => {
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    animationFrame.current = requestAnimationFrame(animateTime);
  };

  const addDancer = () => {
    const id = dancers.length + 1;
    const color = COLORS[(id - 1) % COLORS.length];
    const baseTime = Math.floor(currentTime);
    setDancers((prev) => [
      ...prev,
      {
        id,
        color,
        positions: {
          [baseTime]: { x: 100 + id * 20, y: 100 + id * 20 },
        },
      },
    ]);
  };

  const timeKeyFor = (t) => Math.floor(t);

  const getPositionAtTime = (dancer, t) => {
    const keys = Object.keys(dancer.positions).map(Number).sort((a, b) => a - b);
    for (let i = keys.length - 1; i >= 0; i--) {
      if (keys[i] <= Math.floor(t)) return dancer.positions[keys[i]];
    }
    return null;
  };

  const updatePosition = (id, x, y) => {
    const timeKey = timeKeyFor(currentTime);
    setDancers((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, positions: { ...d.positions, [timeKey]: { x, y } } }
          : d
      )
    );
  };

  const downloadMP4 = () => {
    alert('Export to MP4 requires server-side rendering or ffmpeg integration.');
  };

  return (
    <div className="relative min-h-screen">
      <h1 className="text-3xl font-bold p-4 max-w-screen-lg mx-auto">
        Budget Arrangeus - Choreographer
      </h1>

      {/* Toolbar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t z-50 px-4 py-2 flex flex-wrap justify-center gap-2 shadow-xl">
        <Input type="file" accept="audio/*" onChange={handleUpload} className="w-40" />
        <Button onClick={togglePlay} disabled={!audio}>
          {playing ? <Pause /> : <Play />}
        </Button>
        <Button onClick={addDancer}><Plus className="mr-1" /> Add Dancer</Button>
        <Button onClick={downloadMP4}><Download className="mr-1" /> Export MP4</Button>
        <Button onClick={() => setShowRulers(!showRulers)}><Ruler className="mr-1" />Toggle Rulers</Button>
      </div>

      <div className="p-4 max-w-screen-lg mx-auto pb-24">
        {/* Timeline */}
        <div className="mb-4">
          <label className="text-sm font-medium">Timeline (Seconds)</label>
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={([val]) => {
              setCurrentTime(val);
              if (audio) audio.currentTime = val;
            }}
          />
          <div className="text-xs text-gray-600 mt-1">
            Current Time: {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
          </div>
        </div>

        {/* Stage */}
        <div
          ref={stageRef}
          className="relative border mt-6 rounded-xl bg-gray-100 overflow-hidden"
          style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT }}
        >
          {showRulers && (
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
          )}

          <div className="absolute top-1 left-2 text-xs font-semibold">Backstage</div>
          <div className="absolute bottom-1 left-2 text-xs font-semibold">Audience</div>

          {dancers.map((dancer) => {
            const pos = getPositionAtTime(dancer, currentTime);
            if (!pos) return null;
            return (
              <motion.div
                key={dancer.id}
                className="absolute rounded-full cursor-pointer"
                style={{
                  width: DOT_SIZE,
                  height: DOT_SIZE,
                  backgroundColor: dancer.color,
                }}
                animate={{
                  x: pos.x - DOT_SIZE / 2,
                  y: pos.y - DOT_SIZE / 2,
                }}
                transition={{ duration: 0.25 }}
                drag
                dragMomentum={false}
                onDrag={(e, info) => {
                  const bounds = stageRef.current?.getBoundingClientRect?.() || { left: 0, top: 0 };
                  const x = info.point.x - bounds.left;
                  const y = info.point.y - bounds.top;
                  updatePosition(dancer.id, x, y);
                }}
                onDragEnd={(e, info) => {
                  const bounds = stageRef.current?.getBoundingClientRect?.() || { left: 0, top: 0 };
                  const x = info.point.x - bounds.left;
                  const y = info.point.y - bounds.top;
                  updatePosition(dancer.id, x, y);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Mount React component into HTML
ReactDOM.createRoot(document.getElementById('root')).render(<Choreographer />);
