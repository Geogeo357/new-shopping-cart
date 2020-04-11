import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Button, Container, Title, Column, Card, Content} from 'rbx';
import Sidebar from 'react-sidebar';

const ProductCard = ({product}) => {

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
      <Title>{'$' + productPrice}</Title>
      <h4>{product.description}</h4>
      <h4>{product.style}</h4>
    <img src={filepath}/>
    </Content>
  </Card.Content>
  <Card.Footer>
    <Card.Footer.Item as="a" href="#">
      S
    </Card.Footer.Item>
    <Card.Footer.Item as="a" href="#">
      M
    </Card.Footer.Item>
    <Card.Footer.Item as="a" href="#">
      L
    </Card.Footer.Item>
    <Card.Footer.Item as="a" href="#">
      XL
    </Card.Footer.Item>

  </Card.Footer>
</Card></Column>
);
}

const ProductsGrid = ({products}) => {
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
      {col1Prods.map(product => <ProductCard product={product}></ProductCard>)}
    </Column>
      <Column>
      {col2Prods.map(product => <ProductCard product={product}></ProductCard>)}
    </Column>
      <Column>
      {col3Prods.map(product => <ProductCard product={product}></ProductCard>)}
    </Column>
      <Column>
      {col4Prods.map(product => <ProductCard product={product}></ProductCard>)}
    </Column>
  </Column.Group>
  );

}

const ShoppingCard = ({product}) => {

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
      </Column>
      </Column.Group>
    </Content>
  </Card.Content>
  <Card.Footer>
  <Card.Footer.Item as="p">
        {'Quantity: ' + product.quantity}
    </Card.Footer.Item>
    <Card.Footer.Item as="a" href="#">
      +
    </Card.Footer.Item>
    <Card.Footer.Item as="a" href="#">
      -
    </Card.Footer.Item>

  </Card.Footer>
</Card></Column>
  );
};

const ShoppingCart = ({items, closeSidebar}) => {
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
      {items.map(product => <ShoppingCard product={product}></ShoppingCard>)}
      <Title>{'Total Cost: $' + totalCost}</Title>
    </React.Fragment>
  );
}

const App = () => {
  const [data, setData] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const products = Object.values(data);
  const cartproducts = Object.values(cartItems);
  
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
      const response2 = await fetch('./data/cartproducts.json');
      const json2 = await response2.json();
      setCartItems(json2);
    };
    fetchProducts();
    
  }, []);

  return (
    <React.Fragment>
      <Sidebar 
        sidebar={<ShoppingCart items={cartproducts} closeSidebar={() => setSidebarOpen(false)}/>}
        open={sidebarOpen}
        onSetOpen={(open) => setSidebarOpen(open)}
        styles={{ sidebar: { background: "white" } }}>
      <Button onClick={() => setSidebarOpen(!sidebarOpen)}>ShoppingCart</Button>
      <ProductsGrid products = {products}/>
      </Sidebar>
    </React.Fragment>
  );
};

export default App;