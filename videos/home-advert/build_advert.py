import math
import wave
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parent
RATE = 44100
DURATION = 57.2
BPM = 124


def add_tone(track, start, duration, frequency, amplitude, decay=3.0):
    first = int(start * RATE)
    count = min(int(duration * RATE), len(track) - first)
    if count <= 0:
        return
    t = np.arange(count) / RATE
    env = np.exp(-decay * t / max(duration, 0.01))
    tone = np.sin(2 * np.pi * frequency * t)
    tone += 0.28 * np.sin(2 * np.pi * frequency * 2 * t)
    track[first:first + count] += amplitude * env * tone


def add_noise(track, start, duration, amplitude, decay=9.0, seed=0):
    first = int(start * RATE)
    count = min(int(duration * RATE), len(track) - first)
    if count <= 0:
        return
    rng = np.random.default_rng(seed)
    t = np.arange(count) / RATE
    env = np.exp(-decay * t / max(duration, 0.01))
    track[first:first + count] += amplitude * env * rng.standard_normal(count)


samples = int(DURATION * RATE)
left = np.zeros(samples, dtype=np.float64)
right = np.zeros(samples, dtype=np.float64)
beat = 60 / BPM

# Bright technology-advert progression: Am - F - C - G.
chords = [
    (110.00, [220.00, 261.63, 329.63]),
    (87.31, [174.61, 220.00, 261.63]),
    (130.81, [261.63, 329.63, 392.00]),
    (98.00, [196.00, 246.94, 293.66]),
]

total_beats = math.ceil(DURATION / beat)
for n in range(total_beats):
    start = n * beat
    bar = n // 4
    bass, notes = chords[bar % len(chords)]

    # Punchy kick on every beat, extra lift before each new bar.
    add_tone(left, start, 0.20, 58, 0.34, decay=9)
    add_tone(right, start, 0.20, 58, 0.34, decay=9)
    if n % 4 in (1, 3):
        add_noise(left, start, 0.15, 0.10, seed=n)
        add_noise(right, start, 0.15, 0.10, seed=1000 + n)

    # Bass pulse and a quick alternating arpeggio.
    add_tone(left, start, beat * 0.78, bass, 0.11, decay=2.8)
    add_tone(right, start, beat * 0.78, bass, 0.11, decay=2.8)
    for step in range(2):
        note = notes[(n * 2 + step) % len(notes)]
        note_start = start + step * beat / 2
        pan = 0.72 if (n + step) % 2 == 0 else 0.34
        add_tone(left, note_start, beat * 0.42, note, 0.085 * pan, decay=4)
        add_tone(right, note_start, beat * 0.42, note, 0.085 * (1.06 - pan), decay=4)

    # Closed hi-hats keep energy moving between beats.
    for half in (0, 0.5):
        hat_start = start + half * beat
        add_noise(left, hat_start, 0.055, 0.032, seed=2000 + n * 2 + int(half * 2))
        add_noise(right, hat_start, 0.055, 0.032, seed=4000 + n * 2 + int(half * 2))

# Smooth entrance and exit for seamless looping on the home page.
fade = int(1.15 * RATE)
left[:fade] *= np.linspace(0, 1, fade)
right[:fade] *= np.linspace(0, 1, fade)
left[-fade:] *= np.linspace(1, 0, fade)
right[-fade:] *= np.linspace(1, 0, fade)

stereo = np.column_stack((left, right))
peak = np.max(np.abs(stereo))
stereo = np.clip(stereo / max(peak, 1.0) * 0.82, -1, 1)
pcm = (stereo * 32767).astype('<i2')

with wave.open(str(ROOT / 'active-advert-music.wav'), 'wb') as output:
    output.setnchannels(2)
    output.setsampwidth(2)
    output.setframerate(RATE)
    output.writeframes(pcm.tobytes())

print(ROOT / 'active-advert-music.wav')
