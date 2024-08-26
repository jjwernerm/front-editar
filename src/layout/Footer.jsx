const Footer = () => {
  return (
    <>
      <footer className='flex flex-col items-center'>
        <hr className="border-t-1 border-gray-300 my-4 w-9/12" />
        <p className='text-center'>©Copyright 2024 {''}
          <span className='font-bold text-blue-600'>joannywerner. {''}</span>
          <span className=''>Todos los derechos reservados {''}</span>
        </p>
      </footer>
    </>
  );
};

export default Footer;