import { useEffect, useRef } from "react";
import "../css/Arrow.css";

function Arrow() {
	const arrowRef = useRef(null);

	const handleClick = () => {
		if (arrowRef.current) {
		arrowRef.current.animate(
			[
			{ left: "0" },
			{ left: "10px" },
			{ left: "0" }
			],
			{
			duration: 700,
			iterations: Infinity
			}
		);
		}
	};

  return (
		<div className="icon" onClick={handleClick}>
			<div className="arrow" ref={arrowRef}></div>
		</div>
  );
}

export default Arrow;