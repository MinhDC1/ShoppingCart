package com.spring.angular.shoppingcart.repository;

import org.springframework.data.repository.CrudRepository;

import com.spring.angular.shoppingcart.model.Order;

public interface OrderRepository extends CrudRepository<Order, Long> {
    
}
