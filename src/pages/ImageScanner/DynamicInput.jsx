import React from "react";
const DynamicInput = ({
  inputValues,
  handleInputChange,
  handleCheckboxChange,
  selectedRow,
}) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "123456789";
  const lowerAlphabet = "abcdefghijklmnopqrstuvwxyz";

  return (
    <div>
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="upper"
            name="upper"
            checked={selectedRow === "upper"}
            onChange={() => handleCheckboxChange("upper")}
          />
          <label
            htmlFor="upper"
            className="ml-2 text-gray-900 text-lg font-medium"
          >
            Uppercase Letters
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {inputValues.map((_, i) => (
            <input
              key={`upper-${i}`}
              type="text"
              className="border border-gray-300 text-center rounded px-3 py-2 w-[48%] sm:w-[17%]"
              value={inputValues[i]?.upper || alphabet[i % 26]}
              onChange={(e) => handleInputChange(e, "upper", i)}
              placeholder={`Upper ${i + 1}`}
              disabled={selectedRow !== "upper"}
            />
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="lower"
            name="lower"
            checked={selectedRow === "lower"}
            onChange={() => handleCheckboxChange("lower")}
          />
          <label
            htmlFor="lower"
            className="ml-2 text-gray-900 text-lg font-medium"
          >
            Lowercase Letters
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {inputValues.map((_, i) => (
            <input
              key={`lower-${i}`}
              type="text"
              className="border border-gray-300 rounded text-center px-3 py-2 w-[48%] sm:w-[17%]"
              value={inputValues[i]?.lower || lowerAlphabet[i % 26]}
              onChange={(e) => handleInputChange(e, "lower", i)}
              placeholder={`Lower ${i + 1}`}
              disabled={selectedRow !== "lower"}
            />
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="number"
            name="number"
            checked={selectedRow === "number"}
            onChange={() => handleCheckboxChange("number")}
          />
          <label
            htmlFor="number"
            className="ml-2 text-gray-900 text-lg font-medium"
          >
            Numbers
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {inputValues.map((_, i) => (
            <input
              key={`number-${i}`}
              type="text"
              className="border border-gray-300 rounded text-center px-3 py-2 w-[48%] sm:w-[17%]"
              value={inputValues[i]?.number || numbers[i % 9]}
              onChange={(e) => handleInputChange(e, "number", i)}
              placeholder={`Number ${i + 1}`}
              disabled={selectedRow !== "number"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DynamicInput;
