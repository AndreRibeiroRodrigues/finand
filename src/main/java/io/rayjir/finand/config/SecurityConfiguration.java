package io.rayjir.finand.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

import io.rayjir.finand.security.CustomUserDetailsService;
import io.rayjir.finand.service.UsuarioService;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    
    @Bean
    public SecurityFilterChain securityfilterchain(HttpSecurity http) throws Exception{
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(configurer ->{
                    configurer.loginPage("/login")
                            .failureUrl("/login?error")
                            .defaultSuccessUrl("/", true)
                            .permitAll();
                })
                .logout(configurer -> configurer
                        .logoutSuccessUrl("/login?logout")
                        .permitAll())
                .httpBasic(Customizer.withDefaults())
                .authorizeHttpRequests(authorize ->{
                    authorize.requestMatchers(
                            "/login",
                            "/css/**",
                            "/js/**",
                            "/images/**"
                    ).permitAll();
                    authorize.requestMatchers(HttpMethod.POST,"/usuarios/**").hasRole("ADMIN");
                    authorize.requestMatchers(HttpMethod.GET, "/api/despesas").hasRole("USER", "ADMIN");
                    authorize.anyRequest().authenticated();
                })
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(10);
    }
    
    @Bean
    public UserDetailsService userDetailsService(UsuarioService usuarioservice){
        // UserDetails userD1 = User.builder()
        //                         .username("andre")
        //                         .password(encoder.encode("12345"))
        //                         .roles("USER")
        //                         .build();

        // UserDetails userD2 = User.builder()
        //                         .username("rayjir")
        //                         .password(encoder.encode("Um-emelhorque2"))
        //                         .roles("ADMIN")
        //                         .build();

        // return new InMemoryUserDetailsManager(userD1, userD2);
        return new CustomUserDetailsService(usuarioservice);
    }
}
