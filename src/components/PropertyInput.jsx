// PropertyInput.js
import deleteIcon from "../assets/deleteIcon.png";
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const PropertyInput = ({ index, input, handleInputChange, deleteInput }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-row gap-4 p-2 justify-center items-start"
      key={index}
    >
      <div className="flex flex-col justify-center items-center p-3 gap-2 w-1/2">
        <label htmlFor="property">Property</label>
        <input
          id={index}
          className="h-fit border-1 border-solid border-black rounded-md shadow-inner p-2 shadow-slate-700 ml-2"
          onChange={(event) => handleInputChange(index, "property", event.target.value)}
          type="text"
          value={input.property}
        />
      </div>
      <div className="flex flex-col justify-center items-center p-3 gap-2 w-1/2">
        <label htmlFor="option">Option</label>
        <input
          id={index}
          className="border-1 border-solid border-black rounded-md shadow-inner p-2 shadow-slate-700 mr-2"
          onChange={(event) => handleInputChange(index, "option", event.target.value)}
          type="text"
          value={input.option}
        />
        <div className="flex justify-end w-full">
          <button
            className="p-2 w-10 h-10 text-white rounded"
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
      option: PropTypes.string.isRequired
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired,
    deleteInput: PropTypes.func.isRequired
  };

export default PropertyInput;
