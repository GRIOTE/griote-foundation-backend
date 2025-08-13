package Griote.service_depot_doc.service.impl;

import Griote.service_depot_doc.dto.DepotDto;
import Griote.service_depot_doc.mapper.DepotMapper;
import Griote.service_depot_doc.model.Depot;
import Griote.service_depot_doc.repository.DepotRepository;
import Griote.service_depot_doc.service.DepotService;
import Griote.service_depot_doc.filestorage.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DepotServiceImpl implements DepotService {
    private final DepotRepository depotRepository;
    private final FileStorageService fileStorageService;

    @Autowired
    public DepotServiceImpl(DepotRepository depotRepository, FileStorageService fileStorageService) {
        this.depotRepository = depotRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public DepotDto createDepot(DepotDto depotDto, MultipartFile file) {
        if (file == null) {
            throw new IllegalArgumentException("File must not be null");
        }
        try {
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            fileStorageService.storeFile(file, filename);
            Depot depot = DepotMapper.toEntity(depotDto);
            depot.setCreatedAt(java.time.LocalDateTime.now());
            depot.setUpdatedAt(java.time.LocalDateTime.now());
            depot.setFileName(filename);
            depot = depotRepository.save(depot);
            return DepotMapper.toDto(depot);
        } catch (Exception e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    @Override
    public Optional<DepotDto> getDepot(Long id) {
        return depotRepository.findById(id).map(DepotMapper::toDto);
    }

    @Override
    public Page<DepotDto> searchDepots(String keyword, String theme, String institution, String date, Pageable pageable) {
        // TODO: implement advanced search
        Page<Depot> page = depotRepository.findAll(pageable);
        return new PageImpl<>(
            page.getContent().stream().map(DepotMapper::toDto).collect(Collectors.toList()),
            pageable,
            page.getTotalElements()
        );
    }

    @Override
    public byte[] downloadResource(Long id) {
        Depot depot = depotRepository.findById(id).orElseThrow();
        String filename = depot.getFileName();
        if (filename == null) throw new RuntimeException("No file found for this depot");
        try {
            return fileStorageService.loadFile(filename);
        } catch (Exception e) {
            throw new RuntimeException("File download failed: " + e.getMessage());
        }
    }
}
