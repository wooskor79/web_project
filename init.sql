CREATE DATABASE IF NOT EXISTS dashboard;
USE dashboard;

-- 글로벌 테마 테이블 (기존 동일)
CREATE TABLE IF NOT EXISTS global_theme (
    id INT AUTO_INCREMENT PRIMARY KEY,
    theme_type ENUM('preset', 'custom') DEFAULT 'preset',
    preset_name VARCHAR(50) DEFAULT 'Midnight Blue',
    custom_primary_bg VARCHAR(20),
    custom_surface_color VARCHAR(20),
    custom_text_color VARCHAR(20),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 초기 테마 설정 시드
INSERT IGNORE INTO global_theme (id, theme_type, preset_name) VALUES (1, 'preset', 'Midnight Blue');

-- [NEW] 블록 기반 페이지 테이블
CREATE TABLE IF NOT EXISTS page_blocks (
    id VARCHAR(50) PRIMARY KEY,
    block_type VARCHAR(20) NOT NULL,
    content_data JSON,
    layout_i VARCHAR(50),
    layout_x INT,
    layout_y INT,
    layout_w INT,
    layout_h INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
