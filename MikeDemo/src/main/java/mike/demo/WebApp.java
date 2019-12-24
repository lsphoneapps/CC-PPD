package mike.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;


@SpringBootApplication
public class WebApp {
    
    
    public static void main(String[] args) {
        SpringApplication.run(WebApp.class, args);
    }
    
    
    @GetMapping("/")
    public String greeting() {
        return "index";
    }


}
