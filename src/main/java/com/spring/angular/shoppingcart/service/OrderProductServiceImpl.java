package com.spring.angular.shoppingcart.service;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.spring.angular.shoppingcart.model.OrderProduct;
import com.spring.angular.shoppingcart.repository.OrderProductRespository;

@Service
@Transactional
public class OrderProductServiceImpl implements OrderProductService {
    
    private OrderProductRespository orderProductRespository;

    public OrderProductServiceImpl(OrderProductRespository orderProductRespository) {
        this.orderProductRespository = orderProductRespository;
    }

    @Override
    public OrderProduct create(OrderProduct orderProduct) {
        return this.orderProductRespository.save(orderProduct);
    }
}
