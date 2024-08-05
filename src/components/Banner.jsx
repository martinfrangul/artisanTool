import logo from "../assets/logo-shadow.png";

const Banner = () => {
  return (
    <div className="flex justify-center w-full bg-banner rounded-t-2xl">
      <img
        className="flex justify-center w-36 p-3 items-center"
        src={logo}
        alt="logo-artisan-tool"
      />
    </div>
  );
};

export default Banner;
