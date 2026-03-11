package net.arkteam.finesysteam.service;

import net.arkteam.finesysteam.entity.LogEntry;
import net.arkteam.finesysteam.repository.LogEntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LogEntryService {

    private final LogEntryRepository logEntryRepository;

    public LogEntryService(LogEntryRepository logEntryRepository) {
        this.logEntryRepository = logEntryRepository;
    }

    public LogEntry createLog(String action, String entityName, String entityId, String performedBy, String details) {
        LogEntry log = new LogEntry();
        log.setAction(action);
        log.setEntityName(entityName);
        log.setEntityId(entityId);
        log.setPerformedBy(performedBy);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());
        return logEntryRepository.save(log);
    }

    public List<LogEntry> getAllLogs() {
        return logEntryRepository.findAll();
    }

    public Optional<LogEntry> getLogById(String id) {
        return logEntryRepository.findById(id);
    }

    public void deleteLog(String id) {
        logEntryRepository.deleteById(id);
    }

    public void deleteAllLogs() {
        logEntryRepository.deleteAll();
    }
}
