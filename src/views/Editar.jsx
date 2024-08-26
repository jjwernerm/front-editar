import { useState } from 'react'; // Importa el hook useState desde React para manejar el estado del componente
import { ImSpinner9 } from "react-icons/im"; // Importa el ícono de spinner para mostrar carga
import { FaEdit } from "react-icons/fa"; // Importa el ícono de edición
import configAxios from '../config/axios.jsx'; // Importa la configuración de Axios para realizar solicitudes HTTP
import Alert from '../componentes/Alert.jsx'; // Importa el componente Alert para mostrar mensajes de error

export default function Consultar() {

  // Estado para almacenar el ID del producto
  const [idproducto, setIdProducto] = useState('');

  // Estados para manejar los spinners de carga
  const [spinner, setSpinner] = useState(false);
  const [spinnerEdit, setSpinnerEdit] = useState(false);

  // Estados para manejar la visibilidad y habilitación de botones
  const [btn, setBtn] = useState(true); // Botón de búsqueda habilitado/ deshabilitado
  const [btnCancelar, setBtnCancelar] = useState(false); // Botón cancelar habilitado/ deshabilitado
  const [campoVacio, setCampoVacio] = useState(false); // Indica si el campo del nombre está vacío
  const [btnsHidden, setBtnsHidden] = useState(true); // Estado para ocultar/ mostrar botones de acción

  // Estado para almacenar el mensaje global de error
  const [globalErrorMsg, setGlobalErrorMsg] = useState('');

  // Estado para almacenar la información del producto consultado
  const [producto, setProducto] = useState(null);

  // Función para manejar el cambio en el campo de ID del producto
  const handleIdProductoChange = (e) => {
    const value = e.target.value;

    // Solo permite números en el campo del ID del producto
    if (/^\d*$/.test(value)) {
      setIdProducto(value);
    }

    // Habilita o deshabilita el botón de búsqueda basado en si el campo está vacío
    setBtn(!value);
  };

  // Función para manejar la búsqueda del producto
  const handleBuscar = async e => {
    e.preventDefault();

    // Limpia los mensajes de error y el producto consultado
    setGlobalErrorMsg('');
    setProducto(null);

    // Muestra el spinner de carga
    setSpinner(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula un retraso
    setSpinner(false);

    try {
      const url = `/consultar/${idproducto}`; // URL para la solicitud de consulta del producto
      const { data } = await configAxios.get(url); // Realiza la solicitud GET
      setProducto(data); // Almacena la respuesta en el estado
      setIdProducto(''); // Limpia el campo de ID del producto
      setBtn(true); // Habilita el botón de búsqueda
    } catch (error) {
      // Maneja los errores de la solicitud
      setGlobalErrorMsg({
        msg: error.response?.data?.msg || 'Error en la solicitud: contactar al administrador',
        error: false
      });
    } finally {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simula un retraso adicional
      setGlobalErrorMsg(''); // Limpia el mensaje de error global
    }
  };

  // Función para manejar el cambio en el nombre del producto
  const handleNombreChange = (e) => {
    const nuevoNombre = e.target.value;

    // Actualiza el nombre del producto en el estado
    setProducto({
      ...producto,
      nombre: nuevoNombre
    });
  };

  // Función para manejar la habilitación de los botones de acción
  const handlePencel = e => {
    e.preventDefault();

    const { nombre } = producto;

    // Verifica si el nombre del producto está vacío y muestra un mensaje de error si es necesario
    if (!nombre) {
      setCampoVacio(true);
      return;
    }

    // Muestra los botones de acción si el nombre no está vacío
    setBtnsHidden(false);
    setCampoVacio(false);
  };

  // Función para manejar la edición del producto
  const handleEditar = async e => {
    e.preventDefault();
    setBtnCancelar(true);

    const { idproducto, nombre } = producto;

    // Muestra el spinner de edición
    setSpinnerEdit(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula un retraso
    setSpinnerEdit(false);
    setBtnCancelar(false);

    try {
      const url = `/editar/${idproducto}`; // URL para la solicitud de edición del producto
      const respuesta = await configAxios.put(url, { nombre }); // Realiza la solicitud PUT
      setGlobalErrorMsg({
        msg: respuesta?.data?.msg || 'Producto editado',
        error: true
      });
    } catch (error) {
      // Maneja los errores de la solicitud de edición
      setGlobalErrorMsg({
        msg: error.response?.data?.msg || 'Error en la solicitud: contactar al administrador',
        error: false
      });
    } finally {
      // Oculta los botones de acción y limpia el producto
      setBtnsHidden(true);
      setProducto(null);
    }

    await new Promise(resolve => setTimeout(resolve, 3000)); // Simula un retraso adicional
    setGlobalErrorMsg(''); // Limpia el mensaje de error global
  };

  return (
    <>
      <a
        href='https://joannywerner.com/dashboardmern'
        className="ml-5 underline">
        Regresar al Dashboard
      </a>
      <div className="flex flex-col items-center my-4">
        {/* Formulario para buscar y editar el producto */}
        <form
          className="border border-gray-100 rounded-xl w-9/12 md:w-3/12 p-4 shadow-md"
          onSubmit={handleBuscar}
        >
          <div className="text-center font-bold">Producto a Editar</div>

          <div className="mt-4">
            <label htmlFor="input-id" className="text-gray-500">Id Producto <span className='text-red-500'>*</span></label>
            <input
              type="number"
              placeholder="Escribe el id del producto"
              id="input-id"
              className="border-gray-100 focus:ring-green-400 bg-gray-100 p-1 rounded-xl w-full outline-none focus:ring-1"
              value={idproducto}
              onChange={handleIdProductoChange}
            />
          </div>

          <button
            type="submit"
            className={`
          ${btn ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-500'} w-full py-3 px-10 rounded-xl 
          text-white uppercase font-bold mt-5 flex items-center justify-center
        `}
            disabled={btn}
          >
            {spinner ? (
              <div className="flex items-center">
                <ImSpinner9 className="animate-spin h-5 w-5 text-white mr-2" />
                Buscando...
              </div>
            ) : (
              'Buscar'
            )}
          </button>

          {globalErrorMsg.msg && <Alert props={globalErrorMsg} />} {/* Muestra mensaje de error si existe */}
        </form>

        {/* Tabla para mostrar los detalles del producto y permitir su edición */}
        <div className="flex justify-center w-full text-xs md:text-base">
          <table className="border-separate border-spacing-1 border border-slate-500 rounded w-full mx-1 my-4 md:w-1/2">
            <caption className="caption-top font-bold">
              Producto a Editar
            </caption>
            <thead>
              <tr>
                <th></th>
                <th className="border border-slate-600 rounded bg-slate-200">Id Producto</th>
                <th className="border border-slate-600 rounded bg-slate-200">Nombre del Producto</th>
              </tr>
            </thead>
            {producto && (
              <tbody>
                <tr>
                  <td className='flex justify-center text-2xl text-blue-600'>
                    <button
                      onClick={handlePencel}
                    ><FaEdit /></button> {/* Botón para habilitar la edición */}
                  </td>
                  <td>{producto.idproducto}</td>
                  <td>
                    <input
                      type="text"
                      className="bg-gray-100 p-1 rounded-xl w-full outline-none focus:ring-1"
                      value={producto.nombre}
                      onChange={handleNombreChange}
                    />
                    {campoVacio && (
                      <div className="text-red-500 text-xs mt-1">
                        Campo obligatorio
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>

        {/* Botones de acción para editar o cancelar */}
        <div className={`${btnsHidden ? 'hidden' : 'block'} flex w-full md:w-1/2 `}>
          <div className='w-1/2 flex justify-center'>
            <button
              type="submit"
              className='bg-green-600 hover:bg-green-500 w-4/5 py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 flex items-center justify-center'
              onClick={handleEditar}
            >
              {spinnerEdit ? (
                <div className="flex items-center normal-case">
                  <ImSpinner9 className="animate-spin h-5 w-5 text-white mr-2" />
                  Editando...
                </div>
              ) : (
                'Editar'
              )}
            </button>
          </div>
          <div className='w-1/2 flex justify-center'>
            <button
              type="submit"
              className='bg-white border-2 hover:bg-gray-400 hover:text-white py-3 px-10 rounded-xl text-black uppercase font-bold mt-5 flex items-center justify-center w-4/5'
              disabled={btnCancelar}
              onClick={() => setBtnsHidden(true)}
            >
              Cancelar
            </button>
          </div>
        </div>

      </div>
    </>
  );
};