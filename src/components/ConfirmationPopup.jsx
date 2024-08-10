import PropTypes from "prop-types"


const ConfirmationPopup = ({handleConfirmation}) => {
    return ( 
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-banner p-5 rounded-lg shadow-lg w-[90%]">
            <h2 className="text-lg font-bold">Confirmación</h2>
            <p>¿Estás seguro de que deseas agregar todos los productos al stock?</p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => handleConfirmation(true)}
                className="btn bg-success text-white"
              >
                Aceptar
              </button>
              <button
                onClick={() => handleConfirmation(false)}
                className="btn bg-danger text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
     );
}

ConfirmationPopup.propTypes = {
  handleConfirmation: PropTypes.func.isRequired, // Corregido: handleConfirmation es una función
};

 
export default ConfirmationPopup;