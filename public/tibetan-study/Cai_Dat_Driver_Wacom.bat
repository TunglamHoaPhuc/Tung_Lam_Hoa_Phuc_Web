@echo off
chcp 65001 > nul
title CAI DAT DRIVER & WACOM CENTER CHO WACOM INTUOS M
echo ======================================================================
echo    CÀI ĐẶT TRÌNH ĐIỀU KHIỂN & PHẦN MỀM WACOM CENTER CHO INTUOS M
echo ======================================================================
echo.
echo Đang tải và cài đặt Driver chính hãng Wacom Tablet Driver mới nhất...
echo Quá trình này hoàn toàn tự động từ máy chủ Wacom.
echo.

winget install --id Wacom.WacomTabletDriver --accept-package-agreements --accept-source-agreements

echo.
echo ======================================================================
echo  CÀI ĐẶT HOÀN TẤT!
echo  Bạn hãy mở 'Wacom Center' trong Start Menu để xem các phím tắt ExpressKeys.
echo ======================================================================
echo.
pause
