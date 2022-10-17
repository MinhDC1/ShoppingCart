package com.spring.angular.shoppingcart.repository;

import org.springframework.data.repository.CrudRepository;

import com.spring.angular.shoppingcart.model.OrderProduct;
import com.spring.angular.shoppingcart.model.OrderProductPK;

public interface OrderProductRespository extends CrudRepository<OrderProduct, OrderProductPK>{
    
}
