package Griote.service_depot_doc.controller;


import Griote.service_depot_doc.dto.DepotDto;
import Griote.service_depot_doc.service.DepotService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/projects")
public class DepotController {
    private final DepotService depotService;

    @Autowired
    public DepotController(DepotService depotService) {
        this.depotService = depotService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<DepotDto> createDepot(@RequestPart("depot") DepotDto depotDto,
                                                @RequestPart("file") MultipartFile file) {
        DepotDto created = depotService.createDepot(depotDto, file);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepotDto> getDepot(@PathVariable Long id) {
        return depotService.getDepot(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<DepotDto>> searchDepots(@RequestParam(required = false) String keyword,
                                                      @RequestParam(required = false) String theme,
                                                      @RequestParam(required = false) String institution,
                                                      @RequestParam(required = false) String date,
                                                      Pageable pageable) {
        Page<DepotDto> page = depotService.searchDepots(keyword, theme, institution, date, pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadResource(@PathVariable Long id) {
        byte[] data = depotService.downloadResource(id);
        // TODO: set headers for file type, etc.
        return ResponseEntity.ok(data);
    }
}
