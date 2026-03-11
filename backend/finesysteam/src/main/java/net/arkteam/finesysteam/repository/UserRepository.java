package net.arkteam.finesysteam.repository;


import net.arkteam.finesysteam.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}
