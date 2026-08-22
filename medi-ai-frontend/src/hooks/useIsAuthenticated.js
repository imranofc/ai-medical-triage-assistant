import { useEffect, useState } from "react";

const useIsAuthenticated = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name, setName] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setIsLoggedIn(false);
                return;
            }

            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/api/check-login/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    setIsLoggedIn(false);
                    setName("");
                    return;
                }

                const data = await response.json();

                setIsLoggedIn(data.is_authenticated);
                setName(data.name);
            } catch (error) {
                setIsLoggedIn(false);
                setName("");
            }
        };

        checkAuth();
    }, []);

    return { isLoggedIn, name };
};

export default useIsAuthenticated;