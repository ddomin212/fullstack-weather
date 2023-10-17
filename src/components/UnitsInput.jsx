import React from "react";

function UnitsInput({ handleUnitsChange }) {
  return (
    <div className="flex flex-row w-1/4 items-center justify-center">
      <button
        name="metric"
        className="text-xl text-white font-light transition ease-out hover:scale-125"
        onClick={handleUnitsChange}
      >
        °C
      </button>
      <p className="text-xl text-white mx-3">|</p>
      <button
        name="imperial"
        className="text-xl text-white font-light transition ease-out hover:scale-125"
        onClick={handleUnitsChange}
      >
        °F
      </button>
    </div>
  );
}

export default UnitsInput;
