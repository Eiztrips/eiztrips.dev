import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Callback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        const mode = searchParams.get("mode");
        const userName = searchParams.get("username");

        if (token && mode && userName) {
            Cookies.set("jwt", token, {
                expires: 1,
                secure: true,
                sameSite: "strict"
            });

            Cookies.set("mode", mode, {
                expires: 1,
                secure: true,
                sameSite: "strict"
            });

            Cookies.set("username", userName, {
                expires: 1,
                secure: true,
                sameSite: "strict"
            })

            navigate("/");
        } else {
            navigate("/");
        }
    }, [searchParams, navigate]);
    return <p>Авторизация... подождите</p>;
};

export default Callback;