import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("")
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setIsLoggedIn(false);
                setName("");
                setEmail("");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:8000/api/check-login/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    setIsLoggedIn(false);
                    setName("");
                    setEmail("");
                    return;
                }

                const data = await response.json();

                setIsLoggedIn(data.is_authenticated);
                setName(data.name);
                setEmail(data.email);
                setFullName(data.fullname);
            } catch (error) {
                setIsLoggedIn(false);
                setName("");
                setEmail("");
            } finally {
            setIsLoading(false);
        }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                name,
                fullName,
                email,
                setName,
                setEmail,
                setFullName,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};