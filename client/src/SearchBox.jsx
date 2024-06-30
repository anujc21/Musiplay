import React, {useRef} from "react";

function SearchBox({setSearchVisible, searchClick}){
	const searchInputRef = useRef();

	const searchBigClick = () => {
		const searchValue = searchInputRef.current.value.slice(0, 100);

		if (searchValue){
			setSearchVisible(false);

			searchClick(searchValue);
		}
	};

	return (
		<div className="searchContainer">
			<div className="searchBoxBig">
				<div className="backButtonBig" onClick={() => {setSearchVisible(false)}}>
					<span className="material-symbols-outlined searchButtonIcon">
						arrow_back
					</span>
				</div>

				<div className="searchInputBoxBig">
					<input className="searchInputBig" type="text" placeholder="Search music here..." length="100" autoFocus={true} ref={searchInputRef}/>
				</div>

				<div className="searchButtonBig">
					<span className="material-symbols-outlined searchButtonIcon" onClick={searchBigClick}>
						search
					</span>
				</div>
			</div>
		</div>
	);
}

export default SearchBox;