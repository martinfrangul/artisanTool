import deleteIcon from "../../assets/deleteIcon.png";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const PropertyInput = ({ index, input, updatePropertyField, deleteInput, properties, options }) => {

  

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
          className="border-1 border-solid border-black rounded-md shadow-inner p-2 shadow-slate-700 text-center"
          name="properties"
          id={index}
          value={input.property}

          onChange={(event) => updatePropertyField(index, "property", event.target.value)}
        >
           {options.map((option, idx) => (
            <option key={idx} value={option.value} disabled={option.disabled || properties.some(p => p.property === option.value && p.property !== input.property)}>
              {option.label}
            </option>
          ))}
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
  ).isRequired
};

export default PropertyInput;



// OPCION PARA FILTRAR Y NO INCLUIR LAS PROPIEDADES EN LA LISTA

// import deleteIcon from "../../assets/deleteIcon.png";
// import { motion } from "framer-motion";
// import PropTypes from "prop-types";
// import { useEffect, useState } from "react";

// const PropertyInput = ({ index, input, updatePropertyField, deleteInput, properties }) => {
//   const initialOptions = [
//     { value: "", label: "(Opcional)", disabled: true },
//     { value: "model", label: "Modelo" },
//     { value: "size", label: "Tamaño" },
//     { value: "design", label: "Diseño" },
//     { value: "color", label: "Color" },
//     { value: "type", label: "Tipo" }
//   ];

//   const [filteredOptions, setFilteredOptions] = useState(initialOptions);

//   useEffect(() => {
//     const selectedProperties = properties.map(p => p.property);
//     const newFilteredOptions = initialOptions.filter(option => 
//       option.value === "" || !selectedProperties.includes(option.value) || option.value === input.property
//     );
//     setFilteredOptions(newFilteredOptions);
//   }, [properties, input.property]);

//   const handleSelectChange = (event) => {
//     const { value } = event.target;
//     updatePropertyField(index, "property", value);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="flex flex-row gap-4 p-x2 justify-center items-start"
//       key={index}
//     >
//       <div className="flex flex-col justify-center items-center px-3 gap-2 w-full">
//         <label htmlFor="property">Propiedad</label>
//         <select
//           className="h-fit border-1 border-solid border-black rounded-md shadow-inner p-2 shadow-slate-700"
//           name="properties"
//           id={index}
//           value={input.property}
//           onChange={handleSelectChange}
//         >
//           {filteredOptions.map((option, idx) => (
//             <option key={idx} value={option.value} disabled={option.disabled}>
//               {option.label}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="flex flex-col justify-center items-center px-3 gap-2 w-full">
//         <label htmlFor="option">Opción</label>
//         <input
//           placeholder="(Opcional)"
//           id={index}
//           className="border-1 border-solid border-black rounded-md shadow-inner p-2 shadow-slate-700"
//           onChange={(event) =>
//             updatePropertyField(index, "option", event.target.value)
//           }
//           type="text"
//           value={input.option}
//         />
//         <div className="flex justify-end w-full">
//           <button
//             className="w-8 h-8 text-white rounded"
//             onClick={() => deleteInput(index)}
//           >
//             <img src={deleteIcon} alt="delete-inputs" />
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// PropertyInput.propTypes = {
//   index: PropTypes.number.isRequired,
//   input: PropTypes.shape({
//     property: PropTypes.string.isRequired,
//     option: PropTypes.string.isRequired,
//   }).isRequired,
//   updatePropertyField: PropTypes.func.isRequired,
//   deleteInput: PropTypes.func.isRequired,
//   properties: PropTypes.arrayOf(PropTypes.shape({
//     property: PropTypes.string.isRequired,
//     option: PropTypes.string.isRequired,
//   })).isRequired,
// };

// export default PropertyInput;
