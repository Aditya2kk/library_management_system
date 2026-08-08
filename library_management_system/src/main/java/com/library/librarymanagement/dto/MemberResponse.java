package com.library.librarymanagement.dto;

import com.library.librarymanagement.entity.Member;
import lombok.Data;

@Data
public class MemberResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;

    public static MemberResponse from(Member member) {
        MemberResponse resp = new MemberResponse();
        resp.setId(member.getId());
        resp.setName(member.getName());
        resp.setEmail(member.getEmail());
        resp.setPhone(member.getPhone());
        return resp;
    }
}
