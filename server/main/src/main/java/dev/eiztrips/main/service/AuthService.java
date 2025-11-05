package dev.eiztrips.main.service;

import dev.eiztrips.main.model.User;
import dev.eiztrips.main.repository.UserRepository;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final KafkaProducerService kafkaProducerService;
    private final RedisService redisService;
    private final UserService userService;
    private final JwtService jwtService;

    @Value("${default.api.url}")
    private String defaultApiUrl;

    @Value("${default.client.url}")
    private String defaultClientUrl;

    @Value("${vk.client.app.id}")
    private String vkClientAppId;

    @Value("${tg.bot.username}")
    private String BOT_USERNAME;

    @Value("${admin.tg.id}")
    private String ADMIN_ID;

    // ----------------- VK AUTH -----------------
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

    // ----------------- VK CALLBACK -----------------
    public String handleVkCallback(Map<String, String> payload) {
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

        userService.getOrCreateUser(
                redisData.get("first_name") + " " + redisData.get("last_name"),
                "https://vk.com/id" + redisData.get("user_id"),
                Long.parseLong(redisData.get("user_id")),
                redisData
        );

        String jwtToken = jwtService.generateTokenWithAppId(redisData.get("user_id"));

        redisService.removeState(state);

        sendTgMessage(ADMIN_ID, "Авторизация пользователя "
                + redisData.get("first_name") + " " + redisData.get("last_name") + "\n"
                + "url: " + "https://vk.com/id" + redisData.get("user_id")
        );

        return defaultClientUrl + "/auth/success?token=" + jwtToken + "&mode=vk" + "&username=" + redisData.get("first_name");
    }

    private Map<String, String> getAccessTokenFromVk(Map<String, String> data) {
        String url = "https://id.vk.ru/oauth2/auth";

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", vkClientAppId);
        params.add("grant_type", "authorization_code");
        params.add("code", data.get("code"));
        params.add("code_verifier", data.get("code_verifier"));
        params.add("device_id", data.get("device_id"));
        params.add("redirect_uri", defaultApiUrl + "/v1/auth/vk/callback");
        params.add("state", data.get("state"));

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.postForObject(url, params, Map.class);

        Map<String, String> result = new java.util.HashMap<>();
        if (response != null) {
            response.forEach((key, value) -> result.put(key, String.valueOf(value)));
        }
        return result;
    }

    private Map<String, String> getUserDataFromVk(Map<String, String> data) {
        String url = "https://id.vk.ru/oauth2/user_info";

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", vkClientAppId);
        params.add("access_token", data.get("access_token"));

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.postForObject(url, params, Map.class);

        Map<String, String> result = new java.util.HashMap<>();
        if (response != null && response.get("user") instanceof Map) {
            Map<String, Object> userMap = (Map<String, Object>) response.get("user");
            userMap.forEach((key, value) -> result.put(key, String.valueOf(value)));
        }
        return result;
    }

    // ----------------- TG AUTH -----------------
    public String tgAuthRedirect() {
        String state = generateState();
        redisService.saveState(state, Map.of("state", state));
        return "https://t.me/" + BOT_USERNAME + "?start=" + state;
    }

    public String handleTgCallback(String state) {
        if (redisService.getState(state).get("state") == null || !Objects.equals(redisService.getState(state).get("state"), state))
            throw new IllegalArgumentException("Invalid state parameter");

        Map<String, String> userData = redisService.getState(state);

        String jwt = jwtService.generateTokenWithAppId(userData.get("id"));

        sendTgMessage(ADMIN_ID, "Авторизация пользователя "
                + userData.get("username") + "\n"
                + "url: " + "https://t.me/id" + userData.get("id")
        );

        return defaultClientUrl
                + "/auth/success?token=" + jwt
                + "&mode=tg"
                + "&username=" + userData.get("username");
    }

    @KafkaListener(topics = "telegram-bot", groupId = "main-service-consumer-group")
    public void tgServiceConsume(Map<String, Object> message) {
        String state = message.get("state").toString();

        if (redisService.getState(state).get("state") == null || !Objects.equals(redisService.getState(state).get("state"), state)) {
            log.warn("Недействительный или истекший state: {}", state);
            kafkaProducerService.sendMessage("telegram-bot-response", Map.of(
                    "chat_id", (( Map<String, Object> ) message.get("user_info")).get("id").toString(),
                    "message", "Ссылка для аутентификации недействительна или истекла. Пожалуйста, попробуйте снова."
            ));
            return;
        }

        Map<String, String> userDataMap = (( Map<String, Object> ) message.get("user_info"))
                .entrySet()
                .stream()
                .filter(e -> e.getKey() != null && e.getValue() != null)
                .collect(java.util.stream.Collectors.toMap(
                        Map.Entry::getKey,
                        e -> e.getValue().toString()
                ));

        String userId = userDataMap.get("id");
        String username = userDataMap.get("username");

        userService.getOrCreateUser(
                username,
                "https://t.me/" + username,
                Long.parseLong(userId),
                userDataMap
        );

        redisService.addState(state, userDataMap);

        String botMessage= "Успешная аутентификация!\n\n" +
                "Ваш аккаунт @" + username + " был успешно привязан к нашему сервису.\n\n" +
                "Что бы завершить регистрацию, перейдите по ссылке: "
                + defaultApiUrl + "/v1/auth/tg/callback?state=" + state;

        sendTgMessage(userId, botMessage);
    }

    // ------------------ TG SERVICE METHODS -------------------
    public void sendTgMessage(String chatId, String message) {
        kafkaProducerService.sendMessage("telegram-bot-response", Map.of(
                "chat_id", chatId,
                "message", message
        ));
    }
}
