import { createContext } from "react";

const ResultGenerationContext = createContext({
  uploadKeyHeaders: () => {},
  uploadDataHeaders: () => {},

  subjectMarkHandler: () => {},
  paperMarkHandler: () => {},
  paperMarkings: {},
  keyHeaders: null,
  dataHeaders: null,
  subjectMarkings: [],
  uploadFiles: [],
  uploadFilesHandler: () => {},
  paperKeyHandler:()=>{},
  paperMappedKey:null,
  deleteSubjectHandler:()=>{}
});
export default ResultGenerationContext;
