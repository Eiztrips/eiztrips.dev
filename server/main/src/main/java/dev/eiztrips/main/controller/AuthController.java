package dev.eiztrips.main.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.eiztrips.main.service.AuthService;
import dev.eiztrips.main.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final ObjectMapper objectMapper;

    @GetMapping("/vk")
    public RedirectView redirectToVk() {
        String url = authService.VkAuthRedirect();
        return new RedirectView(url);
    }

    @GetMapping("/vk/callback")
    public RedirectView handleVkCallback(@RequestParam String payload) throws Exception {
        String url = authService.handleVkCallback(objectMapper.readValue(payload, Map.class));
        return new RedirectView(url);
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyToken(@CookieValue(value = "jwt", required = false) String token) {
        if (token == null || token.isBlank()) {
            return ResponseEntity.status(401).body("Token is missing");
        }

        return jwtService.isTokenValid(token) ?
                ResponseEntity.ok("Token is valid"): ResponseEntity.status(401).body("Token is invalid");
    }
}