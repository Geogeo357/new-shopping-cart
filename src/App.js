import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Button, Container, Title, Column, Card, Content, Message} from 'rbx';
import Sidebar from 'react-sidebar';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCGC5h8SqSKx_5JIOR6GdHQJQiQqm3w6rA",
  authDomain: "new-shopping-cart-65e28.firebaseapp.com",
  databaseURL: "https://new-shopping-cart-65e28.firebaseio.com",
  projectId: "new-shopping-cart-65e28",
  storageBucket: "new-shopping-cart-65e28.appspot.com",
  messagingSenderId: "377243796977",
  appId: "1:377243796977:web:1400dbda6325a994a6b050"
};
  
  firebase.initializeApp(firebaseConfig);

  const db = firebase.database().ref();

  
const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

const Welcome = ({ user }) => (
  <Message color="info">
    <Message.Header>
      Welcome, {user.displayName}
      <Button primary onClick={() => firebase.auth().signOut()}>
        Log out
      </Button>
    </Message.Header>
  </Message>
);

const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);

const Banner = ({ user, title }) => (
  <React.Fragment>
    { user ? <Welcome user={ user } /> : <SignIn /> }
    <Title>{ title || '[loading...]' }</Title>
  </React.Fragment>
);

const CheckRemainingAmount = (product, cartproducts, inventory) => {
  var inventoryNum = inventory[product.sku] ? (inventory[product.sku][product.size]? inventory[product.sku][product.size] : 0) : 0;
  var purchasedNum = 0;
  for (var i = 0; i < cartproducts.length; i++){
    if (cartproducts[i].sku == product.sku && cartproducts[i].size == product.size){
      purchasedNum = cartproducts[i].quantity;
    }
  }
  return inventoryNum - purchasedNum;
}


const ProductCard = ({product, addToCart, openSidebar, inventory, cartproducts}) => {

  var filepath = "data/products/" + product.sku + "_1.jpg";
  var productPrice = product.price.toString();
  if (productPrice.indexOf('.') >= 0){
    if (productPrice.substring(productPrice.indexOf('.') + 1). length < 2){
      productPrice += '0';
    }
  }

  return ( <Column><Card>
  <Card.Header>
    <Card.Header.Title>{product.title}</Card.Header.Title>
  </Card.Header>
  <Card.Content>
    <Content>
      <Title align="center">{'$' + productPrice}</Title>
      <h4 align="center">{product.style ? product.style : <br/>}</h4>
      <h4 align="center">{product.description ? product.description :<br/>}</h4>
    <img src={filepath} width="273"/>
    </Content>
  </Card.Content>
  <Card.Footer>
    {
      CheckRemainingAmount(Object.assign({}, {...product, "size":"S"}), cartproducts, inventory) > 0 ? <Card.Footer.Item as="a" onClick={() => {addToCart(Object.assign({}, {...product, "size":"S"}));openSidebar();}}>
      S
    </Card.Footer.Item>:
    <Card.Footer.Item as="p">
    Out of Stock
  </Card.Footer.Item>
    }
    {
      CheckRemainingAmount(Object.assign({}, {...product, "size":"M"}), cartproducts, inventory) > 0 ? <Card.Footer.Item as="a" onClick={() => {addToCart(Object.assign({}, {...product, "size":"M"}));openSidebar();}}>
      M
    </Card.Footer.Item>:
    <Card.Footer.Item as="p">
    Out of Stock
  </Card.Footer.Item>
    }
    {
      CheckRemainingAmount(Object.assign({}, {...product, "size":"L"}), cartproducts, inventory) > 0 ? <Card.Footer.Item as="a" onClick={() => {addToCart(Object.assign({}, {...product, "size":"L"}));openSidebar();}}>
      L
    </Card.Footer.Item>:
    <Card.Footer.Item as="p">
    Out of Stock
  </Card.Footer.Item>
    }
    {
      CheckRemainingAmount(Object.assign({}, {...product, "size":"XL"}), cartproducts, inventory) > 0 ? <Card.Footer.Item as="a" onClick={() => {addToCart(Object.assign({}, {...product, "size":"XL"}));openSidebar();}}>
      XL
    </Card.Footer.Item>:
    <Card.Footer.Item as="p">
    Out of Stock
  </Card.Footer.Item>
    }

  </Card.Footer>
</Card></Column>
);
}

