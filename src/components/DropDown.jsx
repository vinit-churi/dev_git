import React, { useState } from "react";

const DropDown = () => {
  const options = ["Commit", "Addition", "Deletion"];
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <select value={selectedOption} onChange={handleOptionChange}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <p>You selected: {selectedOption}</p>
    </>
  );
};

export default DropDown;
