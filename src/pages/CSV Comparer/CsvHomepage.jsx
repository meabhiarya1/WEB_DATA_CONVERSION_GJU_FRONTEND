import { useState, useRef } from "react";
import classes from "./CSVHompage.module.css";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

const EXCLUDED_COLUMNS = [
  "User Details",
  "Previous Values",
  "Updated Values",
  "Updated Col. Name",
];

const mainHeaders = [
  "Part_A.Sno",
  "Part_A.Barcode",
  "Answer Sheet No",
  "Rollno",
  "Paper_ID",
  "Exam_Code",
  "Part_A.Front Side Image",
  "Part_A.Back Side Image",
  "Part_A.Remarks",
  "Part_A.Edited",
  "Correction",
  "Part_C.Sno",
  "Part_C.Barcode",
  "Marks_Obt",
  "Max_Marks",
  "Ans_Book_Code",
  "Packet_ID",
  "Part_C.Front Side Image",
  "Part_C.Back Side Image",
  "Part_C.Remarks",
  "Part_C.Edited",
  "FLD_1",
  "FLD_2",
  "FLD_3",
  "FLD_4",
  "FLD_5",
  "FLD_6",
  "FLD_7",
  "FLD_8",
  "FLD_9",
  "FLD_10",
  "FLD_11",
  "FLD_12",
  "FLD_13",
  "FLD_14",
  "FLD_15",
];

const aPartData = [
  {
    SLNO: "1",
    BAR1: "1234",
    ROLL: "A123",
    ID: "EX01",
    E_CODE: "E123",
    "Front side Image": "image1_front.png",
    "Back side Image": "image1_back.png",
  },
  {
    SLNO: "2",
    BAR1: "5678",
    ROLL: "A124",
    ID: "EX02",
    E_CODE: "E124",
    "Front side Image": "image2_front.png",
    "Back side Image": "image2_back.png",
  },
];

const cPartData = [
  {
    SLNO: "1",
    BAR1: "1234",
    TOT_MARKS: "85",
    M_MARKS: "100",
    ANS_CODE: "A12345",
    ID: "EX01",
    "Front side Image": "c_image1_front.png",
    "Back side Image": "c_image1_back.png",
  },
  {
    SLNO: "2",
    BAR1: "5678",
    TOT_MARKS: "90",
    M_MARKS: "100",
    ANS_CODE: "A12346",
    ID: "EX02",
    "Front side Image": "c_image2_front.png",
    "Back side Image": "c_image2_back.png",
  },
];

