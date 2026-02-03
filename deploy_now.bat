@echo off
echo ========================================================
echo DANG TRIEN KHAI KHO KIEN THUC LEN GITHUB...
echo ========================================================

echo 1. Cau hinh nguoi dung ao (De Git khong hoi nua)...
git config user.email "auto@deploy.com"
git config user.name "Auto Deploy"

echo 2. Khoi tao Git...
git init

echo 3. Them tat ca file...
git add .

echo 4. Luu thay doi (Commit)...
git commit -m "Auto deploy from script"

echo 5. Doi nhanh chinh thanh Main...
git branch -M main

echo 6. Ket noi voi GitHub...
rem Xoa remote cu neu da ton tai de tranh loi
git remote remove origin
git remote add origin https://github.com/NguyenDinhNhan010902/networking.git

echo 7. Day code len Server...
echo (Neu duoc hoi dang nhap, hay dang nhap tren trinh duyet nhe)
git push -u origin main

echo ========================================================
echo HOAN TAT! HAY KIEM TRA GITHUB CUA BAN.
echo ========================================================
pause
