import React from "react";

const FormField = ({
  setAllProperties,
  formFields,
  checkedData,
  onCheckBoxHandler,
}) => {
  return (
    <div className="mb-8 mt-12">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="px-4 py-3 bg-blue-500 text-white text-lg font-semibold">
          Form Fields
          <span className="ml-4">(P: Pattern, B: Blank, L: Legal)</span>
        </h2>

        <div className="p-4">
          <div className="flex justify-end mb-4 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                onChange={() => setAllProperties("legal", "formField")}
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Legal</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                onChange={() => setAllProperties("pattern", "formField")}
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Pattern</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                onChange={() => setAllProperties("blank", "formField")}
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Blank</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries({ ...formFields }).map(([key, value], i) => (
              <div key={i} className="flex items-center mb-4">
                <label className="text-sm font-medium w-[140px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {value}
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={checkedData[value]?.legal}
                      onChange={() => onCheckBoxHandler(value, "Legal")}
                      className="form-checkbox h-5 w-5 text-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">L</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={checkedData[value]?.pattern}
                      onChange={() => onCheckBoxHandler(value, "Pattern")}
                      className="form-checkbox h-5 w-5 text-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">P</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={checkedData[value]?.blank}
                      onChange={() => onCheckBoxHandler(value, "Blank")}
                      className="form-checkbox h-5 w-5 text-blue-500"
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

export default FormField;