const ProductsGrid = ({products, addToCart, openSidebar, inventory, cartproducts}) => {
  var col1Prods = [];
  var col2Prods = [];
  var col3Prods = [];
  var col4Prods = [];
  
  for (var i = 0; i < products.length; i+=4){
    col1Prods.push(products[i]);
    if (i + 1 < products.length){
      col2Prods.push(products[i + 1]);
    }
    if (i + 2 < products.length){
      col3Prods.push(products[i + 2]);
    }
    if (i + 3 < products.length){
      col4Prods.push(products[i + 3]);
    }
  }

  return (
  <Column.Group>
    <Column>
      {col1Prods.map(product => <ProductCard product={product} addToCart={addToCart} openSidebar={openSidebar} inventory={inventory} cartproducts={cartproducts}></ProductCard>)}
    </Column>
      <Column>
      {col2Prods.map(product => <ProductCard product={product} addToCart={addToCart} openSidebar={openSidebar} inventory={inventory} cartproducts={cartproducts}></ProductCard>)}
    </Column>
      <Column>
      {col3Prods.map(product => <ProductCard product={product} addToCart={addToCart} openSidebar={openSidebar} inventory={inventory} cartproducts={cartproducts}></ProductCard>)}
    </Column>
      <Column>
      {col4Prods.map(product => <ProductCard product={product} addToCart={addToCart} openSidebar={openSidebar} inventory={inventory} cartproducts={cartproducts}></ProductCard>)}
    </Column>
  </Column.Group>
  );

}

const ShoppingCard = ({product, addToCart, removeFromCart, inventory, cartproducts, setUpdateCart}) => {

  var filepath = "data/products/" + product.sku + "_1.jpg";
  var productPrice = product.price.toString();
  if (productPrice.indexOf('.') >= 0){
    if (productPrice.substring(productPrice.indexOf('.') + 1). length < 2){
      productPrice += '0';
    }
  }

  var inventoryNum = inventory[product.sku] ? (inventory[product.sku][product.size]? inventory[product.sku][product.size] : 0) : 0;
  

  // useEffect(() => {
  //   if(CheckRemainingAmount(product, cartproducts, inventory) < 0){
  //     setUpdateCart(true);
  //   }
  // }, [product]);

  return ( <Column><Card>
  <Card.Header>
    <Card.Header.Title>{product.title}</Card.Header.Title>
  </Card.Header>
  <Card.Content>
    <Content>
      <Column.Group>
      <Column size="one-third">
      <img src={filepath} width="75"/>
      </Column>
      <Column>
      <h5>{'$' + productPrice}</h5>
      <p>{product.description + '; ' + product.style}</p>
      <p>{'Size: ' + product.size}</p>
      {CheckRemainingAmount(product, cartproducts, inventory) < 0 ? 
      <p>{"Only " + inventoryNum + " left in stock!" }</p>: <React.Fragment></React.Fragment>}
      </Column>
      </Column.Group>
    </Content>
  </Card.Content>
  <Card.Footer>
  <Card.Footer.Item as="p">
        {'Quantity: ' + product.quantity}
    </Card.Footer.Item>
    {CheckRemainingAmount(product, cartproducts, inventory) > 0 ? <Card.Footer.Item as="a" onClick={() => {addToCart(product);}}>
      +
    </Card.Footer.Item>:
    <Card.Footer.Item as="p">
    No More in Stock
  </Card.Footer.Item>}
    <Card.Footer.Item as="a" onClick={() => {removeFromCart(product);}}>
      -
    </Card.Footer.Item>

  </Card.Footer>
</Card></Column>
  );
};

const ShoppingCart = ({items, closeSidebar,  addToCart, removeFromCart, inventory, setCartItems}) => {
  const [updateCart, setUpdateCart] = useState(false);
  var totalCost = 0;
  for (var i = 0; i < items.length; i++){
    totalCost += Math.round(items[i].quantity * items[i].price * 100);
  }
  totalCost /= 100;

  useEffect(() => {
    var needToUpdateCart= false;
    for (var i = 0; i < items.length; i++){
      var product = items[i];
      if(CheckRemainingAmount(product, items, inventory) < 0){
        needToUpdateCart = true;
      }
    }
    setUpdateCart(needToUpdateCart);
  }, [items]);

  const checkout = () => {
    var databaseInventory = firebase.database().ref();
    databaseInventory.transaction(function (currData){
      var transactionFailed = false;
      for (var i = 0; i < items.length; i++){
        if(items[i].quantity <= currData[items[i].sku][items[i].size]){
          currData[items[i].sku][items[i].size] -= items[i].quantity;
        } else {
          transactionFailed = true;
        }
      }
      if(transactionFailed){
        alert('Purchase failed; not enough items in stock');
        return;
      } else {
        setCartItems({});
        return currData;
      }
    });
  };

  const UpdateCartAmounts = () => {
    for (var i = 0; i < items.length; i++){
      while(CheckRemainingAmount(items[i], items, inventory) < 0){
        removeFromCart(items[i]);
      }
    }
  }

  return (
    <React.Fragment>
      <Column.Group>
        <Column>
          <Title>Shopping Cart Items:</Title>
        </Column>
        <Column size="one-fifth">
          <Button onClick={closeSidebar}>Close</Button>
        </Column>
      </Column.Group>
      {items.map(product => <ShoppingCard product={product} addToCart={addToCart} removeFromCart={removeFromCart} inventory={inventory} cartproducts={items} setUpdateCart={setUpdateCart}></ShoppingCard>)}
      <Title>{'Total Cost: $' + totalCost}</Title>
      {updateCart ? <Button onClick={UpdateCartAmounts}>Update Cart</Button> : <Button onClick={checkout}>Check Out</Button>}
    </React.Fragment>
  );
}

