package io.Rayjir.finand.controller;

import io.Rayjir.finand.entity.Auth;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;




@RestController
@RequestMapping("/api/auth")
public class AuthController {
 
    @GetMapping("/")
    public ResponseEntity<Auth> getAuth(@RequestParam Auth auth) {

        return new ResponseEntity<Auth>(auth, HttpStatusCode.valueOf(200));
    }
    
}
