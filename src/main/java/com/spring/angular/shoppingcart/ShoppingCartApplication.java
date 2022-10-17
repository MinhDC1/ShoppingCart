package com.spring.angular.shoppingcart;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.spring.angular.shoppingcart.model.Product;
import com.spring.angular.shoppingcart.service.ProductService;

@SpringBootApplication
public class ShoppingCartApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShoppingCartApplication.class, args);
	}

	@Bean
	CommandLineRunner runner(ProductService productService) {
		return args -> {
			productService.save(new Product(1L, "TV Set", 300.00, "https://fakeimg.pl/200x100/?retina=1&text=TVSet&font=lobster"));
			productService.save(new Product(2L, "Game Console", 200.00, "https://fakeimg.pl/200x100/?retina=1&text=Game&font=lobster"));
            productService.save(new Product(3L, "Sofa", 100.00, "https://fakeimg.pl/200x100/?retina=1&text=Sofa&font=lobster"));
            productService.save(new Product(4L, "Icecream", 5.00, "https://fakeimg.pl/200x100/?retina=1&text=Icecream&font=lobster"));
            productService.save(new Product(5L, "Beer", 3.00, "https://fakeimg.pl/200x100/?retina=1&text=Beer&font=lobster"));
            productService.save(new Product(6L, "Phone", 500.00, "https://fakeimg.pl/200x100/?retina=1&text=Phone&font=lobster"));
            productService.save(new Product(7L, "Watch", 30.00, "https://fakeimg.pl/200x100/?retina=1&text=Watch&font=lobster"));
		};
	}

}