const App = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({});
  const [inventoryJSON, setInventory] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const products = Object.values(data);
  var cartproducts = Object.values(cartItems);
  var inventory = {};
  var inventoryKeys = Object.keys(inventoryJSON);
  for(var i = 0; i < inventoryKeys.length; i++){
    // jsonI[inventoryKeys[i]]['sku'] = inventoryKeys[i];
    inventory[inventoryKeys[i]] = inventoryJSON[inventoryKeys[i]];
  } 

const userUpdateFunc = (user) => {
  if(user){
    const db2 = firebase.database().ref('cart/' + user.uid);
    const handleData2 = snap => {
      if(snap.val()){
    // setCartItems(snap.val());
        var i = 0;
        for (i = 0; i < snap.val().length-1; i++){
          var amount = snap.val()[i]['quantity'];
          console.log('hm' + i + " " + amount);
          addToCart(snap.val()[i], amount, false);
          // while (amount >= 1){
          //   // alert('amount uno: ' + amount);
          //   amount --;
          //   addToCart(snap.val()[i]);
          // }
        }
        var amount = snap.val()[i]['quantity'];
        addToCart(snap.val()[i], amount, true);
        db2.off('value', handleData2);
      }
    }

    
    db2.on('value', handleData2, error => alert(error));
  }
  setUser(user);
}

  const addToCart = (newProd, additional = 1, updateDB = true) => {
    var done = false;
      for(var i = 0; i < cartproducts.length; i++){
        var y = cartproducts[i];
        if(y.sku.toString() == newProd.sku.toString() && y.size.toString() == newProd.size.toString()){
          // alert(y.quantity)
          console.log(y.size + " at " + y.quantity);
          y.quantity = y.quantity + additional;
          // alert(y.quantity)
          console.log(y.size + " to " + y.quantity);
          done = true;
        }
      }
      if(!done){
        newProd.quantity = additional;
        cartproducts.push(newProd);
      }
    setCartItems(cartproducts);
    if(user && updateDB){
      var cartItems= cartproducts;
      db.child('cart').child(user.uid).remove();
      db.child('cart').child(user.uid).update({...cartItems})
    .catch(error => alert(error));
    }
  };

  const removeFromCart = (newProd) => {
    var done = false;
      for(var i = 0; i < cartproducts.length; i++){
        var y = cartproducts[i];
        if(y.sku == newProd.sku && y.size == newProd.size){
          if(y.quantity > 1){
            y.quantity = y.quantity - 1;
          } else{
            cartproducts = cartproducts.filter((v) => v !== y);
          }
        }
      }
      
      // inventory[newProd.sku][newProd.size]++;
      // setInventory(inventory);
    setCartItems(cartproducts);
    if(user){
      var cartItems= cartproducts;
      db.child('cart').child(user.uid).remove();
      db.child('cart').child(user.uid).update({...cartproducts})
    .catch(error => alert(error));
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
      
    };
    fetchProducts();
    const handleData = snap => {
      if (snap.val()){
        setInventory(snap.val());
      }
    };
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };

  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(userUpdateFunc);
  }, []);

  return (
    <React.Fragment>
      <Sidebar 
        sidebar={
          <React.Fragment>
          <ShoppingCart items={cartproducts} setCartItems={setCartItems} closeSidebar={() => setSidebarOpen(false)} addToCart={addToCart} removeFromCart={removeFromCart} inventory={inventory} />
          </React.Fragment>
      }
        open={sidebarOpen}
        onSetOpen={(open) => setSidebarOpen(open)}
        styles={{ sidebar: { background: "white" } }}>
          <Banner title="Our Awesome Shopping App" user={ user } />
      <Button onClick={() => setSidebarOpen(!sidebarOpen)}>ShoppingCart</Button>
      <ProductsGrid products={products} addToCart={addToCart} openSidebar={() => setSidebarOpen(true)} inventory={inventory} cartproducts={cartproducts} />
      </Sidebar>
    </React.Fragment>
  );
};

export default App;