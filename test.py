import os

def ensure_dir(path):
    """Đảm bảo đường dẫn tồn tại, tạo nếu cần"""
    if not os.path.exists(path):
        os.makedirs(path)
    return path

# Đường dẫn cần kiểm tra
output_folder = "D:/truyen-linh-vu-thien-ha/ok"

# Kiểm tra hàm ensure_dir
created_path = ensure_dir(output_folder)

# In ra kết quả
if os.path.exists(created_path):
    print(f"Thư mục đã được tạo: {created_path}")
else:
    print("Không thể tạo thư mục.")
