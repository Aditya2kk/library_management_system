package com.library.librarymanagement.service;

import com.library.librarymanagement.dto.BorrowRequest;
import com.library.librarymanagement.dto.BorrowResponse;
import java.util.List;

public interface BorrowService {
    BorrowResponse borrowBook(BorrowRequest request);
    BorrowResponse returnBook(Long borrowRecordId);
    List<BorrowResponse> getActiveBorrows();
    List<BorrowResponse> getMemberHistory(Long memberId);
}
