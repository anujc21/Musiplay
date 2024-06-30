import React, {useState, useEffect, useRef} from "react";
import {io} from "socket.io-client";
import Loader from "./Loader.jsx";
import Menu from "./Menu.jsx";
import Header from "./Header.jsx";
import Audios from "./Audios.jsx";
import Player from "./Player.jsx";
import Playlists from "./Playlists.jsx";
import "./App.css";

const socket = io("localhost:3000");

function App(){
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState("home");

    const [audios, setAudios] = useState([]);

    const [currentAudio, setCurrentAudio] = useState(null);

    const [searchResult, setSearchResult] = useState("");

    const [menuActive, setMenuActive] = useState(false);

    const [playlists, setPlaylists] = useState([]);

    const [currentPlaylist, setCurrentPlaylist] = useState([]);

    const searchInputRef = useRef();

    useEffect(() => {
        const newPlaylists = localStorage.getItem("musiplay-data-playlists");

        if (newPlaylists){
            setPlaylists(JSON.parse(newPlaylists));
        }

        socket.on("connect", () => {
            setLoading(false);
        });

        socket.on("searchResult", (result) => {
            setAudios(result);
        });

        window.oncontextmenu = (event) => {
            event.preventDefault();
        };
    }, []);

    return (
        <div className="app">
            {(loading) &&
                <Loader/>
            }

            {(menuActive) &&
                <Menu setMenuActive={setMenuActive} socket={socket} setPage={setPage} setCurrentPlaylist={setCurrentPlaylist} setSearchResult={setSearchResult}/>
            }

            <Header socket={socket} setPage={setPage} setSearchResult={setSearchResult} setMenuActive={setMenuActive} searchInputRef={searchInputRef} setCurrentPlaylist={setCurrentPlaylist}/>

            <div className="content">
                {(page === "home" || page === "audios" || page === "playlist") &&
                    <Audios audios={audios} page={page} setPage={setPage} setCurrentAudio={setCurrentAudio} searchResult={searchResult} playlists={playlists} setPlaylists={setPlaylists} currentPlaylist={currentPlaylist} setCurrentPlaylist={setCurrentPlaylist}/>
                }

                {(page === "player") &&
                    <Player currentAudio={currentAudio} setCurrentAudio={setCurrentAudio} audios={audios} searchInputRef={searchInputRef} setPage={setPage} playlists={playlists} setPlaylists={setPlaylists} currentPlaylist={currentPlaylist}/>
                }

                {(page === "playlists") &&
                    <Playlists playlists={playlists} setPlaylists={setPlaylists} setCurrentPlaylist={setCurrentPlaylist} setAudios={setAudios} setPage={setPage}/>
                }
            </div>
        </div>
    );
}

export default App;