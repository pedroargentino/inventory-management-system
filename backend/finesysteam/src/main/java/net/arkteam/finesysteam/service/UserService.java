package net.arkteam.finesysteam.service;

import net.arkteam.finesysteam.entity.LogEntry;
import net.arkteam.finesysteam.entity.User;
import net.arkteam.finesysteam.repository.LogEntryRepository;
import net.arkteam.finesysteam.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final LogEntryRepository logEntryRepository;

    public UserService(UserRepository userRepository, LogEntryRepository logEntryRepository) {
        this.userRepository = userRepository;
        this.logEntryRepository = logEntryRepository;
    }

    public User createUser(User user) {
        User created = userRepository.save(user);
        log("CREATE_USER", "User", created.getId(), created.getEmail(), "Usuário criado");
        return created;
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
        log("DELETE_USER", "User", id, null, "Usuário deletado");
    }

    public Optional<User> login(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user;  // Retorna o usuário caso a senha seja válida
        }
        return Optional.empty();  // Retorna vazio caso a senha seja inválida
    }


    private void log(String action, String entity, String entityId, String performedBy, String details) {
        LogEntry log = new LogEntry();
        log.setAction(action);
        log.setEntityName(entity);
        log.setEntityId(entityId);
        log.setPerformedBy(performedBy);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());
        logEntryRepository.save(log);
    }
}
