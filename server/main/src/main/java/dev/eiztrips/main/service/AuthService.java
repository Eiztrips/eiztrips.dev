package dev.eiztrips.main.service;

import dev.eiztrips.main.model.User;
import dev.eiztrips.main.repository.UserRepository;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RedisService redisService;
    private final JwtService jwtService;

    @Value("${default.api.url}")
    private String defaultApiUrl;

    @Value("${default.client.url}")
    private String defaultClientUrl;

    @Value("${vk.client.secret}")
    private String vkClientSecret;

    @Value("${vk.client.app.id}")
    private String vkClientAppId;

    @Value("${vk.client.api.version}")
    private String vkClientApiVersion;

    public String VkAuthRedirect() {
        String responseType = "code";
        String clientId = vkClientAppId;
        String codeVerifier = generateCodeVerifier();
        String codeChallenge = generateCodeChallenge(codeVerifier);
        String codeChallengeMethod = "S256";
        String redirectUri = defaultApiUrl + "/v1/auth/vk/callback";
        String state = generateState();

        redisService.saveState(state, Map.of(
                "code_verifier", codeVerifier,
                "code_challenge", codeChallenge
        ));

        return "https://id.vk.ru/authorize" + "?response_type=" + responseType +
        "&client_id=" + clientId +
        "&code_challenge=" + codeChallenge +
        "&code_challenge_method=" + codeChallengeMethod +
        "&redirect_uri=" + redirectUri +
        "&state=" + state;
    }

    private static String generateCodeVerifier() {
        java.security.SecureRandom sr = new java.security.SecureRandom();
        byte[] bytes = new byte[32];
        sr.nextBytes(bytes);
        return java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static String generateCodeChallenge(String codeVerifier) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(codeVerifier.getBytes(java.nio.charset.StandardCharsets.US_ASCII));
            return java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error generating code challenge", e);
        }
    }

    private static String generateState() {
        java.security.SecureRandom sr = new java.security.SecureRandom();
        byte[] bytes = new byte[24];
        sr.nextBytes(bytes);
        return java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public String handleVkCallback(Map<String, String > payload) {
        String state = payload.get("state");

        Map<String, String> redisData = redisService.getState(state);
        if (redisData == null)
            throw new IllegalArgumentException("Invalid state parameter");

        Map<String, String> combinedData = new java.util.HashMap<>(redisData);
        combinedData.putAll(payload);

        if (redisData.get("access_token") == null) {
            Map<String, String> tokenData = getAccessTokenFromVk(combinedData);
            redisService.addState(state, tokenData);
            combinedData.putAll(tokenData);
        }

        if (redisData.get("first_name") == null) {
            Map<String, String> userData = getUserDataFromVk(combinedData);
            redisService.addState(state, userData);
            combinedData.putAll(userData);
        }

        redisData = redisService.getState(state);

        getOrCreateUser(
                redisData.get("first_name") + " " + redisData.get("last_name"),
                "https://vk.com/id" + redisData.get("user_id"),
                Long.parseLong(redisData.get("user_id")),
                redisData
        );

        return defaultClientUrl;
    }

    private Map<String, String> getAccessTokenFromVk(Map<String, String> data) {
        String grantType = "authorization_code";
        String code = data.get("code");
        String codeVerifier = data.get("code_verifier");
        String clientId = vkClientAppId;
        String deviceId = data.get("device_id");
        String redirectUri = defaultApiUrl + "/v1/auth/vk/callback";
        String state = data.get("state");
        String url = "https://id.vk.ru/oauth2/auth" +
                "?client_id=" + clientId +
                "&grant_type=" + grantType +
                "&code=" + code +
                "&code_verifier=" + codeVerifier +
                "&device_id=" + deviceId +
                "&redirect_uri=" + redirectUri +
                "&state=" + state;
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.postForObject(url, null, Map.class);
    }

    private Map<String, String> getUserDataFromVk(Map<String, String> data) {
        String accessToken = data.get("access_token");
        String clientId = vkClientAppId;
        String url = "https://id.vk.ru/oauth2/user_info" +
                "?access_token=" + accessToken +
                "&client_id=" + clientId;
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(url, null, Map.class);
    }


    private void getOrCreateUser(String username, String link, Long appId, Map<String, String> userData) {
        if (userRepository.getUserByAppId(appId).isEmpty()) {
            User user = User.builder()
                    .username(username)
                    .link(link)
                    .appId(appId)
                    .userData(userData)
                    .build();
            userRepository.save(user);
        }
    }
}
