async function checkAccessForConsultationPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const token = localStorage.getItem("access_token");

    if (!token) {
        window.location.href = "/login";
        return;
    }

    if (!id) {
        window.location.href = "/new-consultation";
        return;
    }

    const response = await fetch(
        `http://127.0.0.1:8000/api/consultation/?id=${id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/login";
        return;
    }

    if (response.status === 403 || response.status === 404) {
        window.location.href = "/new-consultation";
        return;
    }

    if (response.status === 208){
        window.location.href = `/new-consultation/analysis?id=${id}`
    }

    if (response.status === 200) {
        return await response.json();
    }

    return null;
}

export default checkAccessForConsultationPage;