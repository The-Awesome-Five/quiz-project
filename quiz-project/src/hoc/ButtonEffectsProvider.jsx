import { useEffect } from "react";

export const ButtonEffectsProvider = ({ children }) => {

    useEffect(() => {
        const handleButtonClick = (e) => {
            const button = e.target.closest("button");

            if (button && !button.classList.contains("animate")) {
                button.classList.add("animate");
                setTimeout(() => {
                    button.classList.remove("animate");
                }, 500);
            }
        };

        document.addEventListener("click", handleButtonClick);

        return () => {
            document.removeEventListener("click", handleButtonClick);
        };
    }, []);

    return (
        <div>
            {children}
        </div>
    );
};
