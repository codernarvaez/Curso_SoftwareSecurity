
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
            throw new Error(errorData.message || 'Error de autenticación'); 
        }

        const data = await response.json();
        console.log(data);
        return { success: true }; 
    } catch (error) {
        console.error('Error de autenticación:', error);
        return { success: false, message: error.message }; 
    }
};
