import { useState } from "react";
import DataContext from "./DataContext";

const initialData = {
  csvHeader: [],
  isLogin: localStorage.getItem("userData") ? true : false,
  primaryKey: "",
  skippingKey: [],
  firstInputFileName: "",
  secondInputFileName: "",
  firstInputCsvFiles: [],
  secondInputCsvFiles: [],
  correctedCsv: {},
  zipImageFile: [],
  imageColName: "",
  imageMappedData: [],
  csvFile: [],
  isLoading: false,
  csvDataWithImage: [],
  userData: {},
  uploadZipImage: [],
  formFeilds: [],
  templateData: {},
};

const DataProvider = (props) => {
  const [dataState, setDataState] = useState(initialData);

  const addToCsvHeaderHandler = (data) => {
    setDataState((item) => {
      return {
        ...item,
        csvHeader: data,
      };
    });
  };
  const addToPrimaryKeyHandler = (key) => {
    setDataState((item) => {
      return {
        ...item,
        primaryKey: key,
      };
    });
  };
  const addToSkippingKeyHandler = (data) => {
    setDataState((item) => {
      return {
        ...item,
        skippingKey: data,
      };
    });
  };
  const addFirstInputFileNameHandler = (name) => {
    setDataState((item) => {
      return {
        ...item,
        firstInputFileName: name,
      };
    });
  };
  const addSecondInputFileNameHandler = (name) => {
    setDataState((item) => {
      return {
        ...item,
        secondInputFileName: name,
      };
    });
  };
  const addFirstInputCsvFileHandler = (file) => {
    setDataState((item) => {
      return {
        ...item,
        firstInputCsvFiles: file,
      };
    });
  };
  const addSecondInputCsvFileHandler = (file) => {
    setDataState((item) => {
      return {
        ...item,
        secondInputCsvFiles: file,
      };
    });
  };
  const addToCorrectedCsvHandler = (data) => {
    setDataState((item) => {
      return {
        ...item,
        correctedCsv: data,
      };
    });
  };
  const addZipImageFileHandler = (file) => {
    setDataState((item) => {
      return {
        ...item,
        zipImageFile: file,
      };
    });
  };
  const setImageColNameHandler = (name) => {
    setDataState((item) => {
      return {
        ...item,
        imageColName: name,
      };
    });
  };
  const setImageMappedDataHandler = (data) => {
    setDataState((item) => {
      return {
        ...item,
        imageMappedData: data,
      };
    });
  };
  const setCsvFileHandler = (data) => {
    setDataState((item) => {
      return {
        ...item,
        csvFile: data,
      };
    });
  };
  const setCsvDataWithImageHandler = (data) => {
    setDataState((item) => {
      return {
        ...item,
        csvDataWithImage: data,
      };
    });
  };
  const modifyIsloginHandler = (state) => {
    setDataState((item) => {
      return {
        ...item,
        isLogin: state,
      };
    });
  };
  const modifyIsLoadingHandler = (state) => {
    setDataState((item) => {
      return {
        ...item,
        isLoading: state,
      };
    });
  };
  const modifyAuthHandler = (state) => {
    setDataState((item) => {
      return {
        ...item,
        userData: state,
      };
    });
  };
  const modifyLoginDataHandler = (state) => {
    setDataState((item) => {
      return {
        ...item,
        userData: state,
      };
    });
  };
  const setUploadZipImageHandler = (state) => {
    setDataState((item) => {
      return {
        ...item,
        uploadZipImage: state,
      };
    });
  };
  const setFormFeildsHandler = (state) => {
    setDataState((item) => {
      return {
        ...item,
        formFeilds: state,
      };
    });
  };

  const modifyTemplateDataHandler = (templateData) => {
    setDataState((item) => {
      return {
        ...item,
        templateData: templateData,
      };
    });
  };

  const dataContext = {
    isLogin: dataState.isLogin,
    loginData: dataState.loginData,
    csvHeader: dataState.csvHeader,
    primaryKey: dataState.primaryKey,
    skippingKey: dataState.skippingKey,
    firstInputFileName: dataState.firstInputFileName,
    secondInputFileName: dataState.secondInputFileName,
    firstInputCsvFiles: dataState.firstInputCsvFiles,
    secondInputCsvFiles: dataState.secondInputCsvFiles,
    correctedCsv: dataState.correctedCsv,
    zipImageFile: dataState.zipImageFile,
    imageColName: dataState.imageColName,
    imageMappedData: dataState.imageMappedData,
    csvFile: dataState.csvFile,
    csvDataWithImage: dataState.csvDataWithImage,
    isLoading: dataState.isLoading,
    userData: dataState.userData,
    uploadZipImage: dataState.uploadZipImage,
    formFeilds: dataState.formFeilds,
    templateData: dataState.templateData,
    modifyTemplateData: modifyTemplateDataHandler,
    modifyAuth: modifyAuthHandler,
    modifyLoginData: modifyLoginDataHandler,
    modifyIsLoading: modifyIsLoadingHandler,
    modifyIslogin: modifyIsloginHandler,
    addToCsvHeader: addToCsvHeaderHandler,
    addToPrimaryKey: addToPrimaryKeyHandler,
    addToSkippingKey: addToSkippingKeyHandler,
    addFirstInputFileName: addFirstInputFileNameHandler,
    addSecondInputFileName: addSecondInputFileNameHandler,
    addFirstInputCsvFile: addFirstInputCsvFileHandler,
    addSecondInputCsvFile: addSecondInputCsvFileHandler,
    addToCorrectedCsv: addToCorrectedCsvHandler,
    addZipImageFile: addZipImageFileHandler,
    setImageColName: setImageColNameHandler,
    setImageMappedData: setImageMappedDataHandler,
    setCsvFile: setCsvFileHandler,
    setCsvDataWithImage: setCsvDataWithImageHandler,
    setUploadZipImage: setUploadZipImageHandler,
    setFormFeilds: setFormFeildsHandler,
  };

  return (
    <DataContext.Provider value={dataContext}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataProvider;
