import { FC, useCallback, useEffect, useRef } from "react";

type PROPS = {
    onFire: () => void
    scrollDuration?: number // millisecond
    children?: React.ReactNode
    style?: any
    className?: any
}

export const HoldButton: FC<PROPS> = ({ onFire, children, scrollDuration = 100, style, className }) => {

    const intervalRef = useRef<NodeJS.Timer>();

    const startFire = useCallback(() => {
        console.log('startFire');
        
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }
        intervalRef.current = setInterval(() => {
            console.log('onFire');
            
            onFire();
        }, scrollDuration);
    }, [onFire, scrollDuration]);

    const stopFire = useCallback(() => {
        console.log('stopFire');
        
        if (intervalRef.current) {
            console.log('clear');
            
            clearInterval(intervalRef.current);
        }
    }, []);

    useEffect(() => {
        return () => stopFire(); // when App is unmounted we should stop counter
    }, [stopFire]);

    return <button
        style={style}
        className={`btn ${className}`}
        onMouseDown={startFire}
        onMouseUp={stopFire}
        onMouseLeave={stopFire}
        onClick={onFire}
    >
        {children}
    </button>
}