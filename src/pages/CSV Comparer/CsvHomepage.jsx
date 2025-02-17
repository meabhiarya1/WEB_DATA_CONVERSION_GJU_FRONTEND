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
      // console.log(mergedData)
      // return
      toast.success("Files merged successfully.");

      const match = firstCsv?.name.match(/^\d+/);
      const result = match
        ? `${match[0]}.xlsx`
        : `${firstCsv.name.replace(/\.csv$/i, "")}.xlsx`;
      downloadXls(mergedData.data, result);
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
                  rowObject[header] = row[index];
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

  const mergeCsvData = (csv1Data, csv2Data) => {
    const mergedHeaders = [...mainHeaders];

    const csv2Map = new Map();
    csv2Data.forEach((row) => {
      if (row.BAR1) {
        csv2Map.set(row.BAR1, row);
      }
    });

    const mergedData = csv1Data.map((csv1Row, index) => {
      const bar1Value = csv1Row.BAR1;
      const csv2Row = csv2Map.get(Number(bar1Value));

      return {
        "Part_A.Sno": csv2Row["SLNO"] || "",
        "Part_A.Barcode": bar1Value || "",
        "Answer Sheet No": csv1Row["ANS_CODE"],
        Rollno: String(csv2Row["ROLL"] || ""),
        Paper_ID: csv2Row["ID"] || "",
        Exam_Code: csv2Row["E_CODE"] || "",
        "Part_A.Front Side Image": csv2Row["Front side Image"] || "",
        "Part_A.Back Side Image": csv2Row["Back Side Image"] || "",
        "Part_A.Remarks": "",
        "Part_A.Edited": "",
        Correction: "",
        "Part_C.Sno": csv1Row["SLNO"] || "",
        "Part_C.Barcode": bar1Value || "",
        Marks_Obt: csv1Row["TOT_MARKS"] || "",
        Max_Marks: csv1Row["M_MARKS"] || "",
        Ans_Book_Code: csv1Row["ANS_CODE"] || "",
        Packet_ID: "",
        "Part_C.Front Side Image": csv1Row["Front side Image"] || "",
        "Part_C.Back Side Image": csv1Row["Back side Image"] || "",
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
    });
    return { headers: mergedHeaders, data: mergedData };
  };

  const downloadXls = (mergedData, fileName) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(mergedData);
    XLSX.utils.book_append_sheet(wb, ws, "Merged Data");
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
