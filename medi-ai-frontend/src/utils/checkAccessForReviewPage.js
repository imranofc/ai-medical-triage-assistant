async function checkAccessForReviewPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const token = localStorage.getItem("access_token");

    if (!token) {
        window.location.href = "/login";
        return;
    }

    if (!id) {
        window.location.href = "/new-consultation";
        return null;
    }

    const response = await fetch(
        `http://127.0.0.1:8000/api/consultation-review/?id=${id}`,
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
        return null;
    }

    if (response.status === 403 || response.status === 404) {
        window.location.href = "/new-consultation";
        return null;
    }

    if (response.status === 208) {
        window.location.href = `/new-consultation/analysis?id=${id}`
    }

    if (response.status === 200) {
        return await response.json();
    }

    return null;
}

export default checkAccessForReviewPage;