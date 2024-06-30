import React, {useRef} from "react";
import alertify from "./alertify.jsx";

function Menu({setMenuActive, socket, setPage, setCurrentPlaylist, setSearchResult}){
	const menuRef = useRef();

	const closeMenu = () => {
		menuRef.current.onanimationend = (event) => {
			if (event.animationName === "menuClose"){
				menuRef.current.classList.remove("menuClosed");

				setMenuActive(false);
			}
		};

		menuRef.current.classList.add("menuClosed");
	};

	const menuOptionClick = (option) => {
		if (option === "home" || option === "artists" || option === "trending"){
			setSearchResult(null);

			setPage("home");

			socket.emit(option);
		
			setCurrentPlaylist(null);
		}
		else if (option === "playlists"){
			setSearchResult(null);

			setPage("playlists");
		}
		else{
			alertify("Made by Anuj Chowdhury.");
		}
	};

	return (
		<div className="menuBox">
			<div className="menu" ref={menuRef}>
				<div className="menuCloseButton" onClick={closeMenu}>
					<span className="material-symbols-outlined menuCloseIcon">
						close
					</span>
				</div>

				<div className="menuLogo">
					<span className="material-symbols-outlined menuLogoIcon">
						music_note
					</span>

					<h1 className="menuLogoTitle">
						MusiPlay
					</h1>
				</div>

				<div className="menuButtonBox">
					<div className="menuButton" onClick={() => {menuOptionClick("home")}}>
						<span className="material-symbols-outlined menuButtonIcon menuHomeIcon">
							home
						</span>

						<div className="menuButtonText">
							Home
						</div>
					</div>

					<div className="menuButton" onClick={() => {menuOptionClick("artists")}}>
						<span className="material-symbols-outlined menuButtonIcon menuArtistsIcon">
							artist
						</span>

						<div className="menuButtonText">
							Artists
						</div>
					</div>

					<div className="menuButton" onClick={() => {menuOptionClick("trending")}}>
						<span className="material-symbols-outlined menuButtonIcon menuTrendingIcon">
							local_fire_department
						</span>

						<div className="menuButtonText">
							Trending
						</div>
					</div>

					<div className="menuButton" onClick={() => {menuOptionClick("playlists")}}>
						<span className="material-symbols-outlined menuButtonIcon menuPlaylistIcon">
							queue_music
						</span>

						<div className="menuButtonText">
							Playlists
						</div>
					</div>

					<div className="menuButton" onClick={() => {menuOptionClick("about")}}>
						<span className="material-symbols-outlined menuButtonIcon menuAboutIcon">
							info
						</span>

						<div className="menuButtonText">
							About
						</div>
					</div>
				</div>

				<div className="menuFooter">
					<h4>
						Made by Anuj Chowdhury
					</h4>
				</div>
			</div>
		</div>
	);
}

export default Menu;