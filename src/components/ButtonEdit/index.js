// LIBs
import React from 'react';
import { AiOutlineEdit } from "react-icons/ai";

// STYLE
import './style.scss';

export function ButtonEdit(props) {
    
    function handleDelete() {
        props.onEdit(props.id);
    }

    return (
        <button value={props.id} onClick={handleDelete}  className='btn-action edit'>
            <AiOutlineEdit className='edit' />
        </button>
    )
}