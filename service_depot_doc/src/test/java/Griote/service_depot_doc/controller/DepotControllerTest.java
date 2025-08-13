package Griote.service_depot_doc.controller;

import Griote.service_depot_doc.dto.DepotDto;
import Griote.service_depot_doc.service.DepotService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DepotControllerTest {
    @Mock
    private DepotService depotService;

    @InjectMocks
    private DepotController depotController;

    // Plus besoin de constructeur, l'extension Mockito gère l'initialisation

    @Test
    @DisplayName("Should create depot successfully")
    void createDepot() {
        DepotDto dto = new DepotDto();
        MultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "test content".getBytes());
        when(depotService.createDepot(any(), any())).thenReturn(dto);
        DepotDto depotDto = new DepotDto();
        ResponseEntity<DepotDto> response = depotController.createDepot(depotDto, file);
        assertThat(response.getStatusCode().value()).isEqualTo(201);
    }

    @Test
    @DisplayName("Should return 200 when depot exists, 404 when not found")
    void getDepot() {
        DepotDto dto = new DepotDto();
        // Cas où le dépôt existe
        when(depotService.getDepot(1L)).thenReturn(Optional.of(dto));
        ResponseEntity<DepotDto> response = depotController.getDepot(1L);
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        // Cas où le dépôt n'existe pas
        when(depotService.getDepot(2L)).thenReturn(Optional.empty());
        ResponseEntity<DepotDto> response404 = depotController.getDepot(2L);
        assertThat(response404.getStatusCode().value()).isEqualTo(404);
    }

    @Test
    @DisplayName("Should search depots")
    void searchDepots() {
        Pageable pageable = PageRequest.of(0, 10);
        when(depotService.searchDepots(any(), any(), any(), any(), any()))
                .thenReturn(new PageImpl<>(Collections.emptyList()));
        assertThat(depotController.searchDepots(null, null, null, null, pageable)).isNotNull();
    }
}
