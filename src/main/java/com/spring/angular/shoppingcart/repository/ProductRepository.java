package com.spring.angular.shoppingcart.repository;

import org.springframework.data.repository.CrudRepository;

import com.spring.angular.shoppingcart.model.Product;

public interface ProductRepository extends CrudRepository<Product, Long> {    
}
