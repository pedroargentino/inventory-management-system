package net.arkteam.finesysteam.controller;

import net.arkteam.finesysteam.entity.LogEntry;
import net.arkteam.finesysteam.service.LogEntryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/logs")
public class LogEntryController {

    private final LogEntryService logEntryService;

    public LogEntryController(LogEntryService logEntryService) {
        this.logEntryService = logEntryService;
    }

    @GetMapping
    public List<LogEntry> getAllLogs() {
        return logEntryService.getAllLogs();
    }

    @GetMapping("/{id}")
    public Optional<LogEntry> getLogById(@PathVariable String id) {
        return logEntryService.getLogById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteLog(@PathVariable String id) {
        logEntryService.deleteLog(id);
    }

    @DeleteMapping
    public void deleteAllLogs() {
        logEntryService.deleteAllLogs();
    }
}
