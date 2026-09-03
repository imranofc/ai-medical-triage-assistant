import API_URL from "../config";

const logout = async () => {
    const refresh = localStorage.getItem("refresh_token");

    try {
        await fetch(`${API_URL}/api/logout/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify({
                refresh,
            }),
        });
    } finally {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/login";
    }
};

export default logout;