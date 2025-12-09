import numpy as np
from pydub import AudioSegment
from scipy.spatial.distance import cosine
import librosa


def extract_mfcc(path):
    audio, sr = librosa.load(path, sr=16000)
    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=20)
    return np.mean(mfcc, axis=1)


def compare_voice(path1, path2):
    try:
        v1 = extract_mfcc(path1)
        v2 = extract_mfcc(path2)

        similarity = 1 - cosine(v1, v2)
        return similarity

    except Exception as e:
        print("Error comparing voice:", e)
        return 0
