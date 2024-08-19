import {useEffect} from "react";

export const ButtonEffectsProvider = ({children}) => {

    useEffect(() => {
        const buttons = document.querySelectorAll("button");

        buttons.forEach(button => {
            button.addEventListener("click", (e) => {
                //e.preventDefault();

                if (!button.classList.contains("animate")) {
                    button.classList.add("animate");
                    console.log(button)
                    setTimeout(() => {
                        button.classList.remove("animate");
                    }, 500);
                }
            });
        });
    }, []);

    return (
        <div>
            {children}
        </div>
    );
}
