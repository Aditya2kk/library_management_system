package com.library.librarymanagement.service;

import com.library.librarymanagement.dto.BorrowRequest;
import com.library.librarymanagement.dto.BorrowResponse;
import com.library.librarymanagement.entity.Book;
import com.library.librarymanagement.entity.BorrowRecord;
import com.library.librarymanagement.entity.Member;
import com.library.librarymanagement.exception.BookNotAvailableException;
import com.library.librarymanagement.repository.BookRepository;
import com.library.librarymanagement.repository.BorrowRecordRepository;
import com.library.librarymanagement.repository.MemberRepository;
import com.library.librarymanagement.service.impl.BorrowServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BorrowServiceTest {

    @Mock private BorrowRecordRepository borrowRecordRepository;
    @Mock private BookRepository bookRepository;
    @Mock private MemberRepository memberRepository;

    private BorrowService borrowService;

    private Member member;
    private Book book;

    @BeforeEach
    void setUp() {
        borrowService = new BorrowServiceImpl(borrowRecordRepository, bookRepository, memberRepository);
        member = Member.builder().id(1L).name("Alice").email("alice@test.com").phone("1234567890").build();
        book = Book.builder().id(1L).title("Test Book").author("Author").availableCopies(3).build();
    }

    @Test
    void borrowBook_whenNoCopiesAvailable_shouldThrowBookNotAvailableException() {
        book.setAvailableCopies(0);
        BorrowRequest request = new BorrowRequest();
        request.setMemberId(1L);
        request.setBookId(1L);

        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        assertThatThrownBy(() -> borrowService.borrowBook(request))
                .isInstanceOf(BookNotAvailableException.class);
    }

    @Test
    void borrowBook_shouldDecrementAvailableCopiesAndSaveRecord() {
        BorrowRequest request = new BorrowRequest();
        request.setMemberId(1L);
        request.setBookId(1L);

        BorrowRecord saved = BorrowRecord.builder()
                .id(1L).member(member).book(book).issueDate(LocalDate.now()).build();

        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(borrowRecordRepository.save(any())).thenReturn(saved);

        borrowService.borrowBook(request);

        ArgumentCaptor<Book> bookCaptor = ArgumentCaptor.forClass(Book.class);
        verify(bookRepository).save(bookCaptor.capture());
        assertThat(bookCaptor.getValue().getAvailableCopies()).isEqualTo(2);
    }

    @Test
    void returnBook_shouldSetReturnDateAndIncrementCopies() {
        BorrowRecord record = BorrowRecord.builder()
                .id(1L).member(member).book(book).issueDate(LocalDate.now().minusDays(5)).build();

        when(borrowRecordRepository.findById(1L)).thenReturn(Optional.of(record));
        when(borrowRecordRepository.save(any())).thenReturn(record);

        borrowService.returnBook(1L);

        ArgumentCaptor<Book> bookCaptor = ArgumentCaptor.forClass(Book.class);
        verify(bookRepository).save(bookCaptor.capture());
        assertThat(bookCaptor.getValue().getAvailableCopies()).isEqualTo(4);
        assertThat(record.getReturnDate()).isNotNull();
    }
}
