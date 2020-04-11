import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Button, Container, Title, Column, Card, Content} from 'rbx';

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

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  return (
    <ProductsGrid products = {products}/>
  );
};

export default App;