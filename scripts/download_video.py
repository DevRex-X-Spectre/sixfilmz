#!/usr/bin/env python3
"""
SIX STUDIO - Automated 1080p Video Downloader & Portfolio Ingestor

Usage:
  python scripts/download_video.py "https://youtu.be/EXAMPLE"
  python scripts/download_video.py --interactive
  python scripts/download_video.py "https://youtu.be/EXAMPLE" --add

Features:
- Downloads 1080p Full HD video (or best available) from YouTube, Vimeo, etc.
- Converts/re-encodes video to universally compatible web MP4 (H.264 / AAC).
- Automatically extracts a pristine 1080p poster frame thumbnail (.jpg).
- Formats duration and generates the TypeScript snippet for src/data/content.ts.
- Optional --add flag to append directly into src/data/content.ts.
"""

import sys
import os
import re
import json
import argparse
import subprocess
from pathlib import Path

# Ensure yt_dlp is installed
try:
    import yt_dlp
except ImportError:
    print("[*] Installing yt-dlp...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "yt-dlp"])
    import yt_dlp


def slugify(text: str) -> str:
    """Convert a title into a clean filename-friendly slug."""
    text = text.lower()
    text = re.sub(r'[\(\)\[\]\{\}\'"!?,.:;@#$%^&*+=/\\|<>~`]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = text.strip('-')
    return text or "video"


def format_duration(seconds: float | int | None) -> str:
    """Convert duration in seconds to MM:SS format."""
    if not seconds:
        return "1:00"
    seconds = int(round(seconds))
    mins = seconds // 60
    secs = seconds % 60
    return f"{mins}:{secs:02d}"


def extract_poster_frame(video_path: Path, poster_path: Path, timestamp_sec: float = 1.0) -> bool:
    """Extract a high-resolution JPG poster image from video using ffmpeg."""
    poster_path.parent.mkdir(parents=True, exist_ok=True)
    ts = f"{timestamp_sec:.2f}"
    
    cmd = [
        "ffmpeg", "-y",
        "-ss", ts,
        "-i", str(video_path),
        "-vframes", "1",
        "-q:v", "2",
        str(poster_path)
    ]
    try:
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return poster_path.exists() and poster_path.stat().st_size > 0
    except Exception as e:
        print(f"[!] Warning: Could not extract poster frame with ffmpeg: {e}")
        return False


def download_video(url: str, custom_slug: str | None = None, max_height: int = 1080) -> dict:
    """Download video in highest quality up to max_height (default 1080p)."""
    project_root = Path(__file__).resolve().parent.parent
    videos_dir = project_root / "public" / "videos"
    posters_dir = project_root / "public" / "posters"
    temp_dir = project_root / "temp_download"

    videos_dir.mkdir(parents=True, exist_ok=True)
    posters_dir.mkdir(parents=True, exist_ok=True)
    temp_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n[+] Fetching video metadata from: {url}")

    ydl_opts_meta = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False,
    }

    with yt_dlp.YoutubeDL(ydl_opts_meta) as ydl:
        info = ydl.extract_info(url, download=False)
    
    title = info.get('title', 'Cinematic Work')
    duration = info.get('duration', 60)
    slug = custom_slug or slugify(title)
    
    print(f"    Title: {title}")
    print(f"    Duration: {format_duration(duration)}")
    print(f"    Identifier / Slug: {slug}")

    target_video_file = videos_dir / f"{slug}.mp4"
    target_poster_file = posters_dir / f"{slug}.jpg"
    temp_template = str(temp_dir / f"{slug}_raw.%(ext)s")

    # Download format prioritizing 1080p / best video + best audio
    format_spec = f"bestvideo[height<={max_height}]+bestaudio/best[height<={max_height}]/best"

    ydl_opts = {
        'format': format_spec,
        'outtmpl': temp_template,
        'merge_output_format': 'mp4',
        'quiet': False,
        'no_warnings': True,
    }

    print(f"\n[+] Downloading in {max_height}p master quality...")
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    # Find the downloaded raw file in temp_dir
    raw_files = list(temp_dir.glob(f"{slug}_raw.*"))
    if not raw_files:
        raise RuntimeError("Download completed but output file not found.")

    raw_file = raw_files[0]
    print(f"\n[+] Optimizing web-compatible MP4 encoding with ffmpeg...")
    
    # Encode to standard web H.264 + AAC with FastStart (moov atom at beginning)
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-i", str(raw_file),
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "20",
        "-c:a", "aac",
        "-b:a", "192k",
        "-movflags", "+faststart",
        "-pix_fmt", "yuv420p",
        str(target_video_file)
    ]
    subprocess.run(ffmpeg_cmd, check=True)

    # Clean up temp raw file
    try:
        raw_file.unlink()
        temp_dir.rmdir()
    except Exception:
        pass

    # Poster frame extraction (at 1.5s or 10% into video)
    poster_time = min(1.5, max(0.5, (duration or 10) * 0.1))
    print(f"[+] Generating 1080p poster frame: /posters/{slug}.jpg")
    extract_poster_frame(target_video_file, target_poster_file, timestamp_sec=poster_time)

    item_data = {
        "id": slug,
        "kind": "video",
        "title": title,
        "category": "Motion Cinema",
        "src": f"/videos/{slug}.mp4",
        "poster": f"/posters/{slug}.jpg",
        "duration": format_duration(duration),
        "aspect": "wide"
    }

    return item_data


