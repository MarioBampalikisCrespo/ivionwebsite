package com.ivion.main.dto;

import com.ivion.main.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserDTO {

    private Integer id;
    private String username;
    private String userSurnames;
    private String email;

    public static UserDTO from(User u) {
        return new UserDTO(u.getId(), u.getUsername(), u.getUserSurnames(), u.getEmail());
    }
}
