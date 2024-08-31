import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { onGetTemplateHandler, REACT_APP_IP } from "../../services/common";
import HeaderData from "./HeaderData";
import HeaderMappedReview from "./HeaderMappedReview";

const TemplateMapping = () => {
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [templateHeaders, setTemplateHeaders] = useState();
  const [selectedAssociations, setSelectedAssociations] = useState({});
  const [showModal, setShowModal] = useState(false);

  const { id } = useParams();

  const navigate = useNavigate();
  let { fileId } = JSON.parse(localStorage.getItem("fileId")) || "";
  let token = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await onGetTemplateHandler();
        const templateData = response?.find((data) => data.id == id);
        for (let i = 1; i <= templateData.pageCount; i++) {
          templateData.templetedata.push({ attribute: `Image${i}` });
        }
        // templateData.templetedata.push({ attribute: "Image" });
        setTemplateHeaders(templateData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTemplate();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://${REACT_APP_IP}:4000/get/headerdata/${fileId}`,
          {
            headers: {
              token: token,
            },
          }
        );
        localStorage.setItem(
          "totalData",
          JSON.stringify(response.data.rowCount)
        );
        setCsvHeaders(response.data.headers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [fileId, token]);

  const handleCsvHeaderChange = (csvHeader, index) => {
    const updatedAssociations = { ...selectedAssociations };
    updatedAssociations[csvHeader] = index;
    setSelectedAssociations(updatedAssociations);

    csvHeaders.forEach((header) => {
      if (!(header in updatedAssociations)) {
        updatedAssociations[header] = "";
      }
    });

    setSelectedAssociations(updatedAssociations);
  };

  const handleTemplateHeaderChange = (csvHeader, templateHeader) => {
    const updatedAssociations = { ...selectedAssociations };

    if (templateHeader.includes("--")) {
      const [min, max] = templateHeader.split("--");
      const newMin = parseInt(min);
      const newMax = parseInt(max);
      // Loop through all headers

      Object.keys(selectedAssociations).forEach((header) => {
        const questionNumber = parseInt(header.replace(/\D/g, ""));
        if (questionNumber >= newMin && questionNumber <= newMax) {
          updatedAssociations[header] = templateHeader;
        }
      });
    } else if (templateHeader === "UserFieldName") {
      updatedAssociations[csvHeader] = "";
    } else {
      updatedAssociations[csvHeader] = templateHeader;
    }
    // Ensure all headers are included in updatedAssociations
    csvHeaders.forEach((header) => {
      if (!(header in updatedAssociations)) {
        updatedAssociations[header] = "";
      }
    });

    setSelectedAssociations(updatedAssociations);
  };

  const onMapSubmitHandler = async () => {
    const mappedvalues = Object.values(selectedAssociations);

    for (let i = 1; i <= templateHeaders.pageCount; i++) {
      if (!mappedvalues.includes(`Image${i}`)) {
        toast.error("Please select all the field properly.");
        return;
      }
    }

    const associationData = [];
    const obj = { ...selectedAssociations };
    for (let i = 0; i < csvHeaders.length; i++) {
      const header = csvHeaders[i];
      if (obj.hasOwnProperty(header)) {
        associationData.push({
          key: header,
          value: obj[header],
        });
      }
    }

    const mappedData = {
      associationData: associationData,
      fileId: fileId,
    };

    try {
      await axios.post(
        `http://${REACT_APP_IP}:4000/data`,
        { mappedData },
        {
          headers: {
            token: token,
          },
        }
      );
      toast.success("Mapping successfully done.");
      navigate(`/csvuploader/fieldDecision/${id}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-[100vh] overflow-y overflow-x-auto flex justify-center bg-gradient-to-r from-blue-400 to-blue-600 items-center templatemapping pt-20 pb-12">
      <div className="w-[900px] bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-blue-800 text-4xl text-center mb-10">Mapping</h1>
        <HeaderData
          csvHeaders={csvHeaders}
          handleTemplateHeaderChange={handleTemplateHeaderChange}
          templateHeaders={templateHeaders}
          selectedAssociations={selectedAssociations}
          handleCsvHeaderChange={handleCsvHeaderChange}
        />

        <HeaderMappedReview
          onMapSubmitHandler={onMapSubmitHandler}
          setShowModal={setShowModal}
          showModal={showModal}
          selectedAssociations={selectedAssociations}
        />
      </div>
    </div>


  );
};
export default TemplateMapping;
