package com.library.librarymanagement.dto;

import com.library.librarymanagement.entity.BorrowRecord;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BorrowResponse {

    private Long id;
    private Long memberId;
    private String memberName;
    private Long bookId;
    private String bookTitle;
    private LocalDate issueDate;
    private LocalDate returnDate;

    public static BorrowResponse from(BorrowRecord record) {
        BorrowResponse resp = new BorrowResponse();
        resp.setId(record.getId());
        resp.setMemberId(record.getMember().getId());
        resp.setMemberName(record.getMember().getName());
        resp.setBookId(record.getBook().getId());
        resp.setBookTitle(record.getBook().getTitle());
        resp.setIssueDate(record.getIssueDate());
        resp.setReturnDate(record.getReturnDate());
        return resp;
    }
}
