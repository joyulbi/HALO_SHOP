package com.company.haloshop;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.company.haloshop")
public class HaloShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(HaloShopApplication.class, args);
	}

}
