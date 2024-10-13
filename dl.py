import os
import json
import yt_dlp
import argparse

def ensure_dir(path):
    """Đảm bảo đường dẫn tồn tại, tạo nếu cần"""
    if not os.path.exists(path):
        os.makedirs(path)
    return path

def load_cache(cache_file):
    """Tải cache từ file"""
    if os.path.exists(cache_file):
        with open(cache_file, 'r') as f:
            return json.load(f)
    return {}

def save_cache(cache_file, cache):
    """Lưu cache vào file"""
    with open(cache_file, 'w') as f:
        json.dump(cache, f)

def download_playlist(playlist_url, output_path):
    # Đảm bảo output_path là đường dẫn tuyệt đối
    output_path = os.path.abspath(output_path)
    output_path = ensure_dir(output_path)

    cache_file = os.path.join(output_path, 'download_cache.json')
    cache = load_cache(cache_file)

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
                    video_id = video['id']
                    
                    if video_id in cache:
                        print(f"\nVideo {index}/{total_videos}: {video['title']} đã tồn tại trong cache. Bỏ qua.")
                        continue

                    print(f"\nĐang xử lý video {index}/{total_videos}: {video['title']}")
                    try:
                        ydl.download([video['webpage_url']])
                        cache[video_id] = {
                            'title': video['title'],
                            'filename': f"{video['title']}.mp3"
                        }
                        save_cache(cache_file, cache)
                        print(f"Hoàn thành: {video['title']}")
                        print(f"Tiến độ: {index}/{total_videos} ({index/total_videos*100:.2f}%)")
                    except Exception as e:
                        print(f"Lỗi khi xử lý video {index}: {str(e)}")
                else:
                    print(f"Không thể truy cập thông tin cho video {index}")

    print("\nĐã hoàn thành tất cả các video có thể tải xuống.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Tải video từ playlist YouTube.")
    parser.add_argument('-i', '--input', required=True, help='URL của playlist YouTube')
    parser.add_argument('-o', '--output', required=True, help='Thư mục đầu ra')

    args = parser.parse_args()

    download_playlist(args.input, args.output)
