import React, { useState, useEffect, useRef } from "react";
import "./VideoPlayer.css";
import { Row, Col, Slider, Switch } from "antd";
import {
  PauseCircleFilled,
  PlayCircleFilled,
  FullscreenOutlined,
} from "@ant-design/icons";
import Playlist from "../Playlist/PlaylistSection";
import thumnail1 from "../../assets/thumbnails/thumbnail1.jpeg";
import thumnail2 from "../../assets/thumbnails/thumbnail2.jpeg";
import thumnail3 from "../../assets/thumbnails/thumbnail3.jpeg";

function VideoPlayer() {
  const [playlist, setPlaylist] = useState([
    {
      id: 1,
      title: "Big Buck Bunny",
      thumb: thumnail1,
      src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      description:
        "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain't ",
    },
    {
      id: 2,
      title: "The first Blender",
      thumb: thumnail2,
      src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      description: "The first Blender Open Movie from 2006",
    },
    {
      id: 3,
      title: "HBO GO now works",
      thumb: thumnail3,
      src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      description:
        "HBO GO now works with Chromecast -- the easiest way to enjoy online video on your TV. For when you want to settle into your Iron Throne ",
    },
  ]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const videoRef = useRef(null);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
        videoElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      };
    }
  }, []);

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const playNextVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === playlist.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSpeedChange = (value) => {
    setSpeed(value);
    if (videoRef.current) {
      videoRef.current.playbackRate = value;
    }
  };

  const handleVideoEnd = () => {
    if (autoplay) {
      playNextVideo();
    }
  };

  const handlePlaylistItemClick = (index) => {
    if (videoRef.current) {
      videoRef.current.pause();
    }

    setCurrentVideoIndex(index);

    setIsPlaying(false);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play();
      }
    }, 1);
  };

  const handleSeek = (value) => {
    setCurrentTime(value);
    videoRef.current.currentTime = value;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
  };

  const handleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  const handleAutoplayToggle = () => {
    setAutoplay(!autoplay);
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh", backgroundColor: "black" }}
    >
      <Col span={18}>
        <div className="video-container">
          <video
            ref={videoRef}
            src={playlist[currentVideoIndex].src}
            autoPlay={autoplay}
            onEnded={handleVideoEnd}
          />
        </div>
        <Row style={{ width: "100%", border: "2px solid hsl(4, 93%, 47%)" }}>
          <Row style={{ width: "100%", border: "2px solid hsl(4, 93%, 47%)" }}>
            <Col span={22}>
              <Slider
                min={0}
                max={duration}
                step={1}
                value={currentTime}
                onChange={handleSeek}
              />
            </Col>
            <Col span={2} style={{ marginTop: "7px", paddingLeft: "17px" }}>
              <span style={{ color: "white", fontSize: "17px" }}>
                {formatTime(currentTime)}
              </span>
              {" / "}
              <span style={{ color: "white", fontSize: "17px" }}>
                {formatTime(duration)}
              </span>
            </Col>
          </Row>
          <Row style={{ width: "100%" }}>
            <Col span={1}>
              <div style={{ fontSize: "40px" }}>
                {isPlaying ? (
                  <PauseCircleFilled
                    onClick={handlePlayPause}
                    style={{ color: "white" }}
                  />
                ) : (
                  <PlayCircleFilled
                    onClick={handlePlayPause}
                    style={{ color: "white" }}
                  />
                )}
              </div>
            </Col>
            <Col span={3}>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
              />
            </Col>
            <Col span={18}>
              <FullscreenOutlined
                onClick={handleFullScreen}
                style={{
                  fontSize: "30px",
                  marginTop: "8px",
                  marginLeft: "5px",
                  color: "white",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              />
            </Col>
            <Col span={1}>
              <Switch
                checked={autoplay}
                onChange={handleAutoplayToggle}
                checkedChildren="Autoplay"
                unCheckedChildren="Autoplay"
                style={{
                  color: "white",
                  marginTop: "9px",
                  marginLeft: "36px",
                }}
              />
            </Col>
          </Row>
        </Row>
      </Col>
      <Col span={5}>
        <Playlist
          playlist={playlist}
          setPlaylist={setPlaylist}
          currentVideoIndex={currentVideoIndex}
          handlePlaylistItemClick={handlePlaylistItemClick}
          playNextVideo={playNextVideo}
        />
      </Col>
    </Row>
  );
}

export default VideoPlayer;
