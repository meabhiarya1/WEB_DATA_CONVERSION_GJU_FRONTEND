import React from "react";

const QuestionField = ({
  setAllProperties,
  questionsField,
  checkedData,
  onCheckBoxHandler,
}) => {
  return (
    <div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="px-4 py-3 bg-green-500 text-white text-lg font-semibold">
          Questions Fields
          <span className="ml-4">(P: Pattern, B: Blank)</span>
        </h2>
        <div className="p-4">
          <div className="flex justify-end mb-4 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                onChange={() => setAllProperties("pattern", "questionsField")}
                className="form-checkbox h-5 w-5 text-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Pattern</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                onChange={() => setAllProperties("blank", "questionsField")}
                className="form-checkbox h-5 w-5 text-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Blank</span>
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {questionsField.map((question, i) => (
              <div key={i} className="flex items-center mb-2">
                <label className="text-sm font-medium w-[90px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {question}
                </label>
                <div className="flex justify-between">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={checkedData[question]?.pattern}
                      onChange={() => onCheckBoxHandler(question, "Pattern")}
                      className="form-checkbox h-5 w-5 text-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">P</span>
                  </label>
                  <label className="inline-flex items-center ml-2">
                    <input
                      type="checkbox"
                      checked={checkedData[question]?.blank}
                      onChange={() => onCheckBoxHandler(question, "Blank")}
                      className="form-checkbox h-5 w-5 text-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">B</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionField;
