import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { useContext, useState } from "react";
import axios from "axios";
import classes from "./CSVHompage.module.css";
import { REACT_APP_IP } from "../../services/common";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";

const CsvHomepage = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const token = JSON.parse(localStorage.getItem("userData"));
  const [firstCsv, setFirstCsv] = useState(null);
  const [secondCsv, setSecondCsv] = useState(null);

  const onFirstCsvHandler = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFirstCsv(file);
    }
  };

  const onSecondCsvHandler = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSecondCsv(file);
    }
  };


  const onMergeHandler = async () => {
     if(!firstCsv || !secondCsv){
      toast.error("Please select both CSV files");
      return;
    } 
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000)

  }


  return (
    <>
      <main
        className={`flex flex-col gap-5 bg-white rounded-md bg-gradient-to-r from-blue-400 to-blue-600 h-[100vh]`}
      >
        <div
          className={`flex flex-col border-dashed pt-24 px-5 rounded-md xl:w-5/6 justify-center self-center ${classes.innerBox}`}
        >
          <h1 className="text-center mb-6 text-black-300 text-2xl font-bold">
            Merging CSV
          </h1>
          <div className="flex flex-row justify-between  gap-10 mb-6">
            <div className="grid w-full  items-center gap-1.5">
              <label className="text-sm text-gray-600 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Select Paper 1
              </label>
              <input
                id="picture"
                type="file"
                className="flex h-10 w-full rounded-md border  bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium   border-black-400 hover:border-blue-400"
                onChange={onFirstCsvHandler}
                accept="text/csv"
              />
            </div>
            <div className="grid w-full  items-center gap-1.5">
              <label className="text-sm text-gray-600 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Select Paper 2
              </label>
              <input
                id="picture"
                type="file"
                className="flex h-10 w-full rounded-md border  bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium   border-black-400 hover:border-blue-400"
                onChange={onSecondCsvHandler}
                accept="text/csv"
              />
            </div>
          </div>
          <div className="flex justify-between gap-10">
            <div className="flex self-end">
              <LoadingButton
                color="primary"
                loading={loading}
                onClick={onMergeHandler}
                loadingPosition="start"
                startIcon={
                  <CompareArrowsIcon size={24} sx={{ marginRight: "8px" }} />
                }
                variant="contained"
              >
                Compare And Merge
              </LoadingButton>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CsvHomepage;
