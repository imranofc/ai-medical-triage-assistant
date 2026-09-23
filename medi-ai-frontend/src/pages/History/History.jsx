import "./History.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClipboard,
    faCircleCheck,
    faFileLines,
    faMagnifyingGlass,
    faEye,
    faDownload,
    faClock,
    faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";

import {
    faStar as faStarRegular,
} from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { downloadReport } from "../../utils/downloadReport";
import { updateFavourite } from "../../utils/updateFavourite";
import API_URL from "../../config";

function History() {
    const [searchParams, setSearchParams] = useSearchParams();

    const filter = searchParams.get("filter") || "total";
    const currentPage = Number(searchParams.get("page")) || 1;
    const searchQuery = searchParams.get("search") || "";

    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        draft: 0,
        favourite: 0,
    });
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [downloadingId, setDownloadingId] = useState(null);
    const [favouriteLoadingId, setFavouriteLoadingId] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem("access_token");

            if (!token) {
                window.location.href = "/login";
                return;
            }

            try {
                setLoading(true);
                setError("");

                const params = new URLSearchParams();

                params.set("filter", filter);
                params.set("page", currentPage);

                if (searchQuery) {
                    params.set("search", searchQuery);
                }

                const response = await fetch(
                    `${API_URL}/api/history/?${params.toString()}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    },
                );

                if (response.status === 401) {
                    localStorage.removeItem("access_token");
                    window.location.href = "/login";
                    return;
                }

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.detail || "Failed to load history.");
                }

                setHistory(data.results || []);

                setStats(
                    data.stats || {
                        total: 0,
                        completed: 0,
                        draft: 0,
                        favourite: 0,
                    },
                );

                setTotalPages(data.total_pages || 1);
            } catch (err) {
                setError(err.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [filter, currentPage, searchQuery]);

    const changeFilter = (newFilter) => {
        const params = new URLSearchParams();

        params.set("filter", newFilter);

        setSearchParams(params);
    };

    const handleSearch = (value) => {
        const params = new URLSearchParams();

        params.set("filter", filter);

        if (value.trim()) {
            params.set("search", value.trim());
        }

        setSearchParams(params);
    };

    const changePage = (page) => {
        const params = new URLSearchParams();

        params.set("filter", filter);

        if (searchQuery) {
            params.set("search", searchQuery);
        }

        if (page > 1) {
            params.set("page", page);
        }

        setSearchParams(params);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const openConsultation = (item) => {
        if (item.status === "completed") {
            window.location.href = `/new-consultation/analysis?id=${item.id}`;
        } else {
            window.location.href = `/new-consultation?id=${item.id}`;
        }
    };

    const handleDownloadReport = async (consultationId) => {
        if (downloadingId !== null) return;

        setDownloadingId(consultationId);

        try {
            await downloadReport(consultationId);
        } catch (error) {
            console.error("PDF download error:", error);
            alert(error.message || "Failed to download report.");
        } finally {
            setDownloadingId(null);
        }
    };
    const handleFavourite = async (consultationId, currentFavourite) => {
        if (favouriteLoadingId !== null) return;

        setFavouriteLoadingId(consultationId);

        try {
            const data = await updateFavourite(
                consultationId,
                !currentFavourite
            );

            setHistory((prevHistory) =>
                prevHistory.map((item) =>
                    item.id === consultationId
                        ? {
                            ...item,
                            favourite: data.favourite
                        }
                        : item
                )
            );
        } catch (error) {
            console.error("Favourite update error:", error);
            alert(error.message || "Failed to update favourite.");
        } finally {
            setFavouriteLoadingId(null);
        }
    };

    if (loading) {
        return (
            <div className="history-page">
                <main className="history-main">
                    <div className="history-box">
                        <div className="history-loading">Loading your history...</div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="history-page">
                <main className="history-main">
                    <div className="history-box">
                        <div className="history-error">{error}</div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="history-page">
            <main className="history-main">
                <div className="history-box">
                    <div className="history-header">
                        <div className="history-title">
                            <h2>
                                Your History
                            </h2>

                            <p>View all your past analyses.</p>
                        </div>

                        <div className="history-search">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />

                            <input
                                type="text"
                                placeholder="Search history..."
                                defaultValue={searchQuery}
                                onChange={(event) => handleSearch(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="history-stats">
                        <button
                            type="button"
                            className={`history-stat total ${filter === "total" ? "selected" : ""
                                }`}
                            onClick={() => changeFilter("total")}
                        >
                            <div className="history-stat-icon">
                                <FontAwesomeIcon icon={faClipboard} />
                            </div>

                            <div>
                                <strong>{stats.total}</strong>

                                <span>Total Analysis</span>

                                <small>All analyses you've created</small>
                            </div>
                        </button>

                        <button
                            type="button"
                            className={`history-stat completed ${filter === "completed" ? "selected" : ""
                                }`}
                            onClick={() => changeFilter("completed")}
                        >
                            <div className="history-stat-icon">
                                <FontAwesomeIcon icon={faCircleCheck} />
                            </div>

                            <div>
                                <strong>{stats.completed}</strong>

                                <span>Completed</span>

                                <small>Analyses that are completed</small>
                            </div>
                        </button>

                        <button
                            type="button"
                            className={`history-stat draft ${filter === "draft" ? "selected" : ""
                                }`}
                            onClick={() => changeFilter("draft")}
                        >
                            <div className="history-stat-icon">
                                <FontAwesomeIcon icon={faFileLines} />
                            </div>

                            <div>
                                <strong>{stats.draft}</strong>

                                <span>Draft</span>

                                <small>Analyses saved as draft</small>
                            </div>
                        </button>

                        <button
                            type="button"
                            className={`history-stat favourite ${filter === "favourite" ? "selected" : ""
                                }`}
                            onClick={() => changeFilter("favourite")}
                        >
                            <div className="history-stat-icon">
                                <FontAwesomeIcon icon={faStarSolid} />
                            </div>

                            <div>
                                <strong>{stats.favourite}</strong>

                                <span>Favourite</span>

                                <small>Your favourite analyses</small>
                            </div>
                        </button>
                    </div>

                    <div className="history-table">
                        <div className="history-table-header">
                            <span>Analysis Name</span>

                            <span>Date & Time</span>

                            <span>Status</span>

                            <span>Actions</span>
                        </div>

                        {history.length === 0 ? (
                            <div className="history-empty">
                                <FontAwesomeIcon icon={faFileLines} />

                                <p>No analyses found.</p>
                            </div>
                        ) : (
                            history.map((item) => (
                                <div className="history-row" key={item.id}>
                                    <div className="history-analysis">
                                        <div className={`history-analysis-icon ${item.status}`}>
                                            <FontAwesomeIcon icon={faFileLines} />
                                        </div>

                                        <div>
                                            <strong>{item.name}</strong>

                                            <span>{item.description}</span>
                                        </div>
                                    </div>

                                    <div className="history-date">
                                        <span>
                                            <FontAwesomeIcon icon={faClipboard} />

                                            {formatDate(item.created_at)}
                                        </span>

                                        <span>
                                            <FontAwesomeIcon icon={faClock} />

                                            {formatTime(item.created_at)}
                                        </span>
                                    </div>

                                    <div>
                                        <span className={`history-status ${item.status}`}>
                                            <FontAwesomeIcon
                                                icon={
                                                    item.status === "completed" ? faCircleCheck : faClock
                                                }
                                            />

                                            {item.status === "completed" ? "Completed" : "Draft"}
                                        </span>
                                    </div>

                                    <div className="history-actions">
                                        <button
                                            type="button"
                                            onClick={() => openConsultation(item)}
                                        >
                                            <FontAwesomeIcon icon={faEye} />

                                            {item.status === "completed"
                                                ? "View Details"
                                                : "Continue"}
                                        </button>

                                        {item.status === "completed" && (
                                            <button
                                                type="button"
                                                className="download-btn"
                                                onClick={() => handleDownloadReport(item.id)}
                                                disabled={downloadingId === item.id}
                                            >
                                                <FontAwesomeIcon icon={faDownload} />
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            className={`history-favourite ${item.favourite ? "active" : ""}`}
                                            onClick={() =>
                                                handleFavourite(item.id, item.favourite)
                                            }
                                            disabled={favouriteLoadingId === item.id}
                                        >
                                            <FontAwesomeIcon
                                                icon={item.favourite ? faStarSolid : faStarRegular}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="history-pagination">
                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() => changePage(currentPage - 1)}
                            >
                                ‹
                            </button>

                            {Array.from(
                                {
                                    length: totalPages,
                                },
                                (_, index) => index + 1,
                            ).map((number) => (
                                <button
                                    type="button"
                                    key={number}
                                    className={currentPage === number ? "active" : ""}
                                    onClick={() => changePage(number)}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                type="button"
                                disabled={currentPage === totalPages}
                                onClick={() => changePage(currentPage + 1)}
                            >
                                ›
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default History;