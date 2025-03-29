import React from "react";
import '../styles/pages/mission-video.css';
import VideosSection from "../components/VideosSection";
function MissionVideo () {
    return (
        <div className="missionVideo-page-container ">
            {/* <Header/> */}
            <div className="missionVideo-page-main-video">
                <VideosSection/>
            </div>
        </div>
    )
}

export default MissionVideo;