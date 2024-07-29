// PropertyInput.js
import deleteIcon from "../assets/deleteIcon.png";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const PropertyInput = ({ index, input, updatePropertyField, deleteInput }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-row gap-4 p-x2 justify-center items-start"
      key={index}
    >
      <div className="flex flex-col justify-center items-center px-3 gap-2 w-full">
        <label htmlFor="property">Propiedad</label>
        <select
          className="h-fit border-1 border-solid border-black rounded-md shadow-inner p-2 shadow-slate-700"
          name="properties"
          id={index}
          value={input.property}

          onChange={(event) => updatePropertyField(index, "property", event.target.value)}
        >
          <option value="" disabled>(Opcional)</option>
          <option value="model">Modelo</option>
          <option value="size">Tamaño</option>
          <option value="design">Diseño</option>
          <option value="color">Color</option>
          <option value="type">Tipo</option>
        </select>
      </div>
      <div className="flex flex-col justify-center items-center px-3 gap-2 w-full">
        <label htmlFor="option">Opción</label>
        <input
        placeholder="(Opcional)"
          id={index}
          className="border-1 border-solid border-black rounded-md shadow-inner p-2 shadow-slate-700"
          onChange={(event) =>
            updatePropertyField(index, "option", event.target.value)
          }
          type="text"
          value={input.option}
        />
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
  updatePropertyField: PropTypes.func,
  deleteInput: PropTypes.func.isRequired,
};

export default PropertyInput;
