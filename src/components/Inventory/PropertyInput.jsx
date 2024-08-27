import deleteIcon from "../../assets/deleteIcon.png";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const PropertyInput = ({ index, input, updatePropertyField, deleteInput, properties, options, existingProperties }) => {
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const selectedProperties = properties.map(p => p.property);
    const newFilteredOptions = options.filter(option => 
      option.value === "" || !selectedProperties.includes(option.value) || option.value === input.property
    );
    setFilteredOptions(newFilteredOptions);
  }, [properties, input.property, options]);

  useEffect(() => {
    if (input.property && existingProperties[input.property]) {
      setSuggestions(existingProperties[input.property].filter(suggestion =>
        suggestion.toLowerCase().includes(input.option.toLowerCase())
      ));
    } else {
      setSuggestions([]);
    }
  }, [input.property, input.option, existingProperties]);

  const handleSelectChange = (event) => {
    const { value } = event.target;
    updatePropertyField(index, "property", value);
    updatePropertyField(index, "option", "");
  };

  const handleInputChange = (event) => {
    updatePropertyField(index, "option", event.target.value);
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
        <label htmlFor="property">Propiedad</label>
        <select
          className="border-1 border-solid border-black rounded-md shadow-inner md:w-full p-2 shadow-slate-700 text-center"
          name="properties"
          id={index}
          value={input.property}
          onChange={handleSelectChange}
        >
          {filteredOptions.map((option, idx) => (
            <option key={idx} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col justify-center items-center px-3 gap-2 w-full md:w-1/4">
        <label htmlFor="option">Opción</label>
        <input
          placeholder="(Opcional)"
          id={index}
          className="border-1 border-solid border-black rounded-md shadow-inner md:w-full p-2 shadow-slate-700"
          onChange={handleInputChange}
          type="text"
          value={input.option}
          list={`suggestions-${index}`}
        />
        {suggestions.length > 0 && (
          <datalist id={`suggestions-${index}`}>
            {suggestions.map((suggestion, idx) => (
              <option key={idx} value={suggestion} />
            ))}
          </datalist>
        )}
        <div className="flex justify-end w-full">
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

PropertyInput.propTypes = {
  index: PropTypes.number.isRequired,
  input: PropTypes.shape({
    property: PropTypes.string.isRequired,
    option: PropTypes.string.isRequired,
  }).isRequired,
  updatePropertyField: PropTypes.func.isRequired,
  deleteInput: PropTypes.func.isRequired,
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      property: PropTypes.string.isRequired,
      option: PropTypes.string
    })
  ).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool
    })
  ).isRequired,
  existingProperties: PropTypes.object.isRequired
};

export default PropertyInput;
