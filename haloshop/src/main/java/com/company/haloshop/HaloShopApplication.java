package com.company.haloshop;

import org.apache.ibatis.annotations.Mapper;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan(basePackages = "com.company.haloshop", annotationClass = Mapper.class)
public class HaloShopApplication {

    public static void main(String[] args) {
        SpringApplication.run(HaloShopApplication.class, args);
    }

}
