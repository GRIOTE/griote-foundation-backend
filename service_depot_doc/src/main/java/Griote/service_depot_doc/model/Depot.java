package Griote.service_depot_doc.model;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Depot")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Depot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_depot_Depot")
    private Long id;

    @Column(name = "title_Depot")
    private String title;

    @Column(name = "description_Depot")
    private String description;

    @Column(name = "deposit_date_depot")
    private LocalDate depositDate;

    @Column(name = "created_at_depot")
    private LocalDateTime createdAt;

    @Column(name = "updated_at_depot")
    private LocalDateTime updatedAt;

    @Column(name = "visibility", length = 20)
    private String visibility = "private";

    @Column(name = "keywords", columnDefinition = "TEXT")
    private String keywords;


    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "file_name")
    private String fileName;
}