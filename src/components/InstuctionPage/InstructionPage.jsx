import React from "react";
import { Button } from "@mui/material";
import { IoSend, IoClose } from "react-icons/io5";

const InstructionPage = ({ setInstuction, instruction, handleFinalSubmit }) => {
  return (
    <div>
      {instruction && (
        <div className="fixed inset-0 flex items-center justify-center z-50 mt-20">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-2xl mx-auto text-center border-2 border-green-500 relative">
            {/* Close Icon */}
            <button
              onClick={() => setInstuction(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <IoClose size={24} />
            </button>

            <h1 className="text-green-600 text-2xl font-bold mb-4">
              Instructions
            </h1>
            <div className="text-left text-gray-700 space-y-4">
              <h2 className="text-lg font-semibold mb-2">Shortcut Keys</h2>
              <ul className="list-disc pl-4">
                <li>
                  <p className="mb-1">
                    A. Left Arrow / Page Down - For showing the previous image.
                  </p>
                  <p className="mb-1">
                    B. Right Arrow / Page Up - For showing the next image.
                  </p>
                </li>
              </ul>
              <h2 className="text-lg font-semibold mb-2">
                On Selecting the Form Field
              </h2>
              <ul className="list-disc pl-4">
                <li>
                  <p className="mb-1">
                    A. Select form field type (Text/Number/Alphanumeric).
                  </p>
                  <p className="mb-1">
                    B. On Selecting Number type, add Start and End Value.
                  </p>
                  <p className="mb-1">C. Add Form Field length.</p>
                  <p className="mb-1">D. Add Form Field Name.</p>
                </li>
              </ul>
              <h2 className="text-lg font-semibold mb-2">
                On Selecting the Question Field
              </h2>
              <ul className="list-disc pl-4">
                <li>
                  <p className="mb-1">A. Add Start and End Question number.</p>
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <Button
                className=" bg-green-500 text-white"
                onClick={handleFinalSubmit}
                variant="contained"
                endIcon={<IoSend />}
              >
                Save Images
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructionPage;
