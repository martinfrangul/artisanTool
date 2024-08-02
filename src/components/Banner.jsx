import logo from '../assets/logo.png'

const Banner = () => {
    return ( 
        <div className="flex justify-center w-full bg-banner rounded-t-2xl">
        <img
          className="flex justify-center w-32 items-center"
          src={logo}
          alt="logo-artisan-tool"
        />
      </div>
     );
}
 
export default Banner;