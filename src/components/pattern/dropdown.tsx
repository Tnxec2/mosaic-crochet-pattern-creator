import { FC, MouseEvent } from 'react'
import './dropdown.css'
import { useOutsideClick } from '../../effects/useclickoutside'
import { ACTION_TYPES } from '../../model/actiontype.enum'

type MenuItem = {
    name?: string
    action?: ACTION_TYPES
    color?: string
    divider?: boolean
    onClick?: () => void
}

type Props = {
    onclose: () => void
    menu: MenuItem[]
}

export const DropDown: FC<Props> = ({ onclose, menu }) => {
    const handleClickOutside = () => {
        onclose()
    }

    const refDropDownOutside = useOutsideClick(handleClickOutside)

    const handleClick = (e: MouseEvent<HTMLLIElement>, menuItem: MenuItem) => {
        e.preventDefault()
        e.stopPropagation()
        if (menuItem.onClick) menuItem.onClick()
        onclose()
    }

    const renderSwitch = (value?: ACTION_TYPES, color?: string) => {
        switch (value) {
            case undefined:
                return <></>
            case ACTION_TYPES.NONE:
                return <img src={`./assets/empty.svg`} alt={value}></img>
            case ACTION_TYPES.COLOR:
                return (
                    <img
                        src={`./assets/empty.svg`}
                        alt={value}
                        style={{ backgroundColor: color }}
                    ></img>
                )
            default:
                return <img src={`./assets/${value}.svg`} alt={value}></img>
        }
    }

    return (
        <div className="dropdown" ref={refDropDownOutside}>
            <ul className="menu">
                {menu.map((menuItem, index) => (
                    <li
                        key={index}
                        className={`menu-item ${
                            menuItem.divider ? 'divider' : ''
                        }`}
                        onClick={(e) => handleClick(e, menuItem)}
                    >
                        {renderSwitch(menuItem.action, menuItem.color)}
                        {menuItem.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}
