// src/components/SalesCharts.jsx
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useContext, useState } from "react";
import { Bar } from "react-chartjs-2";
import { DataContext } from "../../context/DataContext";
import CustomDatePicker from "../CustomDatePicker";
import {
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  format,
  eachMonthOfInterval,
  eachDayOfInterval,
} from "date-fns";

ChartJs.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesCharts = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useContext must be used within a DataProvider");
  }

  const { sellData } = context;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMonthlyView, setIsMonthlyView] = useState(true);

  const yearStart = startOfYear(selectedDate);
  const yearEnd = endOfYear(selectedDate);
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  const filteredData = sellData.filter((item) => {
    const itemDate = item.date.toDate();
    return isMonthlyView
      ? itemDate >= monthStart && itemDate <= monthEnd
      : itemDate >= yearStart && itemDate <= yearEnd;
  });

  const interval = isMonthlyView
    ? eachDayOfInterval({ start: monthStart, end: monthEnd })
    : eachMonthOfInterval({ start: yearStart, end: yearEnd });

  const groupedData = interval.map((date) => {
    const dateData = filteredData.filter((item) =>
      isMonthlyView
        ? format(item.date.toDate(), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
        : format(item.date.toDate(), "yyyy-MM") === format(date, "yyyy-MM")
    );
    return {
      date: date,
      total: dateData.reduce((sum, item) => sum + item.productPrice * (item.quantity || 1), 0),
    };
  });

  const labels = groupedData.map((item) => isMonthlyView ? format(item.date, 'dd/MM') : format(item.date, 'MMM yyyy'));
  const data = groupedData.map((item) => item.total);

  const BarChartData = {
    labels: labels,
    datasets: [
      {
        label: isMonthlyView ? 'Ventas Diarias (€)' : 'Ventas Mensuales (€)',
        data: data,
        backgroundColor: '#8fc29f',
        borderColor: '#000000',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full h-[75vh] pb-28 flex flex-col justify-center">
      <div className="flex flex-row justify-center items-center my-5">
        <div className="flex w-1/4">

        </div>
        <div className="w-2/4 flex items-center justify-center">
          <CustomDatePicker
            selectedDate={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
            }}
            dateFormat={isMonthlyView ? "MM/yyyy" : "yyyy"}
            showMonthYearPicker={isMonthlyView}
            showYearPicker={!isMonthlyView}
          />
        </div>
        <div className="w-1/4 flex flex-col items-end justify-center mr-3 gap-2">
          <button
            className={`w-24 text-sm px-4 py-2 border-solid border-black border-[0.5px] ${isMonthlyView ? 'bg-success text-black' : 'bg-gray-100 text-black'} rounded-md`}
            onClick={() => setIsMonthlyView(true)}
          >
            Mensual
          </button>
          <button
            className={`w-24 text-sm px-4 py-2 border-solid border-black border-[0.5px] ${!isMonthlyView ? 'bg-success text-black' : 'bg-gray-100 text-black'} rounded-md`}
            onClick={() => setIsMonthlyView(false)}
          >
            Anual
          </button>
        </div>
      </div>
      <hr className="bg-black border-1 border-solido border-black" />
      <div className="flex justify-center items-center w-full flex-1">
        <div className="w-full h-60 max-w-screen-lg">
          <Bar data={BarChartData} options={options} />
        </div>
      </div>
      <hr className="bg-black border-1 border-solido border-black" />

      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold">
          Total del {isMonthlyView ? 'Mes' : 'Año'}: €{groupedData.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
        </h3>
      </div>
    </div>
  );
};

export default SalesCharts;
