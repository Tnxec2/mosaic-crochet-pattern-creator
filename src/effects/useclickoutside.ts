import React from 'react'

export const useOutsideClick = (callback: (event: any) => void) => {
    const ref = React.useRef<any>()

    React.useEffect(() => {
        const handleClick = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback(event)
            }
        }

        document.addEventListener('click', handleClick, true)

        return () => {
            document.removeEventListener('click', handleClick, true)
        }
    }, [ref])

    return ref
}
