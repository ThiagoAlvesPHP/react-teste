// LIBs
import React, { useState, useEffect, useRef } from 'react';
import { AiFillCloseCircle } from "react-icons/ai";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// STYLE
import './style.scss';

export function Modal(props) {

    // form input
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [voltage, setVoltage] = useState('');
    const [brand_id, setBrandId] = useState('');

    const radios = useRef();

    useEffect(() => {
        getProduct(props.product_id);

        let inputs = radios.current.querySelectorAll('input');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].checked = false; 
        }
    }, [props.product_id]);
    
    function close() {
        props.setVisible(false);
    }
    /**
     * get product
     */
    function getProduct(id) {
        axios.get(`${props.baseURL}products/find/${id}`).then((response) => {
            setName(response.data.get.name);
            setDescription(response.data.get.description);
            setVoltage(response.data.get.voltage);
            setBrandId(response.data.get.brand_id);
        });
    }
    /**
     * update
     */
    function update() {
        axios.put(`${props.baseURL}products/update/${props.product_id}`, {
            name: name,
            description: description,
            voltage: voltage,
            brand_id: brand_id
        })
        .then((response) => {
        if (response.data.error) {
            if (response.data.error.name) {
                toast(response.data.error.name[0], {
                    position: "top-right",
                    autoClose: 3000
                });
            }
            if (response.data.error.description) {
                toast(response.data.error.description[0], {
                    position: "top-right",
                    autoClose: 3000
                });
            }
            if (response.data.error.voltage) {
                toast(response.data.error.voltage[0], {
                    position: "top-right",
                    autoClose: 3000
                });
            }
            if (response.data.error.brand_id) {
                toast(response.data.error.brand_id[0], {
                    position: "top-right",
                    autoClose: 3000
                });
            }
        } else {
            toast('Produto atualizado com sucesso!', {
                position: "top-right",
                autoClose: 3000
            });
            props.showLists();
            close();
        }
        });
    }

    return (
        <div className='modal' style={props.visible?{display:"flex"}:{display:"none"}}>
            <div className='form'>
                <AiFillCloseCircle onClick={close} className='close' />

                <label htmlFor="nameUp">Nome</label>
                <input type="text" id='nameUp' value={name} onChange={(el) => setName(el.target.value)} className='input' />
                <label htmlFor="descriptionUp">Descrição</label>
                <textarea id="descriptionUp" className='description' value={description} onChange={(el) => setDescription(el.target.value)} />

                <label>Tensão</label>
                <div className='voltage' ref={radios}>
                    {voltage &&
                        voltage === '110'?
                        <input type="radio" checked name="voltage" id="voltage110Up" value="110" onChange={(el) => setVoltage(el.target.value)} /> :
                        <input type="radio" name="voltage" id="voltage110Up" value="110" onChange={(el) => setVoltage(el.target.value)} /> 
                    }
                    <label htmlFor="voltage110Up">110v</label>
                    {voltage &&
                        voltage === '220'?
                        <input type="radio" checked name="voltage" id="voltage220Up" value="220" onChange={(el) => setVoltage(el.target.value)} /> :
                        <input type="radio" name="voltage" id="voltage220Up" value="220" onChange={(el) => setVoltage(el.target.value)} />
                    }
                    <label htmlFor="voltage220Up">220v</label>
                </div>

                <select className='input' onChange={(el) => setBrandId(el.target.value)}>
                    {props.brands &&
                        props.brands.map((item, key) => {
                            return (
                                brand_id &&
                                brand_id == item.id ?
                                    <option selected value={item.id} key={key}>{item.name}</option>
                                    :
                                    <option value={item.id} key={key}>{item.name}</option>
                            )
                        })
                    }
                </select>

                <button onClick={update} className='btn'>Atualizar</button>
            </div>
        </div>
    )
}