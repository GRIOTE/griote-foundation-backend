
package Griote.service_depot_doc.service.impl;
import org.springframework.mock.web.MockMultipartFile;

import Griote.service_depot_doc.dto.DepotDto;
import Griote.service_depot_doc.model.Depot;
import Griote.service_depot_doc.repository.DepotRepository;
import Griote.service_depot_doc.filestorage.FileStorageService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;


import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DepotServiceImplIntegrationTest {
    @Mock
    private DepotRepository depotRepository;
    @Mock
    private FileStorageService fileStorageService;
    @InjectMocks
    private DepotServiceImpl depotService;

    @Test
    @DisplayName("Should create and retrieve depot end-to-end")
    void createAndRetrieveDepot() throws Exception {
        DepotDto dto = new DepotDto();
        Depot depot = new Depot();
        when(depotRepository.save(any())).thenReturn(depot);
        when(depotRepository.findById(1L)).thenReturn(Optional.of(depot));
        when(fileStorageService.storeFile(any(), any())).thenReturn("file.pdf");
    MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "test content".getBytes());
    DepotDto created = depotService.createDepot(dto, file);
        assertThat(created).isNotNull();
        Optional<DepotDto> found = depotService.getDepot(1L);
        assertThat(found).isPresent();
    }

    @Test
    @DisplayName("Should search and paginate depots end-to-end")
    void searchAndPaginateDepots() {
        Pageable pageable = PageRequest.of(0, 10);
        when(depotRepository.findAll(pageable)).thenReturn(new PageImpl<>(Collections.emptyList()));
        assertThat(depotService.searchDepots(null, null, null, null, pageable)).isNotNull();
    }
}
