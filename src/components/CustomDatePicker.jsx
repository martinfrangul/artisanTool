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
      className="p-2 rounded-md w-28 text-md text-center font-semibold text-gray-700 bg-banner border-solid border-black border-[0.5px]"
    />
  );
};

CustomDatePicker.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired, 
  onChange: PropTypes.func.isRequired, 
  selectsStart: PropTypes.bool, 
  selectsEnd: PropTypes.bool, 
  minDate: PropTypes.instanceOf(Date), 
  maxDate: PropTypes.instanceOf(Date), 
  dateFormat: PropTypes.string, 
  showMonthYearPicker: PropTypes.bool,
  showYearPicker: PropTypes.bool,
};

export default CustomDatePicker;
