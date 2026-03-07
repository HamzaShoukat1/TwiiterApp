const getToken = () => {
    const stored = localStorage.getItem("userData");
    if (!stored) return null;

    try {
        const parsed = JSON.parse(stored);
        return parsed?.data?.accessToken;
    } catch {
        return null;
    }
};

export const apiFetch = async (url: string, options: RequestInit = {}) => {
    const token = getToken();

    const res = await fetch(url, {
        credentials: "include",
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });
    return res

}