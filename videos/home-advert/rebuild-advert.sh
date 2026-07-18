#!/usr/bin/env bash
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
cd "$here"

python3 build_advert.py

# Timeline starts deliberately overlap by 0.70 s. This lets the next speaker
# enter before the previous visual/audio section has fully finished.
ffmpeg -y -hide_banner -loglevel warning \
  -i perfectit-home-advert-previous.mp4 \
  -i 'clips/First(1).mp3' \
  -i 'clips/First(1).mp4' \
  -i 'clips/Second(1).mp3' \
  -i 'clips/Thursday session(1).mp4' \
  -i 'clips/Third(1).mp3' \
  -i active-advert-music.wav \
  -filter_complex "\
    [0:v]trim=start=0:end=12.023,fps=30,settb=AVTB,setpts=PTS-STARTPTS[v0];\
    [0:v]trim=start=12.023:end=19.423,fps=30,settb=AVTB,setpts=PTS-STARTPTS[v1];\
    [0:v]trim=start=19.423:end=29.723,fps=30,settb=AVTB,setpts=PTS-STARTPTS[v2];\
    [0:v]trim=start=29.723:end=39.576,fps=30,settb=AVTB,setpts=PTS-STARTPTS[v3];\
    [0:v]trim=start=39.576:end=59.043,fps=30,settb=AVTB,setpts=PTS-STARTPTS[v4];\
    [v0][v1]xfade=transition=fade:duration=0.70:offset=11.323[x1];\
    [x1][v2]xfade=transition=fade:duration=0.70:offset=18.023[x2];\
    [x2][v3]xfade=transition=fade:duration=0.70:offset=27.623[x3];\
    [x3][v4]xfade=transition=fade:duration=0.70:offset=36.776,format=yuv420p[vout];\
    [1:a]aformat=sample_rates=44100:channel_layouts=stereo,afade=t=in:st=0:d=0.18,afade=t=out:st=11.68:d=0.24,adelay=0|0,volume=1.05[a1];\
    [2:a]aformat=sample_rates=44100:channel_layouts=stereo,afade=t=in:st=0:d=0.18,afade=t=out:st=7.21:d=0.24,adelay=11323|11323,volume=1.05[a2];\
    [3:a]aformat=sample_rates=44100:channel_layouts=stereo,afade=t=in:st=0:d=0.18,afade=t=out:st=9.98:d=0.24,adelay=18023|18023,volume=1.05[a3];\
    [4:a]aformat=sample_rates=44100:channel_layouts=stereo,afade=t=in:st=0:d=0.18,afade=t=out:st=9.68:d=0.24,adelay=27623|27623,volume=1.05[a4];\
    [5:a]aformat=sample_rates=44100:channel_layouts=stereo,afade=t=in:st=0:d=0.18,afade=t=out:st=14.71:d=0.24,adelay=36776|36776,volume=1.05[a5];\
    [a1][a3][a5]amix=inputs=3:duration=longest:normalize=0[voiceovers];\
    [a2][a4]amix=inputs=2:duration=longest:normalize=0,asplit=2[teachingkeyraw][teachingmix];\
    [teachingkeyraw]apad=whole_dur=56.243[teachingkey];\
    [voiceovers][teachingmix]amix=inputs=2:duration=longest:normalize=0,acompressor=threshold=0.30:ratio=2.5:attack=8:release=120[spoken];\
    [6:a]volume=0.29[music];\
    [music][teachingkey]sidechaincompress=threshold=0.012:ratio=16:attack=90:release=420[ducked];\
    [ducked][spoken]amix=inputs=2:duration=longest:weights='1 1':normalize=0,alimiter=limit=0.94,atrim=duration=56.243[aout]" \
  -map '[vout]' -map '[aout]' \
  -c:v libx264 -preset medium -crf 21 -r 30 \
  -c:a aac -b:a 192k -movflags +faststart \
  perfectit-home-advert-new.mp4

mv perfectit-home-advert-new.mp4 perfectit-home-advert.mp4

echo "Built: $here/perfectit-home-advert.mp4"
