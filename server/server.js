import {Server} from "socket.io";
import * as youtube from "youtube-search-without-api-key";

const io = new Server({
	cors: {
		origin: "*"
	}
});

const options = {
	home: "song lyrics",
	artists: "songs by singers and artists",
	trending: "popular trending songs"
};

io.on("connection", (socket) => {
	console.log("Connected...");

	youtube.search(options.home).then((result) => {
		socket.emit("searchResult", result);
	});

	socket.on("home", (data) => {
		youtube.search(options.home).then((result) => {
			socket.emit("searchResult", result);
		});
	});

	socket.on("artists", (data) => {
		youtube.search(options.artists).then((result) => {
			socket.emit("searchResult", result);
		});
	});

	socket.on("trending", (data) => {
		youtube.search(options.trending).then((result) => {
			socket.emit("searchResult", result);
		});
	});

	socket.on("search", (data) => {
		youtube.search(data.slice(0, 300)).then((result) => {
			socket.emit("searchResult", result);
		});
	});

	socket.on("disconnect", () => {
		console.log("Disconnected...");
	});
});

io.listen(3000);