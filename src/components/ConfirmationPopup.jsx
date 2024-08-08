// import PropTypes from "prop-types"


const ConfirmationPopup = ({handleConfirmation}) => {
    return ( 
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-5 rounded-md shadow-lg w-[90%]">
            <h2 className="text-lg font-bold">Confirmación</h2>
            <p>¿Estás seguro de que deseas agregar todos los productos al stock?</p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => handleConfirmation(true)}
                className="btn btn-success"
              >
                Aceptar
              </button>
              <button
                onClick={() => handleConfirmation(false)}
                className="btn btn-danger"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
     );
}

// ConfirmationPopup.propTypes = {
//   handleConfirmation: PropTypes.bool.isRequired,
// };

 
export default ConfirmationPopup;