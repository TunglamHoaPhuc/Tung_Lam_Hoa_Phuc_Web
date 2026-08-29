<?php
/**
 * Plugin Name: Tùng Lâm - Tùy Biến Giao Diện Nhập Bài Tông Chỉ
 * Plugin URI: https://tunglam.mocwp.com
 * Description: Plugin tùy biến giao diện Admin WordPress thành dạng thẻ Card trực quan: chia sẵn 3 cột Tam Bảo (Phật - Pháp - Tăng), hộp trích dẫn, ảnh bìa và làm gọn Admin.
 * Version: 1.0.0
 * Author: Tùng Lâm Hòa Phúc
 * Text Domain: tunglam-customizer
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * 1. Tự động tạo các ô nhập liệu trực quan (ACF) cho Tông Chỉ
 */
add_action('acf/init', function() {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group(array(
        'key' => 'group_tong_chi_custom_layout',
        'title' => '🌿 BỐ CỤC NỘI DUNG TÔNG CHỈ (TRỰC QUAN)',
        'fields' => array(
            // --- TAB 1: THÔNG TIN CƠ BẢN ---
            array(
                'key' => 'field_tab_overview',
                'label' => '📌 1. Thông Tin Cơ Bản',
                'type' => 'tab',
            ),
            array(
                'key' => 'field_sub_title',
                'label' => 'Tiêu đề phụ / Lời dẫn ngắn',
                'name' => 'sub_title',
                'type' => 'text',
                'placeholder' => 'Ví dụ: Vô Trí - Tâm Hòa',
                'instructions' => 'Hiển thị ngay dưới tiêu đề chính bài viết.',
                'wrapper' => array('width' => '50%'),
            ),
            array(
                'key' => 'field_author_custom',
                'label' => 'Tác giả / Ban biên soạn',
                'name' => 'custom_author',
                'type' => 'text',
                'placeholder' => 'Ví dụ: Tùng Lâm Hòa Phúc',
                'wrapper' => array('width' => '50%'),
            ),
            array(
                'key' => 'field_featured_quote',
                'label' => 'Trích dẫn tâm đắc / Lời Phật dạy (Quote Box)',
                'name' => 'featured_quote',
                'type' => 'textarea',
                'rows' => 3,
                'placeholder' => '“Chất liệu của sự thực tập chánh Pháp là cơ hội để nuôi dưỡng đức tin. Nương tựa vào mảnh đất của Tam bảo...”',
                'instructions' => 'Đoạn trích dẫn nổi bật viền vàng trang nghiêm.',
            ),

            // --- TAB 2: KHỐI 3 CỘT (PHẬT - PHÁP - TĂNG) ---
            array(
                'key' => 'field_tab_three_columns',
                'label' => '🪷 2. Khối 3 Cột Ngang (Tam Bảo: Phật - Pháp - Tăng)',
                'type' => 'tab',
            ),
            // Header 3 cột
            array(
                'key' => 'field_col1_title',
                'label' => 'Cột 1: Tiêu đề',
                'name' => 'col1_title',
                'type' => 'text',
                'default_value' => 'PHẬT',
                'wrapper' => array('width' => '33.33%'),
            ),
            array(
                'key' => 'field_col2_title',
                'label' => 'Cột 2: Tiêu đề',
                'name' => 'col2_title',
                'type' => 'text',
                'default_value' => 'PHÁP',
                'wrapper' => array('width' => '33.33%'),
            ),
            array(
                'key' => 'field_col3_title',
                'label' => 'Cột 3: Tiêu đề',
                'name' => 'col3_title',
                'type' => 'text',
                'default_value' => 'TĂNG',
                'wrapper' => array('width' => '33.33%'),
            ),

            // Ảnh 3 cột
            array(
                'key' => 'field_col1_image',
                'label' => 'Cột 1: Hình ảnh',
                'name' => 'col1_image',
                'type' => 'image',
                'return_format' => 'url',
                'preview_size' => 'medium',
                'wrapper' => array('width' => '33.33%'),
            ),
            array(
                'key' => 'field_col2_image',
                'label' => 'Cột 2: Hình ảnh',
                'name' => 'col2_image',
                'type' => 'image',
                'return_format' => 'url',
                'preview_size' => 'medium',
                'wrapper' => array('width' => '33.33%'),
            ),
            array(
                'key' => 'field_col3_image',
                'label' => 'Cột 3: Hình ảnh',
                'name' => 'col3_image',
                'type' => 'image',
                'return_format' => 'url',
                'preview_size' => 'medium',
                'wrapper' => array('width' => '33.33%'),
            ),

            // Nội dung 3 cột
            array(
                'key' => 'field_col1_desc',
                'label' => 'Cột 1: Nội dung mô tả',
                'name' => 'col1_desc',
                'type' => 'textarea',
                'rows' => 4,
                'placeholder' => 'Những vị Bồ Tát dễ thương, gần gũi cùng chung sống mỗi ngày.',
                'wrapper' => array('width' => '33.33%'),
            ),
            array(
                'key' => 'field_col2_desc',
                'label' => 'Cột 2: Nội dung mô tả',
                'name' => 'col2_desc',
                'type' => 'textarea',
                'rows' => 4,
                'placeholder' => 'Khoảnh khắc có mặt, lời nói sẻ chia dưỡng nuôi hạnh phúc.',
                'wrapper' => array('width' => '33.33%'),
            ),
            array(
                'key' => 'field_col3_desc',
                'label' => 'Cột 3: Nội dung mô tả',
                'name' => 'col3_desc',
                'type' => 'textarea',
                'rows' => 4,
                'placeholder' => 'Sự hòa hợp, lắng nghe và nâng đỡ để bình an được thiết lập và lan tỏa.',
                'wrapper' => array('width' => '33.33%'),
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'tong-chi',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'seamless',
    ));
});

/**
 * 2. Tinh chỉnh CSS Admin: Làm đẹp giao diện, ẩn hộp rác
 */
add_action('admin_head', function() {
    $screen = get_current_screen();
    if ($screen && $screen->post_type === 'tong-chi') {
        ?>
        <style>
            /* Ẩn các hộp không cần thiết như Trackbacks, Custom fields */
            #trackbacksdiv, #postcustom, #slugdiv, #authordiv, #commentstatusdiv, #commentsdiv {
                display: none !important;
            }
            
            /* Giao diện khung bài viết */
            #poststuff {
                padding-top: 10px;
            }
            #titlediv #title {
                border-radius: 10px !important;
                border: 2px solid #e2e8f0 !important;
                font-size: 18px !important;
                font-weight: 700 !important;
                padding: 10px 14px !important;
                box-shadow: 0 2px 6px rgba(0,0,0,0.04) !important;
            }
            #titlediv #title:focus {
                border-color: #2563eb !important;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
            }

            /* Khung ACF */
            .acf-field-group, .postbox {
                border-radius: 12px !important;
                border: 1px solid #e2e8f0 !important;
                box-shadow: 0 4px 15px rgba(0,0,0,0.04) !important;
                overflow: hidden !important;
                margin-top: 20px !important;
            }
            .postbox-header {
                background: linear-gradient(135deg, #1e293b, #334155) !important;
                color: #fff !important;
            }
            .postbox-header h2 {
                color: #f8fafc !important;
                font-weight: 600 !important;
                letter-spacing: 0.5px;
            }
            
            /* Tab điều hướng ACF */
            .acf-tab-group {
                background: #f8fafc !important;
                border-bottom: 2px solid #e2e8f0 !important;
                padding: 8px 12px 0 12px !important;
            }
            .acf-tab-group li a {
                border-radius: 8px 8px 0 0 !important;
                font-weight: 600 !important;
                font-size: 13px !important;
                padding: 10px 20px !important;
                background: #e2e8f0 !important;
                color: #475569 !important;
                border: none !important;
                margin-right: 6px !important;
                transition: all 0.2s ease;
            }
            .acf-tab-group li.active a {
                background: #ffffff !important;
                color: #0284c7 !important;
                border-top: 3px solid #0284c7 !important;
                box-shadow: 0 -2px 8px rgba(0,0,0,0.05) !important;
            }

            /* Nhãn & input */
            .acf-label label {
                font-size: 13px !important;
                font-weight: 700 !important;
                color: #0f172a !important;
                margin-bottom: 6px !important;
            }
            .acf-input input[type="text"], 
            .acf-input textarea,
            .acf-input select {
                border-radius: 8px !important;
                border: 1px solid #cbd5e1 !important;
                padding: 8px 12px !important;
                font-size: 13px !important;
                background: #ffffff !important;
            }
            .acf-input input[type="text"]:focus, 
            .acf-input textarea:focus {
                border-color: #0284c7 !important;
                box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15) !important;
                outline: none !important;
            }

            /* Khối 3 cột viền đẹp */
            .acf-field[data-name="col1_title"],
            .acf-field[data-name="col2_title"],
            .acf-field[data-name="col3_title"] {
                border-top: 2px solid #e2e8f0 !important;
                padding-top: 15px !important;
                background: #f8fafc;
            }
            .acf-field[data-name="col1_image"],
            .acf-field[data-name="col2_image"],
            .acf-field[data-name="col3_image"] {
                background: #f8fafc;
            }
            .acf-field[data-name="col1_desc"],
            .acf-field[data-name="col2_desc"],
            .acf-field[data-name="col3_desc"] {
                background: #f8fafc;
                border-bottom: 2px solid #e2e8f0 !important;
                padding-bottom: 20px !important;
            }
        </style>
        <?php
    }
});
