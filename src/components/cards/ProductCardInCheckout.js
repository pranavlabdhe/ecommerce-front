
import React from "react";
import ModalImage from 'react-modal-image'
import { useSelector,useDispatch } from "react-redux";
import { toast } from "react-toastify";
import laptop_default from '../../images/default_image.jpg'
import Cart from "../../pages/Cart";
import {CheckCircleOutlined,CloseCircleOutlined,CloseOutlined} from '@ant-design/icons'
const ProductCardInCheckout = ({ p }) => {
   
    //   redux
    const {user,cart} = useSelector((state)=>({...state}));
    const dispatch = useDispatch()

    const handleQuantityChange = (e) => {
        // console.log("available quantity", p.quantity);
        let count = e.target.value < 1 ? 1 : e.target.value;
    
        if (count > p.quantity) {
          toast.error(`Max available quantity: ${p.quantity}`);
          return;
        }
    
        let cart = [];
    
        if (typeof window !== "undefined") {
          if (localStorage.getItem("cart")) {
            cart = JSON.parse(localStorage.getItem("cart"));
          }
    
          cart.map((product, i) => {
            if (product._id == p._id) {
              cart[i].count = count;
            }
          });
    
          localStorage.setItem("cart", JSON.stringify(cart));
          dispatch({
            type: "ADD_TO_CART",
            payload: cart,
          });
        }
      };
    const handleRemove = () =>{
        // console.log(p._id,'to remove')
        let cart = [];
    
        if (typeof window !== "undefined") {
          if (localStorage.getItem("cart")) {
            cart = JSON.parse(localStorage.getItem("cart"));
          }
    
          cart.map((product, i) => {
            if (product._id == p._id) {
              cart.splice(i,1)
            }
          });
    
          localStorage.setItem("cart", JSON.stringify(cart));
          dispatch({
            type: "ADD_TO_CART",
            payload: cart,
          });
        }
    }

  return (
    <tbody>
      <tr>
        <td>
            <div style={{width:'100px',height:'auto'}}>
                {p.images.length ? (<ModalImage small={p.images[0].url} large={p.images[0].url}/> ):(<ModalImage small={laptop_default} large={laptop_default}/>)}
            </div>
        </td>

        <td>{p.title}</td>
        <td>&#8377;{p.price}</td>
        <td>{p.brand}</td>
        <td>{p.color}</td>
        <td className="text-center">
        <input
            type="number"
            className="form-control"
            value={p.count}
            onChange={handleQuantityChange}
          />
            </td>
        <td className="text-center">{p.shipping === "Yes" ? (<CheckCircleOutlined className="text-success"/>):(<CloseCircleOutlined className="text-danger"/>) }</td>
        <td className="text-center">
            <CloseOutlined onClick={handleRemove} className="text-danger pointer"/>
        </td>
      </tr>
    </tbody>
  );
};

export default ProductCardInCheckout;
