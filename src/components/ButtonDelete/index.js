// LIBs
import React from 'react';
import { AiOutlineDelete } from "react-icons/ai";

// STYLE
import './style.scss';

export function ButtonDelete(props) {
    
    function handleDelete() {
        props.onDel(props.id);
    }

    return (
        <button value={props.id} onClick={handleDelete} className='btn-action delete'>
            <AiOutlineDelete className='delete' />
        </button>
    )
}