package dev.eiztrips.main.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class JwtServiceTest {

    private final JwtService jwtService = new JwtService();

    @Test
    public void testAllOperationsWithJwt() {
        String appId = "123456789";
        String token = jwtService.generateTokenWithAppId(appId);

        assertEquals(appId, jwtService.extractAppId(token));
        assertTrue(jwtService.isTokenValid(token));
    }
}
