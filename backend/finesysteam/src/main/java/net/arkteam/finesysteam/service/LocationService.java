package net.arkteam.finesysteam.service;

import net.arkteam.finesysteam.entity.Location;
import net.arkteam.finesysteam.repository.LocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public Location createLocation(Location location) {
        return locationRepository.save(location);
    }

    public Optional<Location> getLocationById(String id) {
        return locationRepository.findById(id);
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public List<Location> getLocationsByStockName(String stockName) {
        return locationRepository.findByStockName(stockName);
    }

    public List<Location> getLocationsByLocation(String location) {
        return locationRepository.findByLocation(location);
    }

    public Location updateLocation(Location location) {
        return locationRepository.save(location);
    }

    public void deleteLocation(String id) {
        locationRepository.deleteById(id);
    }
}
