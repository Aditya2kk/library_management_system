package com.library.librarymanagement.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BookRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String author;
    private String category;

    @Min(value = 0, message = "Available copies must be 0 or more")
    private int availableCopies;
}
