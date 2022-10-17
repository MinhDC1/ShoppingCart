package com.spring.angular.shoppingcart;



import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.spring.angular.shoppingcart.controller.OrderController;
import com.spring.angular.shoppingcart.controller.ProductController;
import com.spring.angular.shoppingcart.dto.OrderProductDto;
import com.spring.angular.shoppingcart.model.Order;
import com.spring.angular.shoppingcart.model.Product;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;

import java.util.Arrays;
import java.util.Collections;

@SpringBootTest(classes = { ShoppingCartApplication.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ShoppingCartApplicationIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;

    @LocalServerPort private int port;

    @Autowired private ProductController productController;

    @Autowired private OrderController orderController;

    @Test
    public void contextLoads() {
        Assertions
            .assertThat(productController)
            .isNotNull();
        
        Assertions  
            .assertThat(orderController)
            .isNotNull();
    }

    @Test
    public void givenGetProductsApiCall_whenProductListRetrieved_thenSizeMatchAndListContainsProductNames() {
        ResponseEntity<Iterable<Product>> responseEntity = 
            restTemplate.exchange("http://localhost:" + port + "/api/products", 
                HttpMethod.GET, null, 
                new ParameterizedTypeReference<Iterable<Product>>() {            
        });

        Iterable<Product> products = responseEntity.getBody();
        Assertions
            .assertThat(products)
            .hasSize(7);

        assertThat(products, hasItem(hasProperty("name", is("TV Set"))));
        assertThat(products, hasItem(hasProperty("name", is("Game Console"))));
        assertThat(products, hasItem(hasProperty("name", is("Sofa"))));
        assertThat(products, hasItem(hasProperty("name", is("Icecream"))));
        assertThat(products, hasItem(hasProperty("name", is("Beer"))));
        assertThat(products, hasItem(hasProperty("name", is("Phone"))));
        assertThat(products, hasItem(hasProperty("name", is("Watch"))));
        
    }

    @Test
    public void givenGetOrdersApiCall_WhenProductListRetrieved_thenSizeMatchAndListContainsProductName() {
        ResponseEntity<Iterable<Order>> responseEntity = 
            restTemplate.exchange("http://localhost:" + port + "/api/orders", 
            HttpMethod.GET, null, 
            new ParameterizedTypeReference<Iterable<Order>>() {                
            });

        Iterable<Order> orders = responseEntity.getBody();
        Assertions
            .assertThat(orders)                
            .hasSize(0);
    }

    @Test
    public void givenPostOrder_whenBodyRequestMatcherJson_thenResponseContainsEqualObjectProperties() {
        final ResponseEntity<Order> postResponse = restTemplate.postForEntity("http://localhost:" + port + "/api/orders", prepareOrderForm(), Order.class);
        Order order = postResponse.getBody();
        Assertions
          .assertThat(postResponse.getStatusCode())
          .isEqualByComparingTo(HttpStatus.CREATED);

        assertThat(order, hasProperty("status", is("PAID")));
        assertThat(order.getOrderProducts(), hasItem(hasProperty("quantity", is(2))));
    }

    private OrderController.OrderForm prepareOrderForm() {
        OrderController.OrderForm orderForm = new OrderController.OrderForm();
        OrderProductDto productDto = new OrderProductDto();
        productDto.setProduct(new Product(1L, "TV Set", 300.00, "https://fakeimg.pl/200x100/?retina=1&text=TVSet&font=lobster"));
        productDto.setQuantity(2);
        orderForm.setProductOrders(Collections.singletonList(productDto));

        return orderForm;
    }

}
