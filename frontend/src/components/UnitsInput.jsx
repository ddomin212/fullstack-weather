import React from "react";

function UnitsInput({ handleUnitsChange }) {
  return (
    <div className="flex flex-row w-1/4 items-center justify-center">
      <button
        name="metric"
        data-testid="metric-switch"
        className="text-xl text-white font-light transition ease-out hover:scale-125"
        onClick={(e) => handleUnitsChange(e.target.name)}
      >
        °C
      </button>
      <p className="text-xl text-white mx-3">|</p>
      <button
        name="imperial"
        data-testid="imperial-switch"
        className="text-xl text-white font-light transition ease-out hover:scale-125"
        onClick={(e) => handleUnitsChange(e.target.name)}
      >
        °F
      </button>
    </div>
  );
}

export default UnitsInput;
