import { motion } from "framer-motion";
import { useEffect } from "react";

export const TelegramLoginButton = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute("data-telegram-login", "eiztripsbot");
        script.setAttribute("data-size", "large");
        script.setAttribute("data-radius", "8");
        script.setAttribute("data-request-access", "write");
        script.setAttribute("data-onauth", "onTelegramAuth");
        document.getElementById("telegram-login-container")?.appendChild(script);

        (window as any).onTelegramAuth = (user: any) => {
            console.log("TG user:", user);
            fetch(`${import.meta.env.VITE_DEFAULT_API_URL || 'http://localhost:8080'}/v1/auth/tg/callback`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(user),
            })
                .then(r => r.json())
                .then(data => {
                    console.log("Auth success:", data);
                    window.closed
                })
                .catch(err => console.error("Auth error:", err));
        };
    }, []);

    return (
        <motion.div
            id="telegram-login-container"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer inline-block"
        />
    );
};