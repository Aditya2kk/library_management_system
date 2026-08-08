package com.library.librarymanagement.dto;

import com.library.librarymanagement.entity.Book;
import lombok.Data;

@Data
public class BookResponse {

    private Long id;
    private String title;
    private String author;
    private String category;
    private int availableCopies;

    public static BookResponse from(Book book) {
        BookResponse resp = new BookResponse();
        resp.setId(book.getId());
        resp.setTitle(book.getTitle());
        resp.setAuthor(book.getAuthor());
        resp.setCategory(book.getCategory());
        resp.setAvailableCopies(book.getAvailableCopies());
        return resp;
    }
}
