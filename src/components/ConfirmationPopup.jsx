const ConfirmationPopup = ({handleConfirmation, confirmationPopupMessage}) => {
    return ( 
        <div className="fixed z-50 inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-30 bg-gray-500">
          <div className="bg-banner p-5 rounded-lg shadow-lg w-[90%] max-w-2xl">
            <h2 className="text-lg font-bold">Confirmación</h2>
            <p>{confirmationPopupMessage}</p>
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


 
export default ConfirmationPopup;