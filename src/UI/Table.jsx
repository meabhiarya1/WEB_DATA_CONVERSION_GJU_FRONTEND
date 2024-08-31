import React, { useEffect, useRef, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";
import { REACT_APP_IP } from "../services/common";
import axios from "axios";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}
const TableCol = (props) => {
  const [resultObj, setResultObj] = useState([]);
  const inputRef = useRef();
  const { PRIMARY, COLUMN_NAME, FILE_1_DATA, FILE_2_DATA, CORRECTED } =
    props.data;
  const token = JSON.parse(localStorage.getItem("userData"));
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Tab" || event.key === "Alt") {
        event.preventDefault(); // Prevent the default behavior for Tab and Alt keys
        inputRef.current.focus(); // Keep focus on the input element
      }
    };

    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        inputRef.current.focus(); // Keep focus on the input element if clicked outside
      }
    };

    document.addEventListener("keydown", handleKeyDown); // Listen for keydown event
    document.addEventListener("click", handleClickOutside); // Listen for click event

    return () => {
      document.removeEventListener("keydown", handleKeyDown); // Clean up keydown event listener
      document.removeEventListener("click", handleClickOutside); // Clean up click event listener
    };
  }, [props.data]);

  useEffect(() => {
    inputRef.current.focus();
  }, [props.data]);

  useEffect(() => {
    const parsedData = JSON.parse(CORRECTED);
    let found = false;

    for (let i = 0; i < parsedData.length; i++) {
      for (let [key, value] of Object.entries(parsedData[i])) {
        if (key === COLUMN_NAME) {
          found = true;
          inputRef.current.value = value;
          break; // No need to continue loop if match is found
        }
      }
    }
    if (!found) {
      inputRef.current.value = "";
    }
  }, [props.data]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "s") {
        const btn = document.getElementById("saveBtn");
        const nextBtn = document.getElementById("nextBtn");
        nextBtn.click();
        btn.click();
      }
    };

    // Attach the event listener when the component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const rows = [createData(PRIMARY, COLUMN_NAME, FILE_1_DATA, FILE_2_DATA)];
  const save = () => {
    const { index, taskId, data } = props;
    const { COLUMN_NAME } = data;
    const req = async () => {
      const response = await axios.post(
        `http://${REACT_APP_IP}:4000/saveAnswer/${taskId}`,

        {
          currentIndexValue: index,
          column_name: COLUMN_NAME,
          corrected_value: inputRef.current.value,
        },
        {
          headers: {
            token: token,
          },
        }
      );
    };
    req();
    const nextBtn = document.getElementById("nextBtn");
    nextBtn.click();
  };
  const saveHandler = () => {
    const capitalStrArr = ["A", "B", "C", "D"];
    const isUpperCase1 = /^[A-Z]+$/.test(resultObj.FILE_1_DATA);
    const isUpperCase2 = /^[A-Z]+$/.test(resultObj.FILE_2_DATA);
    const isLowererCase1 = /^[a-z]+$/.test(resultObj.FILE_1_DATA);
    const isLowererCase2 = /^[a-z]+$/.test(resultObj.FILE_2_DATA);

    if (
      typeof resultObj.FILE_1_DATA === "string" ||
      typeof resultObj.FILE_2_DATA === "string"
    ) {
      if (!isNaN(inputRef.current.value)) {
        var result = window.confirm("Please check the input type");
        if (result) {
          save();
          toast.success("Saved file successfully", {
            position: "bottom-left",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.warning("File Not Saved", {
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
        return;
      } else if (isUpperCase1 || isUpperCase2) {
        if (!capitalStrArr.includes(inputRef.current.value)) {
          var result = window.confirm(
            "Answer out of bound, Do you still want to save ?"
          );
          if (result) {
            save();
            toast.success("Saved file successfully", {
              position: "bottom-left",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } else {
            toast.warning("File Not Saved", {
              position: "bottom-left",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          }
          return;
        } else {
          save();
          toast.success("Saved file successfully", {
            position: "bottom-left",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      } else if (isLowererCase1 || isLowererCase2) {
        if (!capitalStrArr.includes(inputRef.current.value)) {
          var result = window.confirm(
            "Answer out of bound, Do you still want to save ?"
          );
          if (result) {
            save();
            toast.success("Saved file successfully", {
              position: "bottom-left",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } else {
            toast.warning("File Not Saved", {
              position: "bottom-left",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          }
          return;
        } else {
          save();
          toast.success("Saved file successfully", {
            position: "bottom-left",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      }
    } else if (
      typeof resultObj.FILE_1_DATA === "number" ||
      typeof resultObj.FILE_2_DATA === "number"
    ) {
      if (isNaN(inputRef.current.value)) {
        alert("Please check the string");
      }
    } else {
      save();
      toast.success("Saved file successfully", {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="caption table">
        <caption>
          Match and correct the data According to above data table
        </caption>
        <TableHead>
          <TableRow>
            <TableCell>PRIMARY</TableCell>
            <TableCell align="right">COLUMN_NAME</TableCell>
            <TableCell align="right">FILE_1_DATA</TableCell>
            <TableCell align="right">FILE_2_DATA</TableCell>
            <TableCell align="right">ENTER CORRECTED DATA</TableCell>
            <TableCell align="right">SAVE BUTTON</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">
                <input
                  type="text"
                  placeholder="Enter correct answer"
                  className="border p-3 w-2/3"
                  ref={inputRef}
                />
              </TableCell>
              <TableCell align="right">
                <Button
                  startIcon={<SaveIcon />}
                  variant="outlined"
                  color="success"
                  onClick={saveHandler}
                  id="saveBtn"
                >
                  SAVE
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableCol;
