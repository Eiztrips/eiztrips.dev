package dev.eiztrips.main.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

    private final JwtService jwtService;
    private final UserService userService;
    private final RedisService redisService;
    private final KafkaProducerService kafkaProducerService;

    @Value("${default.client.url}")
    private String defaultClientUrl;

    @KafkaListener(topics = "telegram-bot", groupId = "main-service-consumer-group")
    public void consume(Map<String, Object> message) {
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
        String link = "https://t.me/" + username;

        userService.getOrCreateUser(
                username,
                link,
                Long.parseLong(userId),
                userDataMap
        );

        String jwt = jwtService.generateTokenWithAppId(userId);

        String botMessage= "Успешная аутентификация!\n\n" +
                "Ваш аккаунт @" + username + " был успешно привязан к нашему сервису.\n\n" +
                "Перейдите по ссылке: "
                + defaultClientUrl
                + "/auth/success?token=" + jwt
                + "&mode=tg"
                + "&username=" + username
                + " чтобы продолжить.";

        redisService.removeState(state);

        kafkaProducerService.sendMessage("telegram-bot-response", Map.of(
                "chat_id", userId,
                "message", botMessage
        ));
    }
}