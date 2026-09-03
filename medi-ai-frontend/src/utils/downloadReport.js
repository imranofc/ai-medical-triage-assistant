import API_URL from "../config";

export const downloadReport = async (consultationId) => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(
        `${API_URL}/api/download-report/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                id: consultationId,
            }),
        }
    );

    if (response.status === 401) {
        window.location.href = "/login";
        return;
    }

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            errorData.error || "Failed to download report."
        );
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `medical_report_${consultationId}.pdf`;

    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
};