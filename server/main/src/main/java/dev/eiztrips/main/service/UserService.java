package dev.eiztrips.main.service;

import dev.eiztrips.main.model.User;
import dev.eiztrips.main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public void getOrCreateUser(String username, String link, Long appId, Map<String, String> userData) {
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