def add_to_content_ts(item: dict) -> bool:
    """Safely appends the video item to uniqueVideos in src/data/content.ts."""
    project_root = Path(__file__).resolve().parent.parent
    content_file = project_root / "src" / "data" / "content.ts"

    if not content_file.exists():
        print(f"[!] File not found: {content_file}")
        return False

    content = content_file.read_text(encoding="utf-8")

    # Check if already added
    if f'id: "{item["id"]}"' in content:
        print(f"[*] Item with id '{item['id']}' already exists in content.ts.")
        return True

    snippet = f"""  {{
    id: "{item['id']}",
    kind: "video",
    title: "{item['title']}",
    category: "{item['category']}",
    src: "{item['src']}",
    poster: "{item['poster']}",
    duration: "{item['duration']}",
    aspect: "wide",
  }},
"""

    # Look for uniqueVideos end
    pattern = r'(export const uniqueVideos:\s*MediaItem\[\]\s*=\s*\[[\s\S]*?)(\n\];)'
    match = re.search(pattern, content)
    if not match:
        print("[!] Could not find uniqueVideos array in content.ts to auto-append.")
        return False

    new_content = content[:match.start(2)] + snippet + content[match.start(2):]
    content_file.write_text(new_content, encoding="utf-8")
    print(f"[✔] Successfully added '{item['title']}' to src/data/content.ts!")
    return True


def main():
    parser = argparse.ArgumentParser(description="SIX STUDIO 1080p Video Downloader")
    parser.add_argument("url", nargs="?", help="YouTube or video URL to download")
    parser.add_argument("--slug", help="Custom identifier/filename slug (e.g. brand-commercial)")
    parser.add_argument("--quality", type=int, default=1080, help="Max video resolution height (default: 1080)")
    parser.add_argument("--add", action="store_true", help="Automatically append to src/data/content.ts")
    parser.add_argument("--interactive", "-i", action="store_true", help="Interactive prompt mode")

    args = parser.parse_args()

    url = args.url
    if not url or args.interactive:
        print("==================================================")
        print("       SIX STUDIO - 1080p VIDEO DOWNLOADER        ")
        print("==================================================")
        url = input("Enter Video URL (YouTube, Vimeo, etc.): ").strip()
        if not url:
            print("[!] Error: No URL provided.")
            sys.exit(1)

        custom_slug = input("Enter custom filename slug (leave blank for auto): ").strip() or None
        auto_add = input("Automatically add to website portfolio? (y/n, default: y): ").strip().lower()
        should_add = auto_add in ("", "y", "yes")
    else:
        custom_slug = args.slug
        should_add = args.add

    try:
        item = download_video(url, custom_slug=custom_slug, max_height=args.quality)

        print("\n" + "=" * 50)
        print("✔ DOWNLOAD & PROCESSING COMPLETE!")
        print("=" * 50)
        print(f"Video File:  public{item['src']}")
        print(f"Poster File: public{item['poster']}")
        print(f"Duration:    {item['duration']}")
        print("\nSnippet for src/data/content.ts:")
        print("--------------------------------------------------")
        print(f"""  {{
    id: "{item['id']}",
    kind: "video",
    title: "{item['title']}",
    category: "{item['category']}",
    src: "{item['src']}",
    poster: "{item['poster']}",
    duration: "{item['duration']}",
    aspect: "wide",
  }},""")
        print("--------------------------------------------------")

        if should_add:
            add_to_content_ts(item)

    except Exception as e:
        print(f"\n[!] Error during processing: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
