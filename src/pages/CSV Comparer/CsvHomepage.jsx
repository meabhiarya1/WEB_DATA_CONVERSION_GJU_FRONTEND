import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { useState, useRef } from "react";
import classes from "./CSVHompage.module.css";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import Papa from 'papaparse';

const CsvHomepage = () => {
  const [loading, setLoading] = useState(false);
  const [firstCsv, setFirstCsv] = useState(null);
  const [secondCsv, setSecondCsv] = useState(null);
  const formRef = useRef(null);

  const onMergeHandler = async () => {
    try {
      if (!firstCsv || !secondCsv) {
        toast.warning("Please upload both CSV files.");
        return;
      }

      setLoading(true);
      const firstCsvData = await readCsv(firstCsv);
      const secondCsvData = await readCsv(secondCsv);
      const mergedData = mergeCsvData(firstCsvData, secondCsvData);
      const mergedCsv = Papa.unparse(mergedData);
      toast.success("CSV files merged successfully.");
      downloadCsv(mergedCsv, 'merged.csv');
    } catch (error) {
      toast.error("Error merging CSV files. Please try again.");
    } finally {
      setLoading(false);
      setFirstCsv(null);
      setSecondCsv(null);

      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  };

  const readCsv = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  const mergeCsvData = (csv1Data, csv2Data) => {
    const csv1Headers = Object.keys(csv1Data[0] || {});
    const csv2Headers = Object.keys(csv2Data[0] || {});

    const isBar1ColPrensentInCsv1 = csv1Headers.includes('BAR1');
    if (!isBar1ColPrensentInCsv1) {
      toast.warning("CSV1 and CSV2 must have a BAR1 column.");
      return [];
    }
    const isBar1ColPrensentInCsv2 = csv2Headers.includes('BAR1');

    if (!isBar1ColPrensentInCsv2) {
      toast.warning("CSV1 and CSV2 must have a BAR1 column.");
      return [];
    }

    const mergedHeaders = Array.from(new Set([...csv1Headers, ...csv2Headers]));

    const isBar1ColumnPresent = mergedHeaders.includes('BAR1');

    if (!isBar1ColumnPresent) {
      toast.warning("CSV1 and CSV2 must have a BAR1 column.");
      return [];
    }

    const csv1Map = new Map();
    csv1Data.forEach(row => {
      if (row.BAR1) {
        csv1Map.set(row.BAR1, row);
      }
    });

    const csv2Map = new Map();
    csv2Data.forEach(row => {
      if (row.BAR1) {
        csv2Map.set(row.BAR1, row);
      }
    });

    const mergedData = [];

    csv1Data.forEach(csv1Row => {
      const bar1Value = csv1Row.BAR1;
      const csv2Row = csv2Map.get(bar1Value);

      const mergedRow = {};
      mergedHeaders.forEach(header => {
        mergedRow[header] = csv1Row[header] || csv2Row?.[header] || '';
      });

      mergedData.push(mergedRow);
    });

    csv2Data.forEach(csv2Row => {
      const bar1Value = csv2Row.BAR1;
      if (!csv1Map.has(bar1Value)) {
        const newRow = {};
        mergedHeaders.forEach(header => {
          newRow[header] = csv2Row[header] || '';
        });
        mergedData.push(newRow);
      }
    });

    return mergedData;
  };

  const downloadCsv = (csvContent, fileName) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
          <form ref={formRef} className="flex flex-col gap-6">
            <div className="flex flex-row justify-between gap-10 mb-6">
              <div className="grid w-full items-center gap-1.5">
                <label className="text-sm text-gray-600 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Select Paper 1
                </label>
                <input
                  type="file"
                  className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium border-black-400 hover:border-blue-400"
                  onChange={(e) => setFirstCsv(e.target.files[0])}
                  accept="text/csv"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label className="text-sm text-gray-600 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Select Paper 2
                </label>
                <input
                  type="file"
                  className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium border-black-400 hover:border-blue-400"
                  onChange={(e) => setSecondCsv(e.target.files[0])}
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
          </form>
        </div>
      </main>
    </>
  );
};

export default CsvHomepage;
