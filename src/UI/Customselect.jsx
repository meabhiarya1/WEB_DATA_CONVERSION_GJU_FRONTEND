import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useContext } from "react";
import dataContext from "../Store/DataContext";

const Customselect = (props) => {
  const [selectValue, setSelectValue] = useState("");
  const dataCtx = useContext(dataContext);
  useEffect(() => {
    if (props.label === "Select Image Column") {
      dataCtx.setImageColName(selectValue); //taking time to select option
    } else {
      console.log("primary col trigerred");
      dataCtx.addToPrimaryKey(selectValue); //taking time to select option how can i improve ??
    }
  }, [selectValue]);

  const arr = dataCtx.csvHeader.map((item, index) => {
    return (
      <MenuItem key={index} value={item}>
        {item}
      </MenuItem>

    );
  });
  const handleChange = (event) => {
    setSelectValue(event.target.value);

  };

  return (
    <FormControl required sx={{ width: "100%" }}>
      <InputLabel id="demo-simple-select-required-label">
        {props.label}
      </InputLabel>
      <Select
        labelId="demo-simple-select-required-label"
        id="demo-simple-select-required"
        // value={age}
        value={selectValue}
        label={`${props.label} *`}
        sx={{
          "& .MuiSelect-select": {
            backdropFilter: "blur(5px)",
            fontWeight: "500",
          },
        }}
        MenuProps={{
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
          transformOrigin: { vertical: "top", horizontal: "left" },
          getcontentanchorel: null,
          PaperProps: {
            style: {
              maxHeight: "350px", // Adjust the maximum height of the dropdown menu
            },
          },
        }}
        onChange={handleChange}
      // disabled={dataCtx.csvHeader.length === 0 ? true : false}
      >
        {dataCtx.csvHeader.length === 0 && (
          <MenuItem value="">No Data present</MenuItem>
        )}
        {dataCtx.csvHeader.length !== 0 && arr}
      </Select>
      {/* <select onChange={handleChange}>{arr}</select> */}
      <FormHelperText>Required</FormHelperText>
    </FormControl>
  );
};

export default Customselect;
