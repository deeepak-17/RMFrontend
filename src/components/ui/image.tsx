import { ImgHTMLAttributes } from 'react';
import { cn } from "@/lib/utils";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    fill?: boolean;
    priority?: boolean;
}

export function Image({ className, src, alt, fill, priority, ...props }: ImageProps) {
    return (
        <img
            src={src as string}
            alt={alt || "Image"}
            className={cn(className, fill ? "w-full h-full object-cover" : "")}
            {...props}
        />
    );
}
export default Image;
