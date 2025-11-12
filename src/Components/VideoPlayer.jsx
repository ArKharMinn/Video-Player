import React, { useRef, useState, useEffect } from "react";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
    }
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play();
    setIsPlaying(!isPlaying);
  };

  const skipTime = (seconds) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(
      Math.max(0, video.currentTime + seconds),
      video.duration
    );
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    videoRef.current.volume = vol;
    setVolume(vol);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const seekTime = (e.target.value / 100) * video.duration;
    video.currentTime = seekTime;
    setProgress(e.target.value);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    setDuration(video.duration);
  };

  const formatTime = (time) => {
    if (!time) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">🎬 Video Player</h2>

      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 mb-6"
      />

      {videoSrc && (
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full rounded-xl bg-black"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />

            {/* Play/Pause overlay */}
            <button
              onClick={togglePlayPause}
              className="absolute inset-0 m-auto w-16 h-16 bg-blue-500/80 hover:bg-blue-600/90 rounded-full flex items-center justify-center text-white text-3xl transition"
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>
          </div>

          {/* Skip and Play/Pause */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => skipTime(-10)}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
            >
              « 10s
            </button>
            <button
              onClick={togglePlayPause}
              className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={() => skipTime(10)}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
            >
              10s »
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center space-x-4">
            <label className="whitespace-nowrap">Volume:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 rounded-lg accent-blue-500"
            />
            <span>{Math.round(volume * 100)}%</span>
          </div>

          {/* Progress with time display */}
          <div className="flex items-center space-x-2">
            <span>{formatTime(videoRef.current?.currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="flex-1 h-2 rounded-lg accent-blue-500"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
