package net.arkteam.finesysteam.repository;

import net.arkteam.finesysteam.entity.LogEntry;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LogEntryRepository extends MongoRepository<LogEntry, String> {
}
