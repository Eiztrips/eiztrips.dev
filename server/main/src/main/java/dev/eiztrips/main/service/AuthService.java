package dev.eiztrips.main.service;

import dev.eiztrips.main.model.User;
import dev.eiztrips.main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${default.api.url}")
    private String defaultApiUrl;

    @Value("${default.client.url}")
    private String defaultClientUrl;

    @Value("${vk.client.secret}")
    private String vkClientSecret;

    @Value("${vk.client.api.key}")
    private String vkClientApiKey;

    @Value("${vk.client.api.version}")
    private String vkClientApiVersion;

    public String VkAuthRedirect() {
        String redirectUri = defaultApiUrl + "/v1/auth/vk/callback";
        String responseType = "code";
        String display = "popup";

        return "https://oauth.vk.com/authorize?" +
                "client_id=" + vkClientApiKey +
                "&redirect_uri=" + redirectUri +
                "&response_type=" + responseType +
                "&display=" + display;
    }

    public String handleVkCallback(String code) {
        String accessToken = getVkAccessToken(code);
        Map<String, Object> userInfo = getVkUserInfo(accessToken);

        String username = (String) userInfo.get("first_name") + " " + userInfo.get("last_name");
        String link = "https://vk.com/id" + userInfo.get("id");
        Long vkId = ((Number) userInfo.get("id")).longValue();

        getOrCreateUser(username, link, vkId);

        String jwt_access_token = jwtService.generateTokenWithId(String.valueOf(vkId));
        String mode = "vk";

        return defaultClientUrl + "/auth/vk/success?access_token=" + jwt_access_token + "&mode=" + mode;
    }

    private String getVkAccessToken(String code) {
        String url = "https://oauth.vk.com/access_token?client_id=" + vkClientApiKey +
                "&client_secret=" + vkClientSecret +
                "&redirect_uri=" + defaultApiUrl + "/v1/auth/vk/callback" +
                "&code=" + code;

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        return (String) response.get("access_token");
    }
    private Map<String, Object> getVkUserInfo(String accessToken) {
        String url = "https://api.vk.com/method/users.get?access_token=" + accessToken +
                "&v=" + vkClientApiVersion;

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        return (
                (java.util.List<Map<String, Object>>) response.get("response")
        ).getFirst();
    }


    private void getOrCreateUser(String username, String link, Long appId) {
        if (userRepository.getUserByAppId(appId).isEmpty()) {
            User user = User.builder()
                    .username(username)
                    .link(link)
                    .appId(appId)
                    .build();
            userRepository.save(user);
        }
    }
}
