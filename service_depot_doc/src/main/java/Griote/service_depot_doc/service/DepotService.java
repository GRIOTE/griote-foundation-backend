package Griote.service_depot_doc.service;

import Griote.service_depot_doc.dto.DepotDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface DepotService {
    DepotDto createDepot(DepotDto depotDto, MultipartFile file);
    Optional<DepotDto> getDepot(Long id);
    Page<DepotDto> searchDepots(String keyword, String theme, String institution, String date, Pageable pageable);
    byte[] downloadResource(Long id);
}
