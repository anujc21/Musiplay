import React, {useState, useEffect, useRef} from "react";
import notify from "./notify.jsx";

const youtube = window.YT;

function Player({currentAudio, setCurrentAudio, audios, searchInputRef, setPage, playlists, setPlaylists, currentPlaylist}){
	const randomNumber = (min, max) => {
		return (Math.floor(Math.random() * (max - min + 1) + min));
	};

	const [playing, setPlaying] = useState(false);

	const [playlistOptions, setPlaylistOptions] = useState(false);

	const [playbackState, setPlaybackState] = useState("shuffle");

	const [playerEndState, setPlayerEndState] = useState(false);

	const [upNextOpen, setUpNextOpen] = useState(window.innerWidth > 600 ? true : false);

	const [nextSong, setNextSong] = useState(audios.length > 1 ? audios.filter(audio => audio.id.videoId !== currentAudio.id.videoId)[randomNumber(0, audios.length - 2)] : audios[0]);

	const audioPlayer = useRef();

	const progressRef = useRef();

	const progressBarRef = useRef();

	const thumbnailBoxRef = useRef();

	const playlistOptionsBoxRef = useRef();

	const upNextRef = useRef();

	const upNextClick = () => {
		if (upNextOpen){
			setUpNextOpen(false);
		}
		else{
			setUpNextOpen(true);
		}
	};

	const undoClick = () => {
		setCurrentAudio(null);

		if (currentPlaylist){
			setPage("playlist");
		}
		else{
			setPage("audios");
		}
	};

	const favoriteClick = () => {
		setPlaylistOptions(true);
	};

	const playlistCancelClick = () => {
		playlistOptionsBoxRef.current.classList.add("playlistOptionsBoxClosed");

		playlistOptionsBoxRef.current.onanimationend = () => {
			if (event.animationName === "playlistOptionsBoxClose"){
				playlistOptionsBoxRef.current.classList.remove("playlistOptionsBoxClosed");

				setPlaylistOptions(false);
			}
		};
	};

	const progressClick = (event) => {
		const progressBox = progressRef.current.getBoundingClientRect();

		const percent = ((event.clientX / progressBox.width) * 100);

		if (audioPlayer.current){
			const newTime = (percent / 100) * audioPlayer.current.getDuration();

			audioPlayer.current.seekTo(newTime, true);

    		if (percent > 1){
    			progressBarRef.current.style.width = `${percent}%`;
    		}
    		else{
    			progressBarRef.current.style.width = "1%";
    		}
		}
	};

	const playClick = () => {
		if (audioPlayer.current){
			const playerState = audioPlayer.current.getPlayerState();

			if ((playerState === -1) || (playerState === 0) || (playerState === 2) || (playerState === 5)){
				setPlaying(true);

				audioPlayer.current.playVideo();
			}
			else if (playerState === 1){
				setPlaying(false);

				audioPlayer.current.pauseVideo();
			}
		}
	};

	const forwardClick = () => {
		if (audioPlayer.current){
			const newTime = audioPlayer.current.getCurrentTime() + 10;

			audioPlayer.current.seekTo(newTime, true);

	    	const percent = ((audioPlayer.current.getCurrentTime() / audioPlayer.current.getDuration()) * 100);

    		if (percent > 1){
    			progressBarRef.current.style.width = `${percent}%`;
    		}
    		else{
    			progressBarRef.current.style.width = "1%";
    		}
		}
	};

	const backClick = () => {
		if (audioPlayer.current){
			const newTime = audioPlayer.current.getCurrentTime() - 10;

			audioPlayer.current.seekTo(newTime, true);

	    	const percent = ((audioPlayer.current.getCurrentTime() / audioPlayer.current.getDuration()) * 100);

    		if (percent > 1){
    			progressBarRef.current.style.width = `${percent}%`;
    		}
    		else{
    			progressBarRef.current.style.width = "1%";
    		}
		}
	};

	const nextClick = () => {
		if (audioPlayer.current){			
			if (nextSong.id.videoId === currentAudio.id.videoId){
				audioPlayer.current.seekTo(0, true);

	            audioPlayer.current.playVideo();
			}
			else{
				setCurrentAudio(nextSong);
			}
		}
	};

	const playbackClick = () => {
		if (audioPlayer.current){
			if (playbackState === "shuffle"){
				setPlaybackState("repeat");
			}
			else if (playbackState === "repeat"){
				setPlaybackState("stop");
			}
			else{
				setPlaybackState("shuffle");
			}
		}
	};

	const playlistOptionClick = (index) => {
		setPlaylists((oldPlaylists) => {
			const newPlaylists = [...oldPlaylists];

			if ((newPlaylists[index].data.findIndex(audio => audio.id.videoId === currentAudio.id.videoId) === -1)){
				newPlaylists[index].data.push(currentAudio);

				notify("Added to playlist!", 2000);
			}
			else{
				newPlaylists[index].data.splice(newPlaylists[index].data.indexOf(currentAudio), 1);
			
				notify("Removed from playlist!", 2000);
			}

			return newPlaylists;
		});
	};

	const playlistOptionCards = playlists.map((playlist, index) => {
		const inPlaylist = !(playlists[index].data.findIndex(audio => audio.id.videoId === currentAudio.id.videoId) === -1);

		return (
			<div className={inPlaylist ? "playlistOption playlistOptionRemove" : "playlistOption"} key={index} onClick={() => {playlistOptionClick(index)}}>
				{playlist.name.length < 20 ? playlist.name : `${playlist.name.slice(0, 20)}...`}
			</div>
		);
	});

	useEffect(() => {
		setNextSong(audios.length > 1 ? audios.filter(audio => audio.id.videoId !== currentAudio.id.videoId)[randomNumber(0, audios.length - 2)] : audios[0]);

		const playerElement = document.createElement("div");

		playerElement.style.display = "none";

		document.body.appendChild(playerElement);

	    const player = new youtube.Player(playerElement, {
	        height: "390",
	        width: "640",
	        videoId: currentAudio.id.videoId,
	        playerVars: {
	            "playsinline": 1
	        },
	        events: {
	            onReady: () => {
	                audioPlayer.current = player;

	                setPlaying(true);

	                audioPlayer.current.playVideo();

	                setPlayerEndState(false);
	            },
	            onStateChange: (event) => {
	            	if (event.data === 0){
	            		setPlayerEndState(true);
	            	}
	            }
	        }
	    });

	    const playInterval = setInterval(() => {
	    	if (audioPlayer.current){
	    		const percent = ((audioPlayer.current.getCurrentTime() / audioPlayer.current.getDuration()) * 100);

	    		if (percent > 1){
	    			progressBarRef.current.style.width = `${percent}%`;
	    		}
	    		else{
	    			progressBarRef.current.style.width = "1%";
	    		}
	    	}
	    }, 1000);

	    thumbnailBoxRef.current.style.background = `url(${currentAudio.snippet.thumbnails.default.url})`;

	    const playPause = (event) => {
			if (event.keyCode === 32){
				if (audioPlayer.current && document.activeElement !== searchInputRef.current){

					const playerState = audioPlayer.current.getPlayerState();
 
					if ((playerState === -1) || (playerState === 0) || (playerState === 2) || (playerState === 5)){
						setPlaying(true);

						audioPlayer.current.playVideo();
					}
					else if (playerState === 1){
						setPlaying(false);

						audioPlayer.current.pauseVideo();
					}
				}
			}
	    };

		window.addEventListener("keydown", playPause);

	    return () => {
	    	clearInterval(playInterval);

	    	player.addEventListener("onReady", () => {
		    	player.stopVideo();

		    	player.clearVideo();
	    	});
	    
	    	if (audioPlayer.current){
		    	audioPlayer.current.stopVideo();

		    	audioPlayer.current.clearVideo();
		    }

	    	window.removeEventListener("keydown", playPause);
	    }
	}, [currentAudio]);

	useEffect(() => {
		if (audioPlayer.current && playerEndState){
			if (playbackState === "shuffle"){
				if (nextSong.id.videoId === currentAudio.id.videoId){
					audioPlayer.current.seekTo(0, true);

		            audioPlayer.current.playVideo();
				}
				else{
					setCurrentAudio(nextSong);
				}
			}
			else if (playbackState === "repeat"){
				audioPlayer.current.seekTo(0, true);

	            audioPlayer.current.playVideo();
			}
			else{
	    		setPlaying(false);
			}
	        
	        setPlayerEndState(false);
		}
	}, [playerEndState]);

    useEffect(() => {
        localStorage.setItem("musiplay-data-playlists", JSON.stringify(playlists));
    }, [playlists]);

	return (
		<>
			<div className={upNextOpen ? "upNext" : "upNext upNextClosed"} ref={upNextRef}>
				<div className="upNextHeader">
					<h2 className="upNextTitle">
						Up Next
					</h2>

					<div className="upNextButton" onClick={upNextClick}>
						{(upNextOpen) &&
							<span className="material-symbols-outlined upNextButtonIcon">
								arrow_back
							</span>
						}

						{(!upNextOpen) &&
							<span className="material-symbols-outlined upNextButtonIcon">
								arrow_forward
							</span>
						}
					</div>
				</div>

				<div className={upNextOpen ? "upNextSongBox" : "upNextSongBox upNextSongBoxClosed"}>
					<div className="upNextThumbnailBox">
						<img className="upNextTumbnail" src={nextSong.snippet.thumbnails.default.url} draggable={false}/>
					</div>

					<p className="upNextSongTitle">
						{nextSong.title.length < 50 ? nextSong.title : `${nextSong.title.slice(0, 50)}...`}
					</p>
				</div>

				<p className={upNextOpen ? "upNextPlaylist" : "upNextPlaylist upNextPlaylistClosed"}>
					{currentPlaylist ? currentPlaylist : "Music"}
				</p>
			</div>

			{(playlistOptions) &&
				<div className="playlistOptionsContainer">
					<div className="playlistOptionsBox" ref={playlistOptionsBoxRef}>
						<h2 className="playlistNameTitle">
							Choose Playlist
						</h2>

						<div className="playlistOptions">
							<div className="playlistOptionsWrapper">
								{playlistOptionCards}
							</div>
						</div>

						<div className="playlistOptionsCancelButton" onClick={playlistCancelClick}>
							Close
						</div>
					</div>
				</div>
			}

			<div className="player">
				<div className="playerData">
					<div className="playerThumbnailBox" ref={thumbnailBoxRef}>
						<img className="playerThumbnail" src={currentAudio.snippet.thumbnails.default.url} draggable={false}/>
					</div>
					
					<div className="playerTitleBox">
						<p className="playerTitle">
							{`${currentAudio.title} || ${currentAudio.duration_raw ? currentAudio.duration_raw : "LIVE"}`}
						</p>
					</div>

					<div className="playerButtons">
						<div className="playerUndoButton" onClick={undoClick}>
							<span className="material-symbols-outlined playerUndoButtonIcon">
								undo
							</span>
						</div>

						<div className="playerFavoriteButton" onClick={favoriteClick}>
							<span className="material-symbols-outlined playerFavoriteButtonIcon">
								favorite
							</span>
						</div>
					</div>
				</div>

				<div className="playerControls">
					<div className="playerProgress" onClick={progressClick} ref={progressRef}>
						<div className="playerProgressBar" ref={progressBarRef}></div>
					</div>

					<div className="playerButtonBox">
						<div className="playerPlaybackButton" onClick={playbackClick}>
							{(playbackState === "shuffle") &&
								<span className="material-symbols-outlined playerPlaybackButtonIcon playerPlaybackShuffleButtonIcon">
									shuffle
								</span>
							}

							{(playbackState === "repeat") &&
								<span className="material-symbols-outlined playerPlaybackButtonIcon playerPlaybackRepeatButtonIcon">
									repeat_one
								</span>
							}

							{(playbackState === "stop") &&
								<span className="material-symbols-outlined playerPlaybackButtonIcon playerPlaybackStopButtonIcon">
									stop_circle
								</span>
							}
						</div>

						<div className="playerBackButton" onClick={backClick}>
							<span className="material-symbols-outlined playerForwardButtonIcon">
								fast_rewind
							</span>
						</div>

						<div className="playerPlayButton" onClick={playClick}>
							{(playing) &&
								<span className="material-symbols-outlined playerPlayButtonIcon">
									pause
								</span>
							}

							{(!playing) &&
								<span className="material-symbols-outlined playerPlayButtonIcon">
									play_arrow
								</span>
							}
						</div>

						<div className="playerForwardButton" onClick={forwardClick}>
							<span className="material-symbols-outlined playerForwardButtonIcon">
								fast_forward
							</span>
						</div>

						<div className="playerNextButton" onClick={nextClick}>
							<span className="material-symbols-outlined playerNextButtonIcon">
								skip_next
							</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Player;
