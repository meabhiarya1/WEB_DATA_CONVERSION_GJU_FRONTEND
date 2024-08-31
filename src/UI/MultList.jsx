import React, { useState, useContext, useMemo } from "react";
import {
  Box,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Checkbox,
  IconButton,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import { debounce } from "lodash";
import dataContext from "../Store/DataContext";

const MultList = () => {
  const [checked, setChecked] = useState([]);
  const dataCtx = useContext(dataContext);

  const handleToggle = useMemo(
    () =>
      debounce((value) => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
        dataCtx.setFormFeilds(newChecked);
        setChecked(newChecked);
      }, 300),
    [checked]
  );

  const headerList = useMemo(
    () =>
      dataCtx.csvHeader.map((item, index) => {
        const labelId = `checkbox-list-label-${item}`;
        return (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" aria-label="comments">
                <CommentIcon />
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton
              role={undefined}
              onClick={() => handleToggle(item)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(item) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${item} `} />
            </ListItemButton>
          </ListItem>
        );
      }),
    [dataCtx.csvHeader, checked, handleToggle]
  );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "30dvh",
        maxHeight: "30dvh",
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
        bgcolor: "transparent",
      }}
    >
      {dataCtx.csvHeader.length === 0 && (
        <div className="mt-20">
          <h1 className="flex justify-center align-middle">
            <strong>No Header Present</strong>
          </h1>
          <h2 className="flex justify-center align-middle">
            Please select CSV files
          </h2>
        </div>
      )}
      {dataCtx.csvHeader.length !== 0 && headerList}
    </Box>
  );
};
export default MultList;
