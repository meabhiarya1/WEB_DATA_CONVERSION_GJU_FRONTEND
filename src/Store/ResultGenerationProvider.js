import React, { useReducer } from "react";
import ResultGenerationContext from "./ResultGenerationContext";
const initialState = {
  keyHeaders: null,
  dataHeaders: null,
  subjectWiseMarking: [],
  uploadFiles: [],
  mappedKey: null,
  paperWiseMarking: { start: null, end: 100, correctPoint: 1, wrongPoint: 0 },
};
const reducerfn = (state, action) => {
  if (action.type == "uploadKeyHeaders") {
    return { ...state, keyHeaders: action.payload };
  }
  if (action.type == "uploadDataHeaders") {
    return { ...state, dataHeaders: action.payload };
  }
  if (action.type == "subjectMarking") {
    return {
      ...state,
      subjectWiseMarking: [...state.subjectWiseMarking, action.payload],
    };
  }
  if (action.type === "fileHandle") {
    return { ...state, uploadFiles: [...state.uploadFiles, action.payload] };
  }
  if (action.type == "paperMarking") {
    return {
      ...state,
      paperWiseMarking: { ...state.paperWiseMarking, ...action.payload },
    };
  }
  if (action.type == "paperKeyMapper") {
    return { ...state, mappedKey: action.payload };
  }
  if (action.type == "deleteSubject") {
    const subjectArray = state.subjectWiseMarking;
   
    const filteredItems = subjectArray.filter(
      (current) => current.subject != action.payload
    );
 
    return {...state,subjectWiseMarking:filteredItems}
  }

  return state;
};

const ResultGenerationProvider = (props) => {
  const [currentState, dispatch] = useReducer(reducerfn, initialState);
  const keyHeadersHandler = (headers) => {
    dispatch({ type: "uploadKeyHeaders", payload: headers });
  };
  const dataHeadersHandler = (headers) => {
    dispatch({ type: "uploadDataHeaders", payload: headers });
  };
  const subjectMarkHandler = (subjectData) => {
    dispatch({ type: "subjectMarking", payload: subjectData });
  };
  const uploadFilesHandler = (fileName) => {
    dispatch({ type: "fileHandle", payload: fileName });
  };
  const paperMarkHandler = (paperData) => {
    dispatch({ type: "paperMarking", payload: paperData });
  };
  const paperKeyHandler = (keyValue) => {
    dispatch({ type: "paperKeyMapper", payload: keyValue });
  };
  const deleteSubjectHandler = (subName) => {
    dispatch({ type: "deleteSubject", payload: subName });
  };
  const ResultGenData = {
    subjectMarkHandler: subjectMarkHandler,
    uploadKeyHeaders: keyHeadersHandler,
    uploadDataHeaders: dataHeadersHandler,
    keyHeaders: currentState.keyHeaders,
    dataHeaders: currentState.dataHeaders,
    subjectMarkings: currentState.subjectWiseMarking,
    uploadFilesHandler: uploadFilesHandler,
    uploadFiles: currentState.uploadFiles,
    paperMarkHandler: paperMarkHandler,
    paperMarkings: currentState.paperWiseMarking,
    paperKeyHandler: paperKeyHandler,
    paperMappedKey: currentState.mappedKey,
    deleteSubjectHandler: deleteSubjectHandler,
  };
  return (
    <ResultGenerationContext.Provider value={ResultGenData}>
      {props.children}
    </ResultGenerationContext.Provider>
  );
};

export default ResultGenerationProvider;
