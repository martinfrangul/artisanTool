import logoSimple from '../assets/Artisan Tool MERGED sin sombra (logo 1).png'

const Banner = () => {
    return ( 
        <div className="flex justify-center w-full bg-banner rounded-t-2xl">
        <img
          className="flex justify-center w-32 items-center"
          src={logoSimple}
          alt="logo-artisan-tool"
        />
      </div>
     );
}
 
export default Banner;