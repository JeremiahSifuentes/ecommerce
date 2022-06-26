import React, { createContext, useContext, useState, useEffect } from 'react';
// Pop up notification that lets us know when any changes are done to cart
import { toast } from 'react-hot-toast';

const Context = createContext();

// Context functional component
export const StateContext = ({ children  }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  // Normal variable that we will have access to in the state context file
  let foundProduct;
  let index;

  // Function for adding and removing products from the cart
  const onAdd = (product, quantity) => {
    // Is the item that we are adding to the cart already in the cart
    const checkProductInCart = cartItems.find((item) => item._id === product._id);
    
    // Logic to increase quantity and price on state
    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
    
    if(checkProductInCart) {
      // Logic updates only quantity of item since it is already in the cart
      const updatedCartItems = cartItems.map((cartProduct) => {
        if(cartProduct._id === product._id) return {
          ...cartProduct,
          quantity: cartProduct.quantity + quantity
        }
      })

      // Show updated cart items in cart
      setCartItems(updatedCartItems);
    } else {
      // Quantity of first product remains same
      product.quantity = quantity;
      // Then we spread existing cart items in cart, and then we spread new products added
      setCartItems([...cartItems, { ...product }]);
    }

    // Success banner when item is added
    // Pulled below if and else so it happens no matter what happens in loop
    toast.success(`${qty} ${product.name} added to the cart.`);
  } 

  const onRemove = (product) => {
    // Know which product we are updating
    foundProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);

    // Math for setting and updating price and quantities and then set it to newcartitems to update it
    setTotalPrice((prevTotalPrice) => prevTotalPrice -foundProduct.price * foundProduct.quantity);
    setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity);
    setCartItems(newCartItems);
  }

  // Accepts ID and value of product we will be updating in the cart
  const toggleCartItemQuanitity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((product) => product._id === id);
        // filter gives us a proper update of the cart items without mutating state correctly
        // Use filter to keep all items besides one we are currently updating
  const newCartItems = cartItems.filter((item) => item._id !== id)

    // Spreading array cartItems that is a state property
    // Never mutate or update state
    // Use setter function to update state that way
    if(value === 'inc') {
      // Updating cart items with current cart items and adding one new item to it and we are spreading the properties of that product and we are increasing the quantity by 1
      setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 } ]); 
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
      setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
    } else if(value === 'dec') {
      // Logic for removing a product quantity
      if (foundProduct.quantity > 1) {
        setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 } ]);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
      }
    }
  }

  // Increase and decrease cart quantity logic
  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  }

  const decQty = () => {
    setQty((prevQty) => {
      if(prevQty - 1 < 1) return 1;
     
      return prevQty - 1;
    });
  }

  return (
    // Where you pass in all state and data from Context so any page can access whats in here
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuanitity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities 
      }}
    >
      {children}
    </Context.Provider>
  )
}

// How to export the context to use state across all components
export const useStateContext = () => useContext(Context);