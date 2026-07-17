PERFECTIT VIDEO FOLDERS

teaching/
  Place Simon's teaching and introduction clips here.

testimonials/
  Place student testimonial clips here.

Recommended web format:
- MP4 using H.264 video and AAC audio
- 16:9 landscape where possible
- Keep clips short and compressed for GitHub Pages

The website hides a video automatically when its JSON entry has:
  "enabled": false

To publish a video:
1. Copy the MP4 into the correct folder.
2. Update the matching JSON source path.
3. Change "enabled" to true.

YouTube videos are also supported. Use:
  "type": "youtube"
  "source": "https://www.youtube.com/embed/VIDEO_ID"
