import { useState, useRef } from "react";
import classes from "./CSVHompage.module.css";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

const EXCLUDED_COLUMNS = [
  "User Details",
  "Previous Values",
  "Updated Values",
  "Updated Col. Name"
];

const CsvHomepage = () => {
  const [loading, setLoading] = useState(false);
  const [firstCsv, setFirstCsv] = useState(null);
  const [secondCsv, setSecondCsv] = useState(null);
  const [imageColumnName, setImageColumnName] = useState("");
  const [csv1Headers, setCsv1Headers] = useState([]);
  const formRef = useRef(null);

  const onMergeHandler = async () => {
    try {
      if (!firstCsv || !secondCsv) {
        toast.warning("Please upload both files.");
        return;
      }

      if (!imageColumnName) {
        toast.warning("Please select an image column name.");
        return;
      }

      setLoading(true);
      const firstCsvData = await readFile(firstCsv, true);
      const secondCsvData = await readFile(secondCsv);
      const mergedData = mergeCsvData(firstCsvData, secondCsvData);
      toast.success("Files merged successfully.");

      const match = firstCsv?.name.match(/^\d+/);
      const result = match ? `${match[0]}.xlsx` : `${firstCsv.name.replace(/\.csv$/i, "")}.xlsx`; // Change to `.xlsx`
      downloadXls(mergedData.data, result); // Call the new download function for XLSX

    } catch (error) {
      toast.error("Error merging files. Please try again.");
    } finally {
      setLoading(false);
      setFirstCsv(null);
      setSecondCsv(null);
      setImageColumnName('');
      setCsv1Headers([]); // Reset headers
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  };

  const readFile = (file, isFirstCsv = false) => {
    return new Promise((resolve, reject) => {
      const fileExtension = file.name.split('.').pop();

      if (fileExtension === 'csv') {
        // Handle CSV files
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            if (isFirstCsv) {
              setCsv1Headers(Object.keys(results.data[0] || {})); // Store headers
            }
            const filteredData = results.data.map(row => {
              // Filter out any columns that are in EXCLUDED_COLUMNS
              const filteredRow = {};
              Object.keys(row).forEach(key => {
                if (!EXCLUDED_COLUMNS.includes(key)) {
                  filteredRow[key] = row[key];
                }
              });
              return filteredRow;
            });
            resolve(filteredData);
          },
          error: (error) => {
            reject(error);
          }
        });
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        // Handle Excel files
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0]; // Take the first sheet
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convert to JSON
          const headers = json[0]; // First row is considered as headers

          if (isFirstCsv) {
            setCsv1Headers(headers); // Store headers
          }
          const dataWithoutHeaders = json.slice(1); // All rows after the first
          const filteredData = dataWithoutHeaders.map(row => {
            const rowObject = {};
            headers.forEach((header, index) => {
              if (!EXCLUDED_COLUMNS.includes(header)) {
                rowObject[header] = row[index];
              }
            });
            return rowObject;
          });
          resolve(filteredData);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error("Unsupported file format"));
      }
    });
  };

  const mergeCsvData = (csv1Data, csv2Data) => {
    const csv1HeadersBeforeImage = csv1Headers.slice(0, csv1Headers.indexOf(imageColumnName));
    const csv1HeadersAfterImage = csv1Headers.slice(csv1Headers.indexOf(imageColumnName));

    const csv2Headers = Object.keys(csv2Data[0] || {});
    const mergedHeaders = [
      ...csv1HeadersBeforeImage,
      ...csv2Headers.filter(header => header !== 'BAR1' && !EXCLUDED_COLUMNS.includes(header)), // Exclude 'BAR1' and excluded columns
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
        if (!EXCLUDED_COLUMNS.includes(header)) {
          mergedRow[header] = csv1Row[header] || '';
        }
      });

      // Add headers from csv2, but prefer csv1's value if header exists in both
      csv2Headers.forEach(header => {
        if (header !== 'BAR1' && !EXCLUDED_COLUMNS.includes(header)) {
          mergedRow[header] = csv1Row[header] || csv2Row[header] || '';
        }
      });

      // Add headers from csv1 after the image column
      csv1HeadersAfterImage.forEach(header => {
        if (!EXCLUDED_COLUMNS.includes(header)) {
          mergedRow[header] = csv1Row[header] || '';
        }
      });

      mergedData.push(mergedRow);
    });

    return {
      headers: mergedHeaders,
      data: mergedData
    };
  };

  const downloadXls = (mergedData, fileName) => {
    const wb = XLSX.utils.book_new(); // Create a new workbook
    const ws = XLSX.utils.json_to_sheet(mergedData); // Convert JSON data to a worksheet

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Merged Data");

    // Write the Excel file and trigger the download
    XLSX.writeFile(wb, fileName);
  };

  return (
    <main
      className="flex flex-col gap-5 bg-white rounded-md bg-gradient-to-r from-blue-400 to-blue-600 h-[100vh]"
    >
      <div
        className={`flex flex-col border-dashed pt-24 px-5 rounded-md xl:w-5/6 justify-center self-center ${classes.innerBox}`}
      >
        <h1 className="text-center mb-6 text-black-300 text-2xl font-bold">
          Merging Files
        </h1>
        <form ref={formRef} className="flex flex-col gap-6">
          <div className="flex flex-row justify-between gap-10 mb-6">
            <div className="grid w-full items-center gap-1.5">
              <label className="text-sm text-gray-600 font-medium leading-none">
                Upload First File
              </label>
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium border-black-400 hover:border-blue-400"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFirstCsv(file);
                  if (file) {
                    readFile(file, true);
                  }
                }}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <label className="text-sm text-gray-600 font-medium leading-none">
                Upload Second File
              </label>
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium border-black-400 hover:border-blue-400"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setSecondCsv(file);
                  if (file) {
                    readFile(file);
                  }
                }}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between gap-10 mb-6">
            <div className="grid w-1/2 items-center gap-1.5">
              <label className="text-sm text-gray-600 font-medium leading-none">
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
              Merge Files
            </LoadingButton>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CsvHomepage;
