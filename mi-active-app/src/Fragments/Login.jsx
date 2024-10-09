import React, { useState } from 'react';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBInput,
  MDBCheckbox
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../hooks/Conexion'; 
import Swal from 'sweetalert2';
import '../Css/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();
    
        const result = await handleLogin(username, password.trim());
    
        if (result.success) {
            sessionStorage.setItem('roles', JSON.stringify(result.groups)); 
    
            Swal.fire({
                title: '¡Inicio de sesión exitoso!',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                navigate('/home'); 
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: result.message,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };
    

    return (
        <MDBContainer fluid className="p-5 my-5">
            <MDBRow className="align-items-center">
                <MDBCol md='6' className="d-none d-md-block">
                    <img 
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" 
                        className="img-fluid" 
                        alt="Login Illustration" 
                    />
                </MDBCol>

                <MDBCol md='6'>
                    <form onSubmit={login} className="bg-light p-4 rounded shadow">
                        <h2 className="text-center mb-4">Iniciar Sesión</h2>
                        <MDBInput 
                            wrapperClass='mb-4' 
                            label='Usuario' 
                            id='username' 
                            type='text' 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required
                        />
                        <MDBInput 
                            wrapperClass='mb-4' 
                            label='Contraseña' 
                            id='password' 
                            type='password' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                        />

                        <div className="d-flex justify-content-between mx-4 mb-4">
                            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Recordarme' />
                            <a href="#!">¿Olvidaste tu contraseña?</a>
                        </div>

                        <MDBBtn className="mb-4 w-100" size="lg" type="submit">Iniciar Sesión</MDBBtn>
                    </form>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default Login;
