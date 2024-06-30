import React, {useEffect, useRef} from "react";

function Loader(){
	const loader1Ref = useRef();

	const loader2Ref = useRef();

	useEffect(() => {
		loader1Ref.current.onanimationend = (event) => {
			if (event.animationName === "loaderMaxify"){
				loader1Ref.current.classList.add("loader1Reverse");
			}

			if (event.animationName === "loaderMinify"){
				loader1Ref.current.classList.remove("loader1Reverse");
			}
		};

		loader2Ref.current.onanimationend = (event) => {
			if (event.animationName === "loaderMinify"){
				loader2Ref.current.classList.add("loader2Reverse");
			}

			if (event.animationName === "loaderMaxify"){
				loader2Ref.current.classList.remove("loader2Reverse");
			}
		};
	}, []);

	return (
		<div className="loaderBox">
			<div className="loader1" ref={loader1Ref}></div>

			<div className="loader2" ref={loader2Ref}></div>

			<h1 className="loaderText">
				Loading
			</h1>
		</div>
	);
}

export default Loader;
