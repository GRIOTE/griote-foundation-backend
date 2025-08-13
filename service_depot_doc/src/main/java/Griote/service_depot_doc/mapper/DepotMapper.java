package Griote.service_depot_doc.mapper;

import Griote.service_depot_doc.model.Depot;
import Griote.service_depot_doc.dto.DepotDto;

public class DepotMapper {
    public static DepotDto toDto(Depot depot) {
        if (depot == null) return null;
        DepotDto dto = new DepotDto();
        dto.setId(depot.getId());
        dto.setTitle(depot.getTitle());
        dto.setDescription(depot.getDescription());
        dto.setDepositDate(depot.getDepositDate());
        dto.setCreatedAt(depot.getCreatedAt());
        dto.setUpdatedAt(depot.getUpdatedAt());
        dto.setVisibility(depot.getVisibility());
        dto.setKeywords(depot.getKeywords());
    // On mappe directement userId
    dto.setUserId(depot.getUserId());
        dto.setFileName(depot.getFileName());
        return dto;
    }

    public static Depot toEntity(DepotDto dto) {
        if (dto == null) return null;
        Depot depot = new Depot();
        depot.setId(dto.getId());
        depot.setTitle(dto.getTitle());
        depot.setDescription(dto.getDescription());
        depot.setDepositDate(dto.getDepositDate());
        depot.setCreatedAt(dto.getCreatedAt());
        depot.setUpdatedAt(dto.getUpdatedAt());
        depot.setVisibility(dto.getVisibility());
        depot.setKeywords(dto.getKeywords());
    // On mappe directement userId
    depot.setUserId(dto.getUserId());
        depot.setFileName(dto.getFileName());
        return depot;
    }
}
