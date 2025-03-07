export default function CustomCheckbox({ checked, onChange }) {
    return (
      <label className="cursor-pointer">
        <input
          type="checkbox"
          checked={checked} // Estado controlado externamente
          onChange={onChange}
          className="hidden peer"
        />
        <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all
          ${checked ? 'border-gray-700 bg-success' : 'border-gray-400'}`}>
          {checked && (
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </label>
    );
  }
  