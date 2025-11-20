package com.tradecraft.security;

import com.tradecraft.entity.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * 自定义用户主体
 * 扩展UserDetails以包含用户ID和其他自定义信息
 */
@Getter
@RequiredArgsConstructor
public class CustomUserPrincipal implements UserDetails {

    private final User user;

    /**
     * 获取用户ID
     */
    public Long getId() {
        return user.getId();
    }

    /**
     * 获取用户email
     */
    public String getEmail() {
        return user.getEmail();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.isActive();
    }

    /**
     * 获取用户全名
     */
    public String getFullName() {
        return user.getFullName();
    }

    /**
     * 检查是否为管理员
     */
    public boolean isAdmin() {
        return user.isAdmin();
    }
}
