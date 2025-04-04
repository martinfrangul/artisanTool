import { motion } from "framer-motion";
import Select from "react-select";
import Creatable from "react-select/creatable";
import { useState, useEffect } from "react";
import deleteIcon from "/assets/deleteIcon.png";

const PropertyInput = ({
  index,
  input,
  updatePropertyField,
  deleteInput,
  properties,
  options,
  existingProperties,
}) => {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [currentOption, setCurrentOption] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const selectedProperties = properties.map((p) => p.property);
    const newFilteredOptions = options.filter(
      (option) =>
        option.value === "" ||
        !selectedProperties.includes(option.value) ||
        option.value === input.property
    );
    setFilteredOptions(newFilteredOptions);
  }, [properties, input.property, options]);

  useEffect(() => {
    if (input.property && existingProperties[input.property]) {
      const filteredSuggestions = existingProperties[input.property]
        .filter((suggestion) =>
          suggestion.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((suggestion) => ({ label: suggestion, value: suggestion }));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [input.property, inputValue, existingProperties]);

  useEffect(() => {
    setCurrentOption(
      input.option ? { label: input.option, value: input.option } : null
    );
  }, [input.option]);

  const handlePropertyChange = (selectedOption) => {
    updatePropertyField(
      index,
      "property",
      selectedOption ? selectedOption.value : ""
    );
    updatePropertyField(index, "option", "");
    setCurrentOption(null);
  };

  const handleOptionChange = (selectedOption) => {
    setCurrentOption(selectedOption);
    updatePropertyField(
      index,
      "option",
      selectedOption ? selectedOption.value : ""
    );
  };

  const handleCreateOption = (inputValue) => {
    const newOption = { label: inputValue, value: inputValue };
    setSuggestions((prevSuggestions) => [...prevSuggestions, newOption]);
    setCurrentOption(newOption);
    updatePropertyField(index, "option", inputValue);
  };

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleBlur = () => {
    if (
      inputValue &&
      !suggestions.some((option) => option.value === inputValue)
    ) {
      handleCreateOption(inputValue);
    }
    setInputValue(""); // Clear input value on blur
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-row gap-4 p-x2 justify-center items-start"
      key={index}
    >
      <div className="flex flex-col justify-center items-center px-3 gap-2 w-full md:w-1/4">
        <label htmlFor={`property-${index}`}>Propiedad</label>
        <Select
          inputId={`property-${index}`}
          options={filteredOptions.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          onChange={handlePropertyChange}
          value={
            filteredOptions.find((option) => option.value === input.property) ||
            null
          }
          className="w-full"
          menuPortalTarget={document.body} // Esto mueve el menú al body y evita recortes
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Asegura que el menú esté sobre otros elementos
            menu: (base) => ({
              ...base,
              maxHeight: "200px", // Agrega un límite de altura
              overflowY: "auto", // Habilita el scroll
            }),
            menuList: (base) => ({
              ...base,
              maxHeight: "200px", // Asegura que el contenido del menú también tenga un límite de altura
              overflowY: "auto", // Habilita el scroll en el contenido del menú
              WebkitOverflowScrolling: "touch", // Mejora el scroll en dispositivos táctiles
            }),
          }}
        />
      </div>
      <div className="flex flex-col justify-center items-center px-3 gap-2 w-full md:w-1/4">
        <label htmlFor={`option-${index}`}>Opción</label>
        <Creatable
          inputId={`option-${index}`}
          options={suggestions}
          onChange={handleOptionChange}
          onCreateOption={handleCreateOption}
          value={
            currentOption ||
            suggestions.find((option) => option.value === input.option) ||
            null
          }
          placeholder="(Opcional)"
          className="w-full"
          onInputChange={handleInputChange}
          onBlur={handleBlur}
        />
        <div className="flex justify-end w-full mt-2">
          <button
            className="w-8 h-8 text-white rounded"
            onClick={() => deleteInput(index)}
          >
            <img src={deleteIcon} alt="delete-inputs" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyInput;
