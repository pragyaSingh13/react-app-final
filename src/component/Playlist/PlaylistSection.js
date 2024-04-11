import React, { useState } from "react";
import "./PlaylistSection.css";
import { Tooltip } from "antd";
function Playlist({
  playlist,
  setPlaylist,
  currentVideoIndex,
  handlePlaylistItemClick,
  playNextVideo,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [autoplay, setAutoplay] = useState(false);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    const droppedIndex = e.dataTransfer.getData("index");
    if (droppedIndex !== index) {
      const newPlaylist = Array.from(playlist);
      const [removed] = newPlaylist.splice(droppedIndex, 1);
      newPlaylist.splice(index, 0, removed);
      setPlaylist(newPlaylist);
    }
  };

  const filteredPlaylist = playlist.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAutoplayToggle = () => {
    setAutoplay(!autoplay);
  };

  const handleDescriptionDisplay = (description) => {
    if (description && description.length > 30) {
      return description.substring(0, 30) + "...";
    }
    return description;
  };

  return (
    <div className="playlist" style={{ border: "2px solid hsl(4, 93%, 47%)" }}>
      <h2 className="playlist-title">Playlist</h2>
      <input
        type="text"
        className="search-input"
        placeholder="Search videos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="playlist-items">
        {filteredPlaylist.map((video, index) => (
          <div
            key={video.id}
            onClick={() => handlePlaylistItemClick(index)}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, index)}
            draggable
            className={
              "playlist-item " + (index === currentVideoIndex ? "active" : "")
            }
          >
            <div className="thumbnail-container">
              <img src={video.thumb} alt="Thumbnail" className="thumbnail" />
            </div>
            <div className="video-details">
              <h3 className="video-title">{video.title}</h3>
              <Tooltip title={video.description}>
                <p className="video-description">
                  {handleDescriptionDisplay(video.description)}
                </p>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlist;
