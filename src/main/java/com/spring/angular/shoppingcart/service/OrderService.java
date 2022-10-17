package com.spring.angular.shoppingcart.service;

import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import com.spring.angular.shoppingcart.model.Order;

@Validated
public interface OrderService {
    
    public Iterable<Order> getAllOrders();

    public Order create(Order order);

    public void update(Order order);

}
