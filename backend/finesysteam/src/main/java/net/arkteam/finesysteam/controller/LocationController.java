package net.arkteam.finesysteam.controller;

import net.arkteam.finesysteam.entity.Location;
import net.arkteam.finesysteam.service.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @PostMapping
    public ResponseEntity<Location> createLocation(@RequestBody Location location) {
        Location created = locationService.createLocation(location);
        return ResponseEntity.created(URI.create("/locations/" + created.getId())).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocationById(@PathVariable String id) {
        Optional<Location> location = locationService.getLocationById(id);
        return location.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Location>> getAllLocations(
            @RequestParam(required = false) String stockName,
            @RequestParam(required = false) String locationName) {

        List<Location> locations;
        if (stockName != null) {
            locations = locationService.getLocationsByStockName(stockName);
        } else if (locationName != null) {
            locations = locationService.getLocationsByLocation(locationName);
        } else {
            locations = locationService.getAllLocations();
        }
        return ResponseEntity.ok(locations);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Location> updateLocation(@PathVariable String id, @RequestBody Location location) {
        location.setId(id);
        Location updated = locationService.updateLocation(location);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable String id) {
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }
}
