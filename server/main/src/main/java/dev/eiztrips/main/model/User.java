package dev.eiztrips.main.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Map;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id()
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String username;

    @NotNull
    private String link;

    private Long appId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_data", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyColumn(name = "data_key")
    @Column(name = "data_value", length = 4096)
    private Map<String, String> userData;
}
