package Griote.service_depot_doc.repository;

import Griote.service_depot_doc.model.Depot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepotRepository extends JpaRepository<Depot, Long> {
    List<Depot> findByTitleContainingIgnoreCase(String title);
    // Add other search methods as needed
}
