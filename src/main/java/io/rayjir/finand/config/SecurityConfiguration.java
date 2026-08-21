package io.rayjir.finand.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    
    @Bean
    public SecurityFilterChain securityfilterchain(HttpSecurity http) throws Exception{
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(configurer ->{
                    configurer.loginPage("/login")
                            .defaultSuccessUrl("/", true)
                            .permitAll();
                })
                .httpBasic(Customizer.withDefaults())
                .authorizeHttpRequests(authorize ->{
                    authorize.requestMatchers(
                            "/login",
                            "/css/**",
                            "/js/**",
                            "/images/**"
                    ).permitAll();
                    authorize.anyRequest().authenticated();
                })
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(10);
    }
    
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder){
        UserDetails userD1 = User.builder()
                                .username("andre")
                                .password(encoder.encode("12345"))
                                .roles("USER")
                                .build();

        UserDetails userD2 = User.builder()
                                .username("rayjir")
                                .password(encoder.encode("123"))
                                .roles("ADMIN")
                                .build();

        return new InMemoryUserDetailsManager(userD1, userD2);

    }
}
