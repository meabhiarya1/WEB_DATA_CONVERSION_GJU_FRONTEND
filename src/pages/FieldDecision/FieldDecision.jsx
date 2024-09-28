import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { REACT_APP_IP, onGetTemplateHandler } from "../../services/common";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormField from "./FormField";
import QuestionField from "./QuestionField";
import CheckedDataConfirmation from "./CheckedDataConfirmation";


const FieldDecision = () => {
  const [checkedData, setCheckedData] = useState(null);
  const [formFields, setFormField] = useState([]);
  const [questionsField, setQuestionsField] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  let token = JSON.parse(localStorage.getItem("userData"));
  let { fileId } = JSON.parse(localStorage.getItem("fileId")) || "";

  useEffect(() => {
    const fetchMappedData = async () => {
      try {
        const template = await onGetTemplateHandler();
        const response = await axios.get(
          `http://${REACT_APP_IP}:4000/get/mappeddata/${id}`,
          {
            headers: {
              token: token,
            },
          }
        );
        const selectedTemplate = template.find((data) => data.id == id);

        // Initialize arrays to hold the separated fields
        const formField = {};
        const questionsFields = [];

        // Iterate over templateHeaders and categorize based on typeField
        Object.entries({ ...response?.data }).map(([key, value], i) => {
          const templateData = selectedTemplate?.templetedata?.find((data) => {
            if (data.attribute === value && data.fieldType === "formField") {
              formField[i] = key;
            }
          });
        });

        Object.entries({ ...response?.data }).map(([key, value], i) => {
          const templateData = selectedTemplate?.templetedata?.find((data) => {
            if (
              data.attribute === value &&
              data.fieldType === "questionsField"
            ) {
              questionsFields[i] = key;
            }
          });
        });

        let transformedData = {};

        for (let key in response?.data) {
          transformedData[key] = {
            value: response?.data[key],
            legal: false,
            blank: false,
            pattern: false,
          };
        }

        setCheckedData(transformedData);

        setFormField(formField);
        setQuestionsField(questionsFields);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchMappedData();
  }, []);

  const onCheckBoxHandler = (key, pattern) => {
    const obj = { ...checkedData };
    if (pattern === "Legal") {
      obj[key].legal = !obj[key].legal;
    } else if (pattern === "Pattern") {
      obj[key].pattern = !obj[key].pattern;
    } else if (pattern === "Blank") {
      obj[key].blank = !obj[key].blank;
    }

    setCheckedData(obj);
  };

  const setAllProperties = (key, fieldType) => {
    const updatedData = { ...checkedData };

    if (fieldType === "formField") {
      const formDataArr = Object.values(formFields);
      for (let data in updatedData) {
        if (formDataArr?.includes(data)) {
          updatedData[data][key] = !updatedData[data][key];
        }
      }
    } else if (fieldType === "questionsField") {
      const questionDataArr = questionsField;
      for (let data in updatedData) {
        if (questionDataArr.includes(data)) {
          updatedData[data][key] = !updatedData[data][key];
        }
      }
    }

    setCheckedData(updatedData);
  };

  const onChekedDataHandler = async () => {
    setLoading(true);
    try {
      await axios.post(
        `http://${REACT_APP_IP}:4000/formcheckeddata`,
        { formCheckedData: checkedData, fileID: fileId },
        {
          headers: {
            token: token,
          },
        }
      );
      setLoading(false);
      toast.success("Check Data added successfully.");
      navigate(`/csvuploader/taskAssign/${id}`);
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 py-6 flex flex-col justify-center sm:py-12">
      <div className="container mx-auto px-4 sm:px-8">
        {/* Header Section with Submit Button */}
        <div className="flex justify-between items-center mt-12">
          <h1 className="text-2xl font-semibold text-white">
            Field Decision
          </h1>
          <button
            onClick={() => setConfirmModal(true)}
            className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-8 rounded"
          >
            Save
          </button>
        </div>
        {/* Form Fields Section */}
        <FormField
          setAllProperties={setAllProperties}
          formFields={formFields}
          checkedData={checkedData}
          onCheckBoxHandler={onCheckBoxHandler}
        />
        {/* Questions Section */}
        <QuestionField
          setAllProperties={setAllProperties}
          questionsField={questionsField}
          checkedData={checkedData}
          onCheckBoxHandler={onCheckBoxHandler}
        />

        {/* Confirmation Modal */}

        <CheckedDataConfirmation
          confirmModal={confirmModal}
          setConfirmModal={setConfirmModal}
          onChekedDataHandler={onChekedDataHandler}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default FieldDecision;
