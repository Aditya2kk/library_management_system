package com.library.librarymanagement.service;

import com.library.librarymanagement.dto.BookRequest;
import com.library.librarymanagement.dto.BookResponse;
import com.library.librarymanagement.entity.Book;
import com.library.librarymanagement.exception.BookNotFoundException;
import com.library.librarymanagement.repository.BookRepository;
import com.library.librarymanagement.service.impl.BookServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookServiceImpl bookService;

    private Book book;
    private BookRequest bookRequest;

    @BeforeEach
    void setUp() {
        book = Book.builder()
                .id(1L)
                .title("Clean Code")
                .author("Robert Martin")
                .category("Programming")
                .availableCopies(5)
                .build();

        bookRequest = new BookRequest();
        bookRequest.setTitle("Clean Code");
        bookRequest.setAuthor("Robert Martin");
        bookRequest.setCategory("Programming");
        bookRequest.setAvailableCopies(5);
    }

    @Test
    void addBook_shouldSaveAndReturnBookResponse() {
        when(bookRepository.save(any(Book.class))).thenReturn(book);

        BookResponse response = bookService.addBook(bookRequest);

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("Clean Code");
        assertThat(response.getAuthor()).isEqualTo("Robert Martin");
        assertThat(response.getCategory()).isEqualTo("Programming");
        assertThat(response.getAvailableCopies()).isEqualTo(5);
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    void getAllBooks_shouldReturnPageOfBookResponses() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Book> bookPage = new PageImpl<>(List.of(book));
        when(bookRepository.findAll(pageable)).thenReturn(bookPage);

        Page<BookResponse> result = bookService.getAllBooks(pageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Clean Code");
    }

    @Test
    void getBookById_shouldReturnBookResponse_whenFound() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        BookResponse response = bookService.getBookById(1L);

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("Clean Code");
    }

    @Test
    void getBookById_shouldThrowBookNotFoundException_whenNotFound() {
        when(bookRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookService.getBookById(99L))
                .isInstanceOf(BookNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void updateBook_shouldUpdateAndReturnBookResponse() {
        BookRequest updateRequest = new BookRequest();
        updateRequest.setTitle("Refactoring");
        updateRequest.setAuthor("Martin Fowler");
        updateRequest.setCategory("Programming");
        updateRequest.setAvailableCopies(3);

        Book updatedBook = Book.builder()
                .id(1L)
                .title("Refactoring")
                .author("Martin Fowler")
                .category("Programming")
                .availableCopies(3)
                .build();

        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(bookRepository.save(any(Book.class))).thenReturn(updatedBook);

        BookResponse response = bookService.updateBook(1L, updateRequest);

        assertThat(response.getTitle()).isEqualTo("Refactoring");
        assertThat(response.getAuthor()).isEqualTo("Martin Fowler");
        assertThat(response.getAvailableCopies()).isEqualTo(3);
    }

    @Test
    void updateBook_shouldThrowBookNotFoundException_whenNotFound() {
        when(bookRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookService.updateBook(99L, bookRequest))
                .isInstanceOf(BookNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void deleteBook_shouldDeleteBook_whenFound() {
        when(bookRepository.existsById(1L)).thenReturn(true);

        bookService.deleteBook(1L);

        verify(bookRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteBook_shouldThrowBookNotFoundException_whenNotFound() {
        when(bookRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> bookService.deleteBook(99L))
                .isInstanceOf(BookNotFoundException.class)
                .hasMessageContaining("99");

        verify(bookRepository, never()).deleteById(any());
    }

    @Test
    void searchByAuthor_shouldReturnMatchingBooks() {
        when(bookRepository.findByAuthorContainingIgnoreCase("martin")).thenReturn(List.of(book));

        List<BookResponse> result = bookService.searchByAuthor("martin");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAuthor()).isEqualTo("Robert Martin");
    }

    @Test
    void searchByAuthor_shouldReturnEmptyList_whenNoMatch() {
        when(bookRepository.findByAuthorContainingIgnoreCase("unknown")).thenReturn(List.of());

        List<BookResponse> result = bookService.searchByAuthor("unknown");

        assertThat(result).isEmpty();
    }
}
