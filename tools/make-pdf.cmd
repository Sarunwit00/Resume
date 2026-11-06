@echo off
chcp 65001 >nul
setlocal

rem ============================================================
rem   make-pdf.cmd — สร้างไฟล์ PDF เรซูเม่จาก index.html
rem
rem   สั่ง Chrome ให้เปิด index.html แบบไม่มีหน้าต่าง
rem   แล้วพิมพ์ออกมาเป็นไฟล์ PDF โดยใช้ print.css เป็นตัวจัดหน้า
rem
rem   วิธีใช้: ดับเบิลคลิกไฟล์นี้ หรือสั่งจากเทอร์มินัล
rem            ถ้าสั่งจากเทอร์มินัลให้ใส่ q ต่อท้าย จะไม่หยุดรอให้กดปุ่ม
rem
rem   ต้องต่อเน็ตตอนรัน เพราะฟอนต์ไทย Anuphan โหลดจาก Google Fonts
rem   ไม่ได้เก็บไว้ในโปรเจกต์ ถ้าไม่มีเน็ตจะได้ฟอนต์สำรองของวินโดวส์แทน
rem
rem   ภาษาที่ได้คือภาษาไทย เพราะ script.js ตั้งไทยเป็นค่าเริ่มต้น
rem   และโปรไฟล์ที่ใช้พิมพ์เป็นโปรไฟล์เปล่า ไม่มี localStorage ค้างไว้
rem ============================================================

rem ---------- หา chrome.exe ----------
set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%LocalAppData%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" (
  echo [ไม่ผ่าน] หา chrome.exe ไม่เจอ
  echo           ติดตั้ง Google Chrome ก่อน หรือแก้พาธในไฟล์นี้เอง
  if /i not "%~1"=="q" pause
  exit /b 1
)

rem ---------- รากโปรเจกต์คือโฟลเดอร์แม่ของ tools\ ----------
for %%I in ("%~dp0..") do set "ROOT=%%~fI"
set "OUT=%ROOT%\Sarunwit-Pibul-Resume-TH.pdf"

rem เปลี่ยน \ เป็น / ให้เป็นรูปแบบ URL ของไฟล์ในเครื่อง
set "PAGE=file:///%ROOT:\=/%/index.html"

echo กำลังสร้าง PDF จาก %PAGE%
if exist "%OUT%" del "%OUT%"

rem ---------- สั่งพิมพ์ ----------
rem   --user-data-dir   ใช้โปรไฟล์ชั่วคราวแยกจาก Chrome ที่เปิดอยู่
rem                     ถ้าไม่ใส่ คำสั่งจะถูกส่งเข้าหน้าต่างเดิมแล้วไม่สร้างไฟล์ให้
rem   --virtual-time-budget  รอให้ฟอนต์กับรูปมาถึงก่อนพิมพ์ (หน่วยมิลลิวินาที)
rem   --no-pdf-header-footer ตัด URL กับเลขหน้าที่เบราว์เซอร์แปะให้
"%CHROME%" ^
  --headless=new ^
  --disable-gpu ^
  --no-pdf-header-footer ^
  --user-data-dir="%TEMP%\resume-pdf-profile" ^
  --virtual-time-budget=15000 ^
  --run-all-compositor-stages-before-draw ^
  --print-to-pdf="%OUT%" ^
  "%PAGE%"

rem ---------- ตรวจผล ----------
if not exist "%OUT%" (
  echo [ไม่ผ่าน] Chrome ไม่ได้สร้างไฟล์ให้
  if /i not "%~1"=="q" pause
  exit /b 1
)

echo [ผ่าน] ได้ไฟล์แล้ว
echo        %OUT%
if /i not "%~1"=="q" pause
endlocal
