import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ButtonEffectsProvider = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        const applyButtonEffects = () => {
            // Delay the query to ensure DOM is fully updated
            setTimeout(() => {
                const buttons = document.querySelectorAll("button");

                buttons.forEach(button => {
                    button.addEventListener("click", (e) => {
                        if (!button.classList.contains("animate")) {
                            button.classList.add("animate");
                            setTimeout(() => {
                                button.classList.remove("animate");
                            }, 500);
                        }
                    });
                });
            }, 500); // 100ms delay, adjust as necessary
        };

        applyButtonEffects();

        return () => {
            const buttons = document.querySelectorAll("button");
            buttons.forEach(button => {
                button.replaceWith(button.cloneNode(true));  // Removing event listeners by cloning the node
            });
        };
    }, [location]);

    return <div>{children}</div>;
};
