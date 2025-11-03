package dev.eiztrips.main.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**").permitAll() // сюда можно без логина
                        .requestMatchers("/api/v1/debug/**").permitAll()
                        .anyRequest().authenticated()        // всё остальное требует JWT
                )
                .formLogin(AbstractHttpConfigurer::disable)  // отключить "Please sign in"
                .httpBasic(AbstractHttpConfigurer::disable); // и базовую аутентификацию

        return http.build();
    }
}