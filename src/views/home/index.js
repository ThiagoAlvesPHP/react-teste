// LIBs
import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// COMPONENTS
import { ButtonEdit } from '../../components/ButtonEdit';
import { ButtonDelete } from '../../components/ButtonDelete';
import { Modal } from '../../components/Modal';

// STYLE
import './style.scss';

export function HomeView() {
  const baseURL = "http://127.0.0.1:8000/api/";
  const [brands, setBrands] = useState(null);
  const [products, setProducts] = useState(null);
  const [count, setCount] = useState(0);
  const radios = useRef();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [voltage, setVoltage] = useState('');
  const [brand_id, setBrandId] = useState('');

  const [visible, setVisible] = useState(false);
  const [product_id, setProductId] = useState(null);

  useEffect(() => {
    showLists();
  }, []);
  /**
   * list products
   */
  function showLists() {
    axios.get(`${baseURL}brands`).then((response) => {
      setBrands(response.data.list);
    });
    axios.get(`${baseURL}products/list`).then((response) => {
      if (!response.data.error) {
        setProducts(response.data.list);
        setCount(response.data.list.length); 
      }
    });

    let inputs = radios.current.querySelectorAll('input');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].checked = false; 
    }
  }
  /**
   * register
   */
  function register() {
    axios.post(`${baseURL}products/create`, {
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
        toast('Produto Registrado com sucesso!', {
          position: "top-right",
          autoClose: 3000
        });
        setName('');
        setDescription('');
        setVoltage('');
        showLists();
      }
    });
  }
  /**
   * delete
   */
  function del(id) {
    axios
      .delete(`${baseURL}products/delete/${id}`)
      .then((response) => {
        let message = '';
        if (response.data.error) {
          message = response.data.error;
        } else {
          message = "Produto deletado com successo";
        }
        toast(message, {
          position: "top-right",
          autoClose: 3000
        });

        showLists();
      });
  }
  /**
   * modal
   */
  function showModal(id) {
    setVisible(true);
    setProductId(id);
  }

  return (
    <div className='home'>
      <div className='row'>
        <div className='register'>
          <h1 className='title'>Registro de Produto</h1>

          <div className='form'>
            <label htmlFor="name">Nome</label>
            <input type="text" id='name' className='input' value={name} onChange={(el) => setName(el.target.value)} />
            <label htmlFor="description">Descrição</label>
            <textarea id="description" className='description' value={description} onChange={(el) => setDescription(el.target.value)} />

            <label>Tensão</label>
            <div ref={radios} className='voltage'>
              <input type="radio" name="voltage" id="voltage110" value="110" onChange={(el) => setVoltage(el.target.value)} /> 
              <label htmlFor="voltage110">110v</label>
              <input type="radio" name="voltage" id="voltage220" value="220" onChange={(el) => setVoltage(el.target.value)} /> 
              <label htmlFor="voltage220">220v</label>
            </div>

            <select className='input' onChange={(el) => setBrandId(el.target.value)}>
              <option value={brand_id}>Selecione uma marca</option>
              {brands &&
                brands.map((item, key) => {
                  return (
                    <option value={item.id} key={key}>{item.name}</option>
                  )
                })
              }
            </select>

            <button onClick={register} className='btn'>Registrar</button>
          </div>
        </div>
        <div className='list'>
          <h4 className='sub-title'>Lista de Produtos - <i>Total: {count}</i></h4>

          <div className='list'>
            <div className='titles'>
              <div>Ação</div>
              <div>Produto</div>
              <div>Descriçãoo</div>
              <div>Tensão</div>
              <div>Marca</div>
            </div>
            {products ?
              products.map((item, key) => {
                return (
                  <div key={key} className='product'>
                    <div className='action'>
                      <ButtonEdit id={item.id} onEdit={showModal} />
                      <ButtonDelete id={item.id} onDel={del} />
                    </div>
                    <div className='name'>{item.name}</div>
                    <div className='description'>{item.description.substring(0, 30)}...</div>
                    <div className='voltage'>{item.voltage}v</div>
                    <div className='brand'>{item.brand}</div>
                  </div>
                )
              })
              :
              <p>Nenhum produto encontrado!</p>
            }
          </div>
        </div>
      </div>
          
      {product_id &&
        <Modal visible={visible} showLists={showLists} brands={brands} setVisible={setVisible} product_id={product_id} baseURL={baseURL} />
      }

      <ToastContainer />
    </div>
  )
}