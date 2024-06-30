import React, {useState, useEffect} from "react";
import SearchBox from "./SearchBox.jsx";

function Header({socket, setPage, setSearchResult, setMenuActive, searchInputRef, setCurrentPlaylist}){
	const [searchVisible, setSearchVisible] = useState(false);

	const searchClick = (searchValue) => {
		if (searchValue){
			setSearchResult(searchValue);

			setPage("audios");

			socket.emit("search", searchValue);
		}
	};

	const homeClick = () => {
		setSearchResult(null);

		setPage("home");

		socket.emit("home");

		setCurrentPlaylist(null);
	};

	const menuClick = () => {
		setMenuActive(true);
	};

	useEffect(() => {
		window.addEventListener("keydown", (event) => {
			if (event.keyCode === 13){
				if (document.activeElement === searchInputRef.current){
					const searchValue = searchInputRef.current.value;

					if (searchValue){
						setSearchResult(searchValue);

						setPage("audios");

						socket.emit("search", searchValue);
					}
				}
			}
		});
	}, []);

	return(
		<div className="header">
			<span className="material-symbols-outlined headerIcon">
				music_note
			</span>

			<h1 className="headerTitle">
				MusiPlay
			</h1>

			<div className="searchBox">
				<div className="searchInputBox">
					<input className="searchInput" type="text" placeholder="Search music here..." length="100" ref={searchInputRef}/>
				</div>

				<div className="searchButton" onClick={() => {searchClick(searchInputRef.current.value.slice(0, 100))}}>
					<span className="material-symbols-outlined searchButtonIcon">
						search
					</span>
				</div>
			</div>

			<div className="iconContainer">
				<div className="searchMiniButton" onClick={() => {setSearchVisible(true)}}>
					<span className="material-symbols-outlined searchMiniIcon">
						search
					</span>
				</div>

				<div className="homeMiniButton" onClick={homeClick}>
					<span className="material-symbols-outlined homeMiniIcon">
						home
					</span>
				</div>

				<div className="menuMiniButton" onClick={menuClick}>
					<span className="material-symbols-outlined menuMiniIcon">
						menu
					</span>
				</div>
			</div>

			{(searchVisible) &&
				<SearchBox setSearchVisible={setSearchVisible} searchClick={searchClick}/>
			}
		</div>
	);
}

export default Header;