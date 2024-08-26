const Alert = ({ props }) => {
  return (

      <div className=
        {`
          ${props.error ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}
          text-center p-1 mt-5 rounded-md
        `}>

        {props.msg}
      </div>

  );
};

export default Alert;