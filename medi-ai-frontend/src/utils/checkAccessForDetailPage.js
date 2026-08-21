async function checkAccessForDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const token = localStorage.getItem("access_token");

    const response = await fetch(
        `http://127.0.0.1:8000/api/new-consultation/?id=${id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        }
    );

    if (response.status === 401) {
        window.location.href = "/login";
        return;
    }

    if (response.status === 403 || response.status === 404) {
        window.location.href = "/new-consultation";
        return;
    }

    if (response.status === 200) {
        return await response.json();
    }
}

export default checkAccessForDetailPage;