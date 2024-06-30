import React, {useEffect, useRef} from "react";
import notify from "./notify.jsx";

function Audios({audios, page, setPage, setCurrentAudio, searchResult, playlists, setPlaylists, currentPlaylist, setCurrentPlaylist}){
	const audioRefs = useRef([]);

	const audioClick = (audio) => {
		setCurrentAudio(audio);

		setPage("player");
	};

	const playlistRemoveClick = () => {
		setPlaylists((oldPlaylist) => {
			const newPlaylist = [...oldPlaylist];

			newPlaylist.splice(newPlaylist.indexOf(currentPlaylist), 1);

			return newPlaylist;
		});

		setPage("playlists");
	
		notify("Playlist removed!", 2000);
	};

	const audioCards = audios.map((audio, index) => {
		return (
			<div className="audio" key={index} ref={(element) => (audioRefs.current[index] = element)} onClick={() => {audioClick(audio)}}>
				<div className="audioPlayButtonBox">
					<div className="audioPlayButton">
						<span className="material-symbols-outlined audioPlayButtonIcon">
							play_arrow
						</span>
					</div>
				</div>

				<div className="audioTitleBox">
					<p className="audioTitle">
						{audio.title.length <= 70 ? audio.title : `${audio.title.slice(0, 70)}...`}
					</p>
				</div>
			</div>
		);
	});

	const audiosTitleReturn = () => {
		if (page === "home"){
			return ("Home");
		}
		else if (page === "audios"){
			return (searchResult ? `Results for "${searchResult.slice(0, 20)}..."` : "Home");
		}
		else{
			return (`Playlist - ${currentPlaylist}`);
		}
	};

	const audiosTitle = audiosTitleReturn();

	useEffect(() => {
		audios.forEach((audio, index) => {
			if (audioRefs.current[index]){
				audioRefs.current[index].style.background = `url(${audio.snippet.thumbnails.default.url})`;
			
				audioRefs.current[index].style.backgroundSize = "contain";
			}
		});
	}, [audios]);

	useEffect(() => {
		if (page !== "playlist"){
			setCurrentPlaylist(null);
		}
	}, []);

	return (
		<>
			<div className="audioResultTitle">
				{audiosTitle}
			</div>

			<div className="audios">
				{(page === "playlist") &&
					<div className="playlistAddButton" onClick={playlistRemoveClick}>
						<span className="material-symbols-outlined playlistIcon">
							delete
						</span>

						<div className="playlistText">
							Remove Playlist
						</div>
					</div>
				}

				{audioCards}
			</div>
		</>
	);
}

export default Audios;