package com.ivion.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class IvionApplication {

	public static void main(String[] args) {
		SpringApplication.run(IvionApplication.class, args);
	}

}
