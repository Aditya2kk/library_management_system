package com.library.librarymanagement.service.impl;

import com.library.librarymanagement.dto.BorrowRequest;
import com.library.librarymanagement.dto.BorrowResponse;
import com.library.librarymanagement.entity.Book;
import com.library.librarymanagement.entity.BorrowRecord;
import com.library.librarymanagement.entity.Member;
import com.library.librarymanagement.exception.BookNotFoundException;
import com.library.librarymanagement.exception.BookNotAvailableException;
import com.library.librarymanagement.exception.MemberNotFoundException;
import com.library.librarymanagement.repository.BookRepository;
import com.library.librarymanagement.repository.BorrowRecordRepository;
import com.library.librarymanagement.repository.MemberRepository;
import com.library.librarymanagement.service.BorrowService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BorrowServiceImpl implements BorrowService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;

    public BorrowServiceImpl(BorrowRecordRepository borrowRecordRepository,
                              BookRepository bookRepository,
                              MemberRepository memberRepository) {
        this.borrowRecordRepository = borrowRecordRepository;
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
    }

    @Override
    @Transactional
    public BorrowResponse borrowBook(BorrowRequest request) {
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new MemberNotFoundException(
                        "Member not found with id: " + request.getMemberId()));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new BookNotFoundException(
                        "Book not found with id: " + request.getBookId()));

        if (book.getAvailableCopies() <= 0) {
            throw new BookNotAvailableException(
                    "No available copies for book: " + book.getTitle());
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        BorrowRecord record = BorrowRecord.builder()
                .member(member)
                .book(book)
                .issueDate(LocalDate.now())
                .build();

        return BorrowResponse.from(borrowRecordRepository.save(record));
    }

    @Override
    @Transactional
    public BorrowResponse returnBook(Long borrowRecordId) {
        BorrowRecord record = borrowRecordRepository.findById(borrowRecordId)
                .orElseThrow(() -> new RuntimeException(
                        "Borrow record not found with id: " + borrowRecordId));

        record.setReturnDate(LocalDate.now());

        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return BorrowResponse.from(borrowRecordRepository.save(record));
    }

    @Override
    public List<BorrowResponse> getActiveBorrows() {
        return borrowRecordRepository.findByReturnDateIsNull()
                .stream()
                .map(BorrowResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<BorrowResponse> getMemberHistory(Long memberId) {
        return borrowRecordRepository.findByMemberId(memberId)
                .stream()
                .map(BorrowResponse::from)
                .collect(Collectors.toList());
    }
}
