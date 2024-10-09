export const handleLogin = async (username, password) => {
    try {
        const response = await fetch('http://localhost:3006/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, message: errorData.message };
        }

        const data = await response.json();
        return { success: true, groups: data.groups || [] };
    } catch (error) {
        console.error('Error en la solicitud de inicio de sesión:', error);
        return { success: false, message: 'Error de red o servidor.' };
    }
};
