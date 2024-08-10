import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from 'prop-types';

const CustomDatePicker = ({
  selectedDate,
  onChange,
  selectsStart,
  selectsEnd,
  minDate,
  maxDate,
  dateFormat,
  showMonthYearPicker = false,
  showYearPicker = false,
}) => {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      selectsStart={selectsStart}
      selectsEnd={selectsEnd}
      minDate={minDate}
      maxDate={maxDate}
      dateFormat={dateFormat}
      showMonthYearPicker={showMonthYearPicker}
      showYearPicker={showYearPicker}
      className="p-2 rounded-md w-24 text-md text-center font-semibold text-gray-700 bg-banner border-solid border-black border-[0.5px]"
    />
  );
};

CustomDatePicker.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired, // Fecha seleccionada debe ser un objeto Date
  onChange: PropTypes.func.isRequired, // Función callback para manejar el cambio de fecha
  selectsStart: PropTypes.bool, // Si el DatePicker selecciona el inicio de un rango de fechas
  selectsEnd: PropTypes.bool, // Si el DatePicker selecciona el final de un rango de fechas
  minDate: PropTypes.instanceOf(Date), // Fecha mínima seleccionable
  maxDate: PropTypes.instanceOf(Date), // Fecha máxima seleccionable
  dateFormat: PropTypes.string, // Formato de fecha mostrado
  showMonthYearPicker: PropTypes.bool, // Si muestra selector de mes y año
  showYearPicker: PropTypes.bool, // Si muestra solo selector de año
};

export default CustomDatePicker;
