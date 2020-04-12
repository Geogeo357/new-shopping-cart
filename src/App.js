import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Button, Container, Title, Column, Card, Content} from 'rbx';
import Sidebar from 'react-sidebar';

const ProductCard = ({product, addToCart, openSidebar, inventory}) => {

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
      inventory[product.sku]? (inventory[product.sku]['S'] > 0 ? <Card.Footer.Item as="a" onClick={() => {addToCart(Object.assign({}, {...product, "size":"S"}));openSidebar();}}>
      S
    </Card.Footer.Item>:
    <Card.Footer.Item as="p">
    Out of Stock
  </Card.Footer.Item>) : <React.Fragment></React.Fragment>
    }
    {
      inventory[product.sku]? (inventory[product.sku]['M'] > 0 ? <Card.Footer.Item as="a" onClick={() => {addToCart(Object.assign({}, {...product, "size":"M"}));openSidebar();}}>
      M
    </Card.Footer.Item>:
    <Card.Footer.Item as="p">
    Out of Stock
  </Card.Footer.Item>) : <React.Fragment></React.Fragment>
    }
    {
      inventory[product.sku]? (inventory[product.sku]['L'] > 0 ? <Card.Footer.Item as="a" onClick={() => {addToCart(Object.assign({}, {...product, "size":"L"}));openSidebar();}}>
      L
    </Card.Footer.Item>:
    <Card.Footer.Item as="p">
    Out of Stock
  </Card.Footer.Item>) : <React.Fragment></React.Fragment>
    }
    {
      inventory[product.sku]? (inventory[product.sku]['XL'] > 0 ? <Card.Footer.Item as="a" onClick={() => {addToCart(Object.assign({}, {...product, "size":"XL"}));openSidebar();}}>
      XL
    </Card.Footer.Item>:
    <Card.Footer.Item as="p">
    Out of Stock
  </Card.Footer.Item>) : <React.Fragment></React.Fragment>
    }

  </Card.Footer>
</Card></Column>
);
}

const ProductsGrid = ({products, addToCart, openSidebar, inventory}) => {
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
      {col1Prods.map(product => <ProductCard product={product} addToCart={addToCart} openSidebar={openSidebar} inventory={inventory} ></ProductCard>)}
    </Column>
      <Column>
      {col2Prods.map(product => <ProductCard product={product} addToCart={addToCart} openSidebar={openSidebar} inventory={inventory} ></ProductCard>)}
    </Column>
      <Column>
      {col3Prods.map(product => <ProductCard product={product} addToCart={addToCart} openSidebar={openSidebar} inventory={inventory}></ProductCard>)}
    </Column>
      <Column>
      {col4Prods.map(product => <ProductCard product={product} addToCart={addToCart} openSidebar={openSidebar} inventory={inventory}></ProductCard>)}
    </Column>
  </Column.Group>
  );

}

const ShoppingCard = ({product, addToCart, removeFromCart}) => {

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
      <Column.Group>
      <Column size="one-third">
      <img src={filepath} width="75"/>
      </Column>
      <Column>
      <h5>{'$' + productPrice}</h5>
      <p>{product.description + '; ' + product.style}</p>
      <p>{'Size: ' + product.size}</p>
      </Column>
      </Column.Group>
    </Content>
  </Card.Content>
  <Card.Footer>
  <Card.Footer.Item as="p">
        {'Quantity: ' + product.quantity}
    </Card.Footer.Item>
    <Card.Footer.Item as="a" onClick={() => {addToCart(product);}}>
      +
    </Card.Footer.Item>
    <Card.Footer.Item as="a" onClick={() => {removeFromCart(product);}}>
      -
    </Card.Footer.Item>

  </Card.Footer>
</Card></Column>
  );
};

const ShoppingCart = ({items, closeSidebar,  addToCart, removeFromCart}) => {
  var totalCost = 0;
  for (var i = 0; i < items.length; i++){
    totalCost += Math.round(items[i].quantity * items[i].price * 100);
  }
  totalCost /= 100;
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
      {items.map(product => <ShoppingCard product={product} addToCart={addToCart} removeFromCart={removeFromCart}></ShoppingCard>)}
      <Title>{'Total Cost: $' + totalCost}</Title>
    </React.Fragment>
  );
}

const App = () => {
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

  const addToCart = (newProd) => {
    var newCartItems = [];
    var done = false;
      for(var i = 0; i < cartproducts.length; i++){
        var y = cartproducts[i];
        if(y.sku == newProd.sku && y.size == newProd.size){
          y.quantity = y.quantity + 1;
          done = true;
        }
        newCartItems.push(y);
      }
      if(!done){
        newProd.quantity = 1;
        cartproducts.push(newProd);
        newCartItems = cartproducts;
      }
      inventory[newProd.sku][newProd.size]--;
      setInventory(inventory);
    setCartItems(newCartItems);
  };

  const removeFromCart = (newProd) => {
    var newCartItems = [];
    var done = false;
      for(var i = 0; i < cartproducts.length; i++){
        var y = cartproducts[i];
        if(y.sku == newProd.sku && y.size == newProd.size){
          if(y.quantity > 1){
            y.quantity = y.quantity - 1;
            newCartItems.push(y);
          }
        }
      }
      inventory[newProd.sku][newProd.size]++;
      setInventory(inventory);
    setCartItems(newCartItems);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
      const responseI = await fetch('./data/inventory.json');
      const jsonI = await responseI.json();
      setInventory(jsonI);
    };
    fetchProducts();
    
  }, []);

  return (
    <React.Fragment>
      <Sidebar 
        sidebar={<ShoppingCart items={cartproducts} closeSidebar={() => setSidebarOpen(false)} addToCart={addToCart} removeFromCart={removeFromCart} inventory={inventory} />}
        open={sidebarOpen}
        onSetOpen={(open) => setSidebarOpen(open)}
        styles={{ sidebar: { background: "white" } }}>
      <Button onClick={() => setSidebarOpen(!sidebarOpen)}>ShoppingCart</Button>
      <ProductsGrid products={products} addToCart={addToCart} openSidebar={() => setSidebarOpen(true)} inventory={inventory} />
      </Sidebar>
    </React.Fragment>
  );
};

export default App;