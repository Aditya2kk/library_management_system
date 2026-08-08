package com.library.librarymanagement.service;

import com.library.librarymanagement.dto.MemberRequest;
import com.library.librarymanagement.dto.MemberResponse;
import java.util.List;

public interface MemberService {
    MemberResponse addMember(MemberRequest request);
    List<MemberResponse> getAllMembers();
    MemberResponse updateMember(Long id, MemberRequest request);
    void deleteMember(Long id);
}
