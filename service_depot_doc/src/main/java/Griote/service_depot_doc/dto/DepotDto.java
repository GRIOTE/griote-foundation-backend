package Griote.service_depot_doc.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class DepotDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate depositDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String visibility;
    private String keywords;
    private Long userId;
    private String fileName;
}
