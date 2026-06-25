export interface User {
    userId: string;
    email: string;
    name?: string;
    username: string;
    profilePhoto: string;
    address?: string,
    bio?: string;
    level: number;
    role?: 'user' | 'moderator' | 'admin';
    banReason: string | null;
    banUntil: Date | null;
    banned: boolean

}

const API_BASE = import.meta.env.VITE_API_BASE

export const fetchUser = async () => {



    try {
        const res = await fetch(`${API_BASE}/user/me`, {
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Not authenticated");
        }

        const data = await res.json();
        

        if (data.user) {
            return data.user

        }
        else {
            return null

        }
    } catch (err) {
        console.error(err)
    }
};

export async function loginUser({ email, password }: { email: string; password: string }) {
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to login");
        }

        const data = await res.json();
        return data.user;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function loginWithGoogle(access_token: string) {
    try {
        const res = await fetch(`${API_BASE}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token }),
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Google login failed");
        }

        const data = await res.json();
        return data.user;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function signUpUser({ name, username, email, password, confirmPassword }: { name: string; username: string; email: string; password: string; confirmPassword: string }) {
    try {
        const res = await fetch(`${API_BASE}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, username, email, password, confirmPassword }),
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to sign up");
        }

        const data = await res.json();
        return data.user;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function signOutUser() {
    try {
        const res = await fetch(`${API_BASE}/auth/signout`, {
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to sign out");
        }

        return true;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

