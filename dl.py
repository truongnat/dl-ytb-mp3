import os
import yt_dlp

def download_playlist(playlist_url, output_path):
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': os.path.join(output_path, '%(title)s.%(ext)s'),
        'ignoreerrors': True,
        'no_warnings': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(playlist_url, download=False)
        if 'entries' in info:
            playlist = info['entries']
            total_videos = len(playlist)
            print(f"Đã tìm thấy {total_videos} video trong playlist.")

            for index, video in enumerate(playlist, start=1):
                if video:
                    print(f"\nĐang xử lý video {index}/{total_videos}: {video['title']}")
                    try:
                        ydl.download([video['webpage_url']])
                        print(f"Hoàn thành: {video['title']}")
                        print(f"Tiến độ: {index}/{total_videos} ({index/total_videos*100:.2f}%)")
                    except Exception as e:
                        print(f"Lỗi khi xử lý video {index}: {str(e)}")
                else:
                    print(f"Không thể truy cập thông tin cho video {index}")

    print("\nĐã hoàn thành tất cả các video có thể tải xuống.")

# Sử dụng hàm
playlist_url = "https://youtube.com/playlist?list=PLwKZwhXs7EKyNpxssu0plfr3N4Gwg3zPw"
output_folder = "/d/truyen-linh-vu-thien-ha"
download_playlist(playlist_url, output_folder)