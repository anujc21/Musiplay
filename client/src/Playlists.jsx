import React, {useState, useRef, useEffect} from "react";
import notify from "./notify.jsx";

function Playlists({playlists, setPlaylists, setCurrentPlaylist, setAudios, setPage}){
	const [playlistName, setPlaylistName] = useState(false);

	const playlistsRef = useRef();

	const inputRef = useRef();

	const playlistClick = (value) => {
		setCurrentPlaylist(value.name);

		setAudios(value.data);

		setPage("playlist");
	};

	const playlistCards = playlists.map((playlist, index) => {
		return (
			<div className="playlist" key={index} onClick={() => {playlistClick(playlist)}}>
				<span className="material-symbols-outlined playlistIcon">
					playlist_play
				</span>

				<div className="playlistText">
					{playlist.name}
				</div>
			</div>
		);
	});

	const addClick = () => {
		setPlaylistName(true);
	};

	const createClick = () => {
		const value = inputRef.current.value.slice(0, 30);

		if (value){
			setPlaylists((oldPlaylists) => {
				const newPlaylists = [...oldPlaylists];

				newPlaylists.push({
					name: value,
					data: []
				});

				return newPlaylists;
			});

			setPlaylistName(false);

			notify("Playlist created!", 2000);
		}
	};

	const cancelClick = () => {
		setPlaylistName(false);
	};

	useEffect(() => {
		playlistsRef.current.scrollTop = playlistsRef.current.scrollHeight;

        localStorage.setItem("musiplay-data-playlists", JSON.stringify(playlists));
	}, [playlists]);

	return (
		<>
			<div className="playlists" ref={playlistsRef}>
				<div className="playlistAddButton" onClick={addClick}>
					<span className="material-symbols-outlined playlistIcon">
						add_circle
					</span>

					<div className="playlistText">
						Create Playlist
					</div>
				</div>
			
				{playlistCards}
			</div>

			{(playlistName) &&
				<div className="playlistNameContainer">
					<div className="playlistNameBox">
						<h2 className="playlistNameTitle">
							Playlist Name
						</h2>

						<div className="playlistInputBox">
							<input className="playlistNameInput" type="text" placeholder="Playlist name..." maxLength="30" autoFocus={true} ref={inputRef}/>
						</div>

						<div className="playlistButtons">
							<div className="playlistNameCancelButton" onClick={cancelClick}>
								Cancel
							</div>

							<div className="playlistNameButton" onClick={createClick}>
								Create
							</div>
						</div>
					</div>
				</div>
			}
		</>
	);
}

export default Playlists;