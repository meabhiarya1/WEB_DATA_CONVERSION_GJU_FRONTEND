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
  const [imageColumnName, setImageColumnName] = useState("");
  const [csv1Headers, setCsv1Headers] = useState([]); // New state for headers
  const formRef = useRef(null);

  const onMergeHandler = async () => {
    try {
      if (!firstCsv || !secondCsv) {
        toast.warning("Please upload both CSV files.");
        return;
      }

      if (!imageColumnName) {
        toast.warning("Please select an image column name.");
        return;
      }

      setLoading(true);
      const firstCsvData = await readCsv(firstCsv, true);
      const secondCsvData = await readCsv(secondCsv);
      const mergedData = mergeCsvData(firstCsvData, secondCsvData);
      const mergedCsv = Papa.unparse(mergedData.data);
      toast.success("CSV files merged successfully.");

      const match = firstCsv?.name.match(/^\d+/);
      const result = match ? `${match[0]}.csv` : null;
      downloadCsv(mergedCsv, result ? result : firstCsv);

    } catch (error) {
      toast.error("Error merging CSV files. Please try again.");
    } finally {
      setLoading(false);
      setFirstCsv(null);
      setSecondCsv(null);
      setImageColumnName('');
      setCsv1Headers([]); // Reset headers
      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  };

  const readCsv = (file, isFirstCsv = false) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          if (isFirstCsv) {
            setCsv1Headers(Object.keys(results.data[0] || {})); // Store headers
          }
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  const mergeCsvData = (csv1Data, csv2Data) => {
    const csv1HeadersBeforeImage = csv1Headers.slice(0, csv1Headers.indexOf(imageColumnName));
    const csv1HeadersAfterImage = csv1Headers.slice(csv1Headers.indexOf(imageColumnName));

    const csv2Headers = Object.keys(csv2Data[0] || {});
    const mergedHeaders = [
      ...csv1HeadersBeforeImage,
      ...csv2Headers.filter(header => header !== 'BAR1'), // Exclude 'BAR1' if it's duplicated
      ...csv1HeadersAfterImage
    ];

    const csv1Map = new Map();
    const csv2Map = new Map();

    csv1Data.forEach(row => {
      if (row.BAR1) {
        csv1Map.set(row.BAR1, row);
      }
    });

    csv2Data.forEach(row => {
      if (row.BAR1) {
        csv2Map.set(row.BAR1, row);
      }
    });

    const mergedData = [];

    csv1Data.forEach(csv1Row => {
      const bar1Value = csv1Row.BAR1;
      const csv2Row = csv2Map.get(bar1Value) || {};

      const mergedRow = {};

      // Add headers from csv1 before the image column
      csv1HeadersBeforeImage.forEach(header => {
        mergedRow[header] = csv1Row[header] || '';
      });

      // Add headers from csv2, but prefer csv1's value if header exists in both
      csv2Headers.forEach(header => {
        if (header !== 'BAR1') {
          mergedRow[header] = csv1Row[header] || csv2Row[header] || '';
        }
      });

      // Add headers from csv1 after the image column
      csv1HeadersAfterImage.forEach(header => {
        mergedRow[header] = csv1Row[header] || '';
      });

      mergedData.push(mergedRow);
    });

    return {
      headers: mergedHeaders,
      data: mergedData
    };
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
                  Upload First CSV
                </label>
                <input
                  type="file"
                  accept=".csv"
                  className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium border-black-400 hover:border-blue-400"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFirstCsv(file);
                    if (file) {
                      readCsv(file, true); // Indicate this is the first CSV
                    }
                  }}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label className="text-sm text-gray-600 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Upload Second CSV
                </label>
                <input
                  type="file"
                  accept=".csv"
                  className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium border-black-400 hover:border-blue-400"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setSecondCsv(file);
                    if (file) {
                      readCsv(file);
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex flex-row justify-between gap-10 mb-6">
              <div className="grid w-1/2 items-center gap-1.5">
                <label className="text-sm text-gray-600 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Select Place Column Name
                </label>
                <select
                  value={imageColumnName}
                  onChange={(e) => setImageColumnName(e.target.value)}
                  className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm font-weight-bold text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium border-black-400 hover:border-blue-400"
                >
                  <option value="" disabled>Select a column</option>
                  {csv1Headers.map((header, index) => (
                    <option key={index} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-row justify-center gap-10">
              <LoadingButton
                loading={loading}
                onClick={onMergeHandler}
                variant="contained"
                endIcon={<CompareArrowsIcon />}
                loadingPosition="end"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Merge CSVs
              </LoadingButton>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default CsvHomepage;
