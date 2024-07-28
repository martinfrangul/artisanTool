import PropTypes from "prop-types";

const PropertySpecs = ({
  setProductStock,
  productStock,
  setProductPrice,
  productPrice,
}) => {
  return (
      <div className="w-full flex flex-row justify-center items-center p-3 m-auto gap-4">
        <div className="flex flex-col w-24 justify-center items-center">
          <label className="text-center" htmlFor="product">Initial stock</label>
          <input
            className="custom-input-appearance w-10 border-1 border-solid border-black rounded-md p-2 shadow-inner shadow-slate-700"
            onChange={(event) => setProductStock(event.target.value)}
            type="number"
            value={productStock}
          />
        </div>
        <div className="flex flex-col w-24 justify-center items-center">
          <label className="text-center" htmlFor="product">Price</label>
          <input
            className="custom-input-appearance w-10 border-1 border-solid border-black rounded-md p-2 shadow-inner shadow-slate-700"
            onChange={(event) => setProductPrice(event.target.value)}
            type="number"
            value={productPrice}
          />
        </div>
      </div>
  );
};

PropertySpecs.propTypes = {
  setProductStock: PropTypes.func.isRequired,
  productStock: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  setProductPrice: PropTypes.func.isRequired,
  productPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

export default PropertySpecs;
