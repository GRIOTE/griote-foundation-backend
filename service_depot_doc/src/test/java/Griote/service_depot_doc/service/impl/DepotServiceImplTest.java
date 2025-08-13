
package Griote.service_depot_doc.service.impl;
import org.springframework.mock.web.MockMultipartFile;

import Griote.service_depot_doc.dto.DepotDto;
import Griote.service_depot_doc.model.Depot;
import Griote.service_depot_doc.repository.DepotRepository;
import Griote.service_depot_doc.filestorage.FileStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;


import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class DepotServiceImplTest {
    @Mock
    private DepotRepository depotRepository;
    @Mock
    private FileStorageService fileStorageService;
    @InjectMocks
    private DepotServiceImpl depotService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should create depot and store file")
    void createDepot() throws Exception {
        DepotDto dto = new DepotDto();
        Depot depot = new Depot();
        when(depotRepository.save(any())).thenReturn(depot);
        when(fileStorageService.storeFile(any(), any())).thenReturn("file.pdf");
    MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "test content".getBytes());
    DepotDto result = depotService.createDepot(dto, file);
        assertThat(result).isNotNull();
    }

    @Test
    @DisplayName("Should get depot by id")
    void getDepot() {
        Depot depot = new Depot();
        when(depotRepository.findById(1L)).thenReturn(Optional.of(depot));
        Optional<DepotDto> result = depotService.getDepot(1L);
        assertThat(result).isPresent();
    }

    @Test
    @DisplayName("Should search depots")
    void searchDepots() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Depot> page = new PageImpl<>(Collections.emptyList());
        when(depotRepository.findAll(pageable)).thenReturn(page);
        Page<DepotDto> result = depotService.searchDepots(null, null, null, null, pageable);
        assertThat(result).isNotNull();
    }
}
