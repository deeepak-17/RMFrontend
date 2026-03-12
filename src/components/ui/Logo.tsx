import { Link } from "react-router-dom";

interface LogoProps {
    size?: "sm" | "md" | "lg";
    showText?: boolean;
    linkTo?: string;
    textColor?: string;
    className?: string;
}

const sizeMap = {
    sm: { box: "w-8 h-8", text: "text-sm", icon: "text-sm" },
    md: { box: "w-9 h-9", text: "text-[17px]", icon: "text-base" },
    lg: { box: "w-10 h-10", text: "text-xl", icon: "text-lg" },
};

export default function Logo({
    size = "md",
    showText = true,
    linkTo = "/",
    textColor = "text-gray-900",
    className = "",
}: LogoProps) {
    const s = sizeMap[size];

    const content = (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div
                className={`${s.box} rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20`}
            >
                <span className={`text-white font-black ${s.icon}`}>R</span>
            </div>
            {showText && (
                <span className={`${textColor} font-bold ${s.text} tracking-tight`}>
                    ResQMeals
                </span>
            )}
        </div>
    );

    if (linkTo) {
        return (
            <Link to={linkTo} className="flex items-center gap-2.5 flex-shrink-0">
                {content}
            </Link>
        );
    }

    return content;
}
