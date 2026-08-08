package com.library.librarymanagement.repository;

import com.library.librarymanagement.entity.BorrowRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    List<BorrowRecord> findByReturnDateIsNull();
    List<BorrowRecord> findByMemberId(Long memberId);
}
