package com.library.librarymanagement.controller;

import com.library.librarymanagement.dto.BorrowRequest;
import com.library.librarymanagement.dto.BorrowResponse;
import com.library.librarymanagement.service.BorrowService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow")
public class BorrowController {

    private final BorrowService borrowService;

    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }

    @PostMapping
    public ResponseEntity<BorrowResponse> borrowBook(@RequestBody BorrowRequest request) {
        return new ResponseEntity<>(borrowService.borrowBook(request), HttpStatus.CREATED);
    }

    @PutMapping("/return/{id}")
    public ResponseEntity<BorrowResponse> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(borrowService.returnBook(id));
    }

    @GetMapping("/active")
    public ResponseEntity<List<BorrowResponse>> getActiveBorrows() {
        return ResponseEntity.ok(borrowService.getActiveBorrows());
    }

    @GetMapping("/history/{memberId}")
    public ResponseEntity<List<BorrowResponse>> getMemberHistory(@PathVariable Long memberId) {
        return ResponseEntity.ok(borrowService.getMemberHistory(memberId));
    }
}
