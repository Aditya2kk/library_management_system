package com.library.librarymanagement.dto;

import lombok.Data;

@Data
public class BorrowRequest {
    private Long memberId;
    private Long bookId;
}
