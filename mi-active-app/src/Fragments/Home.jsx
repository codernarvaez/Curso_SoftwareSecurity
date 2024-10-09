import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaChalkboardTeacher, FaUserCog } from 'react-icons/fa';

const Home = () => {
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedRoles = sessionStorage.getItem('roles');
        if (storedRoles) {
            setRoles(JSON.parse(storedRoles));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="container my-5">
            <h1 className="text-center">Bienvenido a la Página Principal</h1>
            <p className="text-center">¡Has iniciado sesión correctamente!</p>

            {roles.includes('Administrativos') && (
                <p className="text-center text-warning">Tienes acceso al Panel de Administración.</p>
            )}
            {roles.includes('Docentes') && (
                <p className="text-center text-info">Bienvenido, Docente. Administra tus clases aquí.</p>
            )}
            {roles.includes('Estudiantes') && (
                <p className="text-center text-success">Hola, Estudiante. Accede a tus materiales de estudio.</p>
            )}

            {roles.includes('Administrativos') && (
                <div className="text-center my-3">
                    <button 
                        className="btn btn-primary mx-2"
                        onClick={() => navigate('/admin')}>
                        <FaUserCog /> Panel de Administración
                    </button>
                </div>
            )}

            {roles.includes('Docentes') && (
                <div className="text-center my-3">
                    <button 
                        className="btn btn-info mx-2"
                        onClick={() => navigate('/docentes')}>
                        <FaChalkboardTeacher /> Panel de Docentes
                    </button>
                </div>
            )}

            {roles.includes('Estudiantes') && (
                <div className="text-center my-3">
                    <button 
                        className="btn btn-success mx-2"
                        onClick={() => navigate('/estudiantes')}>
                        <FaUserGraduate /> Panel de Estudiantes
                    </button>
                </div>
            )}

            <div className="text-center my-5">
                <button 
                    className="btn btn-danger mx-2"
                    onClick={() => {
                        sessionStorage.clear();
                        navigate('/login');
                    }}>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}

export default Home;
