import API_URL from "../config";

export const updateFavourite = async (consultationId, favourite) => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(
        `${API_URL}/api/update-favourite/`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                id: consultationId,
                favourite: favourite,
            }),
        }
    );

    if (response.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
        return;
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Failed to update favourite."
        );
    }

    return data;
};