const CsvHomepage = () => {
  const [loading, setLoading] = useState(false);
  const [firstCsv, setFirstCsv] = useState(null);
  const [secondCsv, setSecondCsv] = useState(null);
  const [csv1Headers, setCsv1Headers] = useState([]);
  const formRef = useRef(null);

  const onMergeHandler = async () => {
    try {
      if (!firstCsv || !secondCsv) {
        toast.warning("Please upload both files.");
        return;
      }

      setLoading(true);
      const firstCsvData = await readFile(firstCsv, true);
      const secondCsvData = await readFile(secondCsv);

      const mergedData = mergeCsvData(firstCsvData, secondCsvData);

      toast.success("Files merged successfully.");

      const match = firstCsv?.name.match(/^\d+/);
      const result = match
        ? `${match[0]}.xlsx`
        : `${firstCsv.name.replace(/\.csv$/i, "")}.xlsx`;
      downloadXls(
        mergedData.data,
        result,
        mergedData.headers,
        mergedData.duplicateDataCSV1,
        mergedData.duplicateDataCSV2
      );
    } catch (error) {
      console.error(error); // For internal logging
      toast.error(
        "Error merging files. Please check the file formats and try again."
      );
    } finally {
      setLoading(false);
      setFirstCsv(null);
      setSecondCsv(null);
      setCsv1Headers([]);
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  };

  const readFile = (file, isFirstCsv = false) => {
    return new Promise((resolve, reject) => {
      const fileExtension = file?.name?.split(".").pop().toLowerCase();

      if (!fileExtension || !["csv", "xlsx", "xls"].includes(fileExtension)) {
        toast.error(
          "Unsupported file format. Please upload a CSV or Excel file."
        );
        return reject(new Error("Unsupported file format"));
      }

      if (fileExtension === "csv") {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            if (isFirstCsv) {
              setCsv1Headers(Object.keys(results.data[0] || {}));
            }
            const filteredData = results.data.map((row) => {
              const filteredRow = {};
              Object.keys(row).forEach((key) => {
                if (!EXCLUDED_COLUMNS.includes(key)) {
                  filteredRow[key] = row[key];
                }
              });
              return filteredRow;
            });
            resolve(filteredData);
          },
          error: (error) => {
            toast.error("Error reading CSV file.");
            reject(error);
          },
        });
      } else if (["xlsx", "xls"].includes(fileExtension)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            if (json.length === 0) {
              throw new Error("Excel sheet is empty.");
            }

            const headers = json[0];
            if (isFirstCsv) {
              setCsv1Headers(headers);
            }

            const dataWithoutHeaders = json.slice(1);
            const filteredData = dataWithoutHeaders.map((row) => {
              const rowObject = {};
              headers.forEach((header, index) => {
                if (!EXCLUDED_COLUMNS.includes(header)) {
                  rowObject[header] =
                    row[index] !== undefined && row[index] !== null
                      ? String(row[index])
                      : "";
                }
              });
              return rowObject;
            });

            resolve(filteredData);
          } catch (error) {
            toast.error("Error reading Excel file.");
            reject(error);
          }
        };
        reader.onerror = (error) => {
          toast.error("Error reading Excel file.");
          reject(error);
        };
        reader.readAsArrayBuffer(file);
      } else {
        toast.error("Unsupported file format.");
        reject(new Error("Unsupported file format"));
      }
    });
  };

  const findDuplicates = (data, key) => {
    const seen = new Set();
    const duplicates = new Set();

    data.forEach((row) => {
      const value = row[key] ? row[key].trim() : "";
      if (seen.has(value)) {
        duplicates.add(value);
      } else {
        seen.add(value);
      }
    });

    return duplicates;
  };

  const mergeCsvData = (csv1Data, csv2Data) => {
    const mergedHeaders = [...mainHeaders];
    const duplicateDataCSV1 = []; // Stores duplicates
    const duplicateDataCSV2 = [];

    // 🔍 Find duplicates before merging
    const duplicateCsv1Barcodes = findDuplicates(csv1Data, "BAR1");
    const duplicateCsv2Barcodes = findDuplicates(csv2Data, "BAR1");
    const duplicateCsv1Rollnos = findDuplicates(csv1Data, "ROLL"); // Fixed csv1Data instead of csv2Data

    // Store csv2Data in a Map for quick lookup
    const csv2Map = new Map();
    csv2Data.forEach((row) => {
      const bar1Value = row.BAR1 ? row.BAR1.trim() : "";
      if (bar1Value) {
        csv2Map.set(Number(bar1Value), row);
      }
    });

    const mergedData = [];

    csv1Data.forEach((csv1Row) => {
      const bar1Value = csv1Row.BAR1 ? csv1Row.BAR1.trim() : "";
      const csv2Row = csv2Map.get(Number(bar1Value));

      if (csv2Row) {
        const mergedRow = {
          "Part_A.Sno": csv2Row["SLNO"] ? csv2Row["SLNO"].trim() : "",
          "Part_A.Barcode": bar1Value,
          "Answer Sheet No": csv1Row["ANS_CODE"]
            ? csv1Row["ANS_CODE"].trim()
            : "",
          Rollno: csv2Row["ROLL"] ? String(csv2Row["ROLL"]).trim() : "",
          Paper_ID: csv2Row["ID"] ? csv2Row["ID"].trim() : "",
          Exam_Code: csv2Row["E_CODE"] ? csv2Row["E_CODE"].trim() : "",
          "Part_A.Front Side Image": csv2Row["Front side Image"]
            ? csv2Row["Front side Image"].trim()
            : "",
          "Part_A.Back Side Image": csv2Row["Back Side Image"]
            ? csv2Row["Back Side Image"].trim()
            : "",
          "Part_A.Remarks": "",
          "Part_A.Edited": "",
          Correction: "",
          "Part_C.Sno": csv1Row["SLNO"] ? csv1Row["SLNO"].trim() : "",
          "Part_C.Barcode": bar1Value,
          Marks_Obt: csv1Row["TOT_MARKS"] ? csv1Row["TOT_MARKS"].trim() : "",
          Max_Marks: csv1Row["M_MARKS"] ? csv1Row["M_MARKS"].trim() : "",
          Ans_Book_Code: csv1Row["ANS_CODE"] ? csv1Row["ANS_CODE"].trim() : "",
          Packet_ID: "",
          "Part_C.Front Side Image": csv1Row["Front side Image"]
            ? csv1Row["Front side Image"].trim()
            : "",
          "Part_C.Back Side Image": csv1Row["Back Side Image"]
            ? csv1Row["Back Side Image"].trim()
            : "",
          "Part_C.Remarks": "",
          "Part_C.Edited": "",
          FLD_1: "",
          FLD_2: "",
          FLD_3: "",
          FLD_4: "",
          FLD_5: "",
          FLD_6: "",
          FLD_7: "",
          FLD_8: "",
          FLD_9: "",
          FLD_10: "",
          FLD_11: "",
          FLD_12: "",
          FLD_13: "",
          FLD_14: "",
          FLD_15: "",
        };

        // Store separately based on which CSV has the duplicate
        let isDuplicateCSV1 =
          duplicateCsv1Barcodes.has(bar1Value) ||
          duplicateCsv1Rollnos.has(mergedRow.Rollno);

        let isDuplicateCSV2 = duplicateCsv2Barcodes.has(bar1Value);

        if (isDuplicateCSV1) {
          duplicateDataCSV1.push(mergedRow);
          console.log(
            `Duplicate in CSV1: Barcode=${bar1Value}, Rollno=${mergedRow.Rollno}`
          );
        }

        if (isDuplicateCSV2) {
          duplicateDataCSV2.push(mergedRow);
          console.log(
            `Duplicate in CSV2: Barcode=${bar1Value}, Rollno=${mergedRow.Rollno}`
          );
        }

        // If it's not a duplicate in either CSV, store it in merged data
        if (!isDuplicateCSV1 && !isDuplicateCSV2) {
          mergedData.push(mergedRow);
        }
      }
    });

    return {
      headers: mergedHeaders,
      data: mergedData,
      duplicateDataCSV1,
      duplicateDataCSV2,
    };
  };

  const downloadXls = (
    mergedData,
    fileName,
    headers,
    duplicateDataCSV1,
    duplicateDataCSV2
  ) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(mergedData);

    // Insert blank rows (2 rows)
    const rowsBelow = 2; // Number of blank rows before inserting headers again
    const blankRows = Array.from({ length: rowsBelow }, () => ({})); // Empty row objects

    // Append merged data sheet
    XLSX.utils.book_append_sheet(wb, ws, "Merged Data");

    // Get the last row index of merged data
    const lastRow = ws["!ref"].split(":")[1];
    const lastRowIndex = parseInt(lastRow.replace(/[A-Za-z]/g, ""), 10);

    // Add blank rows after the merged data
    XLSX.utils.sheet_add_json(ws, blankRows, {
      skipHeader: true,
      origin: { r: lastRowIndex, c: 0 },
    });

    // === Add Duplicate Data Part_A Section ===
    XLSX.utils.sheet_add_json(ws, [{ "": "Duplicate Data Part_A" }], {
      skipHeader: true,
      origin: { r: lastRowIndex + rowsBelow, c: 0 },
    });

    // Add headers for duplicateDataCSV2
    XLSX.utils.sheet_add_json(ws, [headers], {
      skipHeader: true,
      origin: { r: lastRowIndex + rowsBelow + 1, c: 0 },
    });

    // Add duplicateDataCSV2 (Part_A)
    XLSX.utils.sheet_add_json(ws, duplicateDataCSV2, {
      skipHeader: true,
      origin: { r: lastRowIndex + rowsBelow + 2, c: 0 },
    });

    // === Add spacing before Part_C section ===
    const newLastRowIndex =
      lastRowIndex + rowsBelow + 2 + duplicateDataCSV2.length;
    XLSX.utils.sheet_add_json(ws, blankRows, {
      skipHeader: true,
      origin: { r: newLastRowIndex, c: 0 },
    });

    // === Add Duplicate Data Part_C Section ===
    XLSX.utils.sheet_add_json(ws, [{ "": "Duplicate Data Part_C" }], {
      skipHeader: true,
      origin: { r: newLastRowIndex + rowsBelow, c: 0 },
    });

    // Add headers for duplicateDataCSV1
    XLSX.utils.sheet_add_json(ws, [headers], {
      skipHeader: true,
      origin: { r: newLastRowIndex + rowsBelow + 1, c: 0 },
    });

    // Add duplicateDataCSV1 (Part_C)
    XLSX.utils.sheet_add_json(ws, duplicateDataCSV1, {
      skipHeader: true,
      origin: { r: newLastRowIndex + rowsBelow + 2, c: 0 },
    });

    // Write the file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <main className="flex flex-col gap-5 bg-white rounded-md bg-gradient-to-r from-blue-400 to-blue-600 h-[100vh]">
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
                    readFile(file, true).catch((err) =>
                      toast.error("Error reading file.")
                    );
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
                    readFile(file).catch((err) =>
                      toast.error("Error reading file.")
                    );
                  }
                }}
              />
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
          <div className="gap-2">
            <button
              onClick={() => downloadXls(cPartData, "C_PART.xlsx")}
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  rounded m-2"
            >
              Download Sample C_PART
            </button>
            <button
              onClick={() => downloadXls(aPartData, "A_PART.xlsx")}
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Download Sample A_PART
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CsvHomepage;
