import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import ProductCardInCheckout from '../components/cards/ProductCardInCheckout'
import { userCart } from '../functions/user'
const Cart = ({history}) => {
    const {cart,user} = useSelector((state)=>({...state}));
    const dispatch = useDispatch();



    const getTotal = () =>{
        return cart.reduce((currentVal,nextVal)=>{
            return currentVal + nextVal.count*nextVal.price
        },0)
    }

    const saveOrderToDb =()=>{
        // console.log('cart',JSON.stringify(cart,null,4));
        userCart(cart,user.token)
        .then((res)=>{
            console.log('cart post',res);
            if(res.data.ok){
                history.push("/checkout")
            }
        }).catch((err)=>{
            console.log('cart save err',err);
        })
    }
    const showCartItems = ()=>(
        <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th scope="col">Image</th>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Count</th>
          <th scope="col">Shipping</th>
          <th scope="col">Remove</th>
        </tr>
      </thead>

      {cart.map((p) => (
        <ProductCardInCheckout key={p._id} p={p} />
      ))}
    </table>

    )

    return (
    <div className='container-fluid cart_body'>
        <div className='row'>
            <div className='col-md-8'>
            <h4 className='display-6'>{cart.length} Product(s) in your cart </h4>
                {!cart.length ? (<p>No products in cart&nbsp;
                <Link to="/shop">Continue Shopping</Link>
            </p>):showCartItems()
                }</div>
            <div className='col-md-4'>
                <h4 className='display-6'>Order Summary</h4>
                <hr/>
                <p>Products</p>
                {cart.map((c,i)=>(
                    <div key={i}>
                        <p>{c.title} x {c.count} =	&#8377;{c.price * c.count} </p>
                    </div>
                ))}
                <hr/>
                Total:<b>&#8377;{(getTotal())}</b>
                <hr/>
                {
                  user ? (
                    
                    <button onClick={saveOrderToDb} className='btn btn-sm btn-primary mt-2'
                    disabled={!cart.length}
                    >Proceed to checkout</button>
                  ) :(<button className='btn btn-sm btn-primary mt-2 ' > <Link to={{pathname:"/login",state:{from:"cart"}                       
                    }} className="login_to_checkout">Login to checkout</Link>
                    </button>) 
                }
            </div>
        </div>
    </div>
  )
}

export default Cart