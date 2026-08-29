# -*- coding: utf-8 -*-
"""
========================================================================================
HỆ THỐNG HỌC TIẾNG TẠNG SARA BOOK, TRỢ LÝ AI & WACOM STUDIO (ALL-IN-ONE SINGLE CORE)
Tác giả: Tổng hợp toàn bộ hệ thống Ngôn ngữ Tạng, OCR Bounding-Box, Wacom HWR & TTS
========================================================================================
"""
import os
import sys
import io
import re
import json
import ssl
import time
import base64
import hashlib
import unicodedata
import traceback
import urllib.request
import urllib.parse
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

import pymupdf  # PyMuPDF
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

# Ensure UTF-8 output on Windows
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

# Paths & Directories
APP_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(APP_DIR)
AUDIO_CACHE_DIR = os.path.join(APP_DIR, 'audio_cache')
PDF_PATH = os.path.join(ROOT_DIR, 'sara book_260627_183900_1.pdf')
BOOK_DATA_PATH = os.path.join(APP_DIR, 'sara_book_data.json')
NOTES_DATA_PATH = os.path.join(APP_DIR, 'user_notes.json')

os.makedirs(AUDIO_CACHE_DIR, exist_ok=True)

# ======================================================================================
# 1. TIBETAN CLEANER & FONT NORMALIZER & PYMUPDF RECT INTERSECTOR
# ======================================================================================
def clean_legacy_tibetan(text):
    """
    Standardize, clean and repair legacy Sambhota / Dedris / Monlam Tibetan font artifacts
    """
    if not text:
        return ""
    
    # 1. Unicode NFC Normalization & PUA removal
    text = unicodedata.normalize('NFC', text)
    text = re.sub(r'[\uE000-\uF8FF]', '', text)
    
    # 2. Standardize dots, tshegs & symbols first
    text = text.replace('·', '་').replace('•', '་').replace('༌', '་')
    
    # Strip orphan leading vowel marks from OCR / bounding box overlaps when followed by main text
    text = re.sub(r'^[\u0F72\u0F74\u0F7A\u0F7C\u0F71-\u0F84]+\s+(?=[ཀ-ཨ])', '', text)
    
    # 3. FIX DEDRIS MULTI-LAYER STACK ARTIFACTS:
    # A) Double subjoined Ya (0xfb1 + 0xfb1 + 0xf72 -> 0xfb1 + 0xf72 e.g. ཁྱ + ྱི -> ཁྱི)
    text = text.replace('ྱྱི', 'ྱི')
    text = text.replace('ྱློ', 'ྱོ')
    
    # B) Ra-btags + Ya-btags + Gigu -> Ra-btags + Gigu (e.g. ཏྲ + ྱི -> ཏྲི, དྲ + ྱི -> དྲི, ཧྲ + ྱི -> ཧྲི)
    text = text.replace('ྲྱི', 'ྲི')
    text = text.replace('ྲློ', 'ྲོ') # Ra-btags + La + Naro -> Ra-btags + Naro (ཏྲ + ློ -> ཏྲོ)
    
    # C) Mgo-can / Superscripts (0xf90 - 0xfbc) + Ya-btags + Gigu -> Mgo-can + Gigu
    no_ya_stacks = 'ྐྒྔྗྙྟྡྣྦྨྩྫ'
    for s in no_ya_stacks:
        text = text.replace(s + 'ྱི', s + 'ི') # རྐྱི -> རྐི
        text = text.replace(s + 'ློ', s + 'ོ') # རྐློ -> རྐོ
        
    # D) Single root consonants + ྱི -> root + ི (for consonants that cannot take Ya-btags)
    all_invalid_ya = 'ངཅཆཇཉཏཐདནཙཚཛཝཞཟའཡརལཤསཧཨ'
    for ch in all_invalid_ya:
        text = text.replace(ch + 'ྱི', ch + 'ི')
        
    # Prefixed consonants with zha, cha, ta, da:
    text = re.sub(r'([གདབམའ][ཅཆཇཉཏཐདནཙཚཛཞཟཤས])ྱི', r'\1ི', text)
    text = re.sub(r'([ཀ-ཨ])འྱི', r'\1འི་', text)
    
    # E) Single root consonants + ློ -> root + ོ (for consonants that cannot take La-btags)
    all_invalid_la = 'ཁངཅཆཇཉཏཐདནཔཕམཙཚཛཝཞའཡརལཤཧཨ'
    for ch in all_invalid_la:
        text = text.replace(ch + 'ློ', ch + 'ོ')
        
    text = re.sub(r'([གདབམའ][ཀཁགངཅཆཇཉཏཐདནཔཕབམཙཚཛཝཞཟཡརཤསཧཨ])ློ', r'\1ོ', text)
    
    # Dedris dialogue & textbook vocabulary repairs
    text = text.replace('ཁློང', 'ཁོང')
    text = text.replace('ཁོང་གྱི', 'ཁོང་གི')
    text = text.replace('ཁློང་གྱི', 'ཁོང་གི')
    text = text.replace('ཁྱེད་རང་གྱི', 'ཁྱེད་རང་གི')
    text = text.replace('ངའྱི་', 'ངའི་')
    text = text.replace('མློའྱི་', 'མོའི་')
    text = text.replace('ཁློང་ཚོའྱི་', 'ཁོང་ཚོའི་')
    text = text.replace('སློལ་དཀར', 'སྒྲོལ་དཀར')
    text = text.replace('སྐྱྱིད་པློ', 'སྐྱིད་པོ')
    text = text.replace('རྐུབ་བཀག', 'རྐུབ་ཀྱག')
    text = text.replace('དབངས་', 'དབྱངས་')
    text = text.replace('དབང་བཞི', 'དབྱངས་བཞི')
    text = text.replace('གསལ་བེད', 'གསལ་བྱེད')
    text = text.replace('འབྱི་སྟངས', 'འབྲི་སྟངས')
    text = text.replace('སོབ་གཉེར', 'སློབ་གཉེར')
    text = text.replace('གློགས་པློ', 'གྲོགས་པོ')
    text = text.replace('གློ', 'གོ')
    text = text.replace('བློད', 'བོད')
    text = text.replace('མྱི', 'མི')
    
    # Standalone Sa + Naro (So - răng / tooth) vs slob (học sinh / sách)
    text = re.sub(r'(^|[་\s])སློ($|[་\s།])', r'\1སོ\2', text)
    text = text.replace('སློར་ཀློག', 'སྦྱོར་ཀློག')
    text = text.replace('ངློ་སློད', 'ངོ་སྤྲོད')
    text = text.replace('སོབ', 'སློབ')
    
    # 5. Clean whitespace & tshegs
    text = re.sub(r'[\r\n\t]+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'་+', '་', text)
    text = re.sub(r'།+', '།', text)
    text = re.sub(r'\s*་\s*', '་', text)
    text = re.sub(r'\s*།\s*', '། ', text)
    
    return text.strip()

def extract_cropped_tibetan_text(page, clip_rect):
    """
    Extracts only the exact words/characters inside the user's cropped bounding box
    with intelligent overlap-ratio filtering to ignore accidental edge-grazes.
    """
    if not page or not clip_rect or not clip_rect.is_valid:
        return ""
        
    words = page.get_text('words')
    selected_words = []
    
    clip_area = max(1.0, clip_rect.width * clip_rect.height)
    
    for w in words:
        w_rect = pymupdf.Rect(w[0], w[1], w[2], w[3])
        if clip_rect.intersects(w_rect):
            inter = clip_rect & w_rect
            if inter.is_valid:
                inter_area = inter.width * inter.height
                w_area = max(1.0, w_rect.width * w_rect.height)
                # Word must overlap by at least 25% of word area or 20% of clip area
                if (inter_area / w_area) >= 0.20 or (inter_area / clip_area) >= 0.20:
                    selected_words.append((w[1], w[0], w[4]))
                
    if selected_words:
        selected_words.sort(key=lambda item: (round(item[0] / 10) * 10, item[1]))
        raw_text = ' '.join([item[2] for item in selected_words])
    else:
        raw_text = page.get_text('text', clip=clip_rect).strip()
        
    return clean_legacy_tibetan(raw_text)


# ======================================================================================
# 2. TIBETAN LINGUISTIC, WYLIE EWTS & BUDDHIST DICTIONARY ENGINE
# ======================================================================================
CONSONANT_MAP = {
    'ཀ': 'k', 'ཁ': 'kh', 'ག': 'g', 'ང': 'ng',
    'ཅ': 'c', 'ཆ': 'ch', 'ཇ': 'j', 'ཉ': 'ny',
    'ཏ': 't', 'ཐ': 'th', 'ད': 'd', 'ན': 'n',
    'པ': 'p', 'ཕ': 'ph', 'བ': 'b', 'མ': 'm',
    'ཙ': 'ts', 'ཚ': 'tsh', 'ཛ': 'dz', 'ཝ': 'w',
    'ཞ': 'zh', 'ཟ': 'z', 'འ': "'", 'ཡ': 'y',
    'ར': 'r', 'ལ': 'l', 'ཤ': 'sh', 'ས': 's',
    'ཧ': 'h', 'ཨ': 'a'
}

CONSONANT_NAMES_VN = {
    'ཀ': ('ka', 'ca (âm cao)'),
    'ཁ': ('kha', 'kha (cao, bật hơi)'),
    'ག': ('ga', 'ga / kha (âm trầm)'),
    'ང': ('nga', 'nga (âm trầm)'),
    'ཅ': ('ca', 'cha (âm cao)'),
    'ཆ': ('cha', 'chha (cao, bật hơi)'),
    'ཇ': ('ja', 'ja / cha (âm trầm)'),
    'ཉ': ('nya', 'nha (âm trầm)'),
    'ཏ': ('ta', 'ta (âm cao)'),
    'ཐ': ('tha', 'tha (cao, bật hơi)'),
    'ད': ('da', 'da / tha (âm trầm)'),
    'ན': ('na', 'na (âm trầm)'),
    'པ': ('pa', 'pa (âm cao)'),
    'ཕ': ('pha', 'pha (cao, bật hơi)'),
    'བ': ('ba', 'ba / pha (âm trầm)'),
    'མ': ('ma', 'ma (âm trầm)'),
    'ཙ': ('tsa', 'tsa (âm cao)'),
    'ཚ': ('tsha', 'tsha (cao, bật hơi)'),
    'ཛ': ('dza', 'dza / tsha (âm trầm)'),
    'ཝ': ('wa', 'wa (âm trầm)'),
    'ཞ': ('zha', 'zha / sha trầm'),
    'ཟ': ('za', 'za / sa trầm'),
    'འ': ("'a", "'a-chung (âm trầm)"),
    'ཡ': ('ya', 'ya (âm trầm)'),
    'ར': ('ra', 'ra'),
    'ལ': ('la', 'la'),
    'ཤ': ('sha', 'sha (âm cao)'),
    'ས': ('sa', 'sa (âm cao)'),
    'ཧ': ('ha', 'ha (âm cao)'),
    'ཨ': ('a', 'a (nguyên âm gốc)')
}

SUBJOINED_MAP = {
    'ྐ': 'k', 'ྑ': 'kh', 'ྒ': 'g', 'ྔ': 'ng',
    'ྕ': 'c', 'ྖ': 'ch', 'ྗ': 'j', 'ྙ': 'ny',
    'ྟ': 't', 'ྠ': 'th', 'ྡ': 'd', 'ྣ': 'n',
    'ྤ': 'p', 'ྥ': 'ph', 'ྦ': 'b', 'ྨ': 'm',
    'ྩ': 'ts', 'ྪ': 'tsh', 'ྫ': 'dz', 'ྭ': 'w',
    'ྮ': 'zh', 'ྯ': 'z', 'ྰ': "'", 'ྱ': 'y',
    'ྲ': 'r', 'ླ': 'l', 'ྴ': 'sh', 'ྵ': 'sh',
    'ྶ': 's', 'ྷ': 'h', 'ྸ': 'a'
}

SUBJOINED_NAMES = {
    'ྱ': ('Ya-ta', 'Chân Ya (-y-)'),
    'ྲ': ('Ra-ta', 'Chân Ra (-r-)'),
    'ླ': ('La-ta', 'Chân La (-l-)'),
    'ྭ': ('Wa-zur', 'Góc Wa (-w-)')
}

VOWEL_MAP = {
    '\u0F72': 'i', '\u0F74': 'u', '\u0F7A': 'e', '\u0F7C': 'o',
    '\u0F71': 'A', '\u0F7E': 'M', '\u0F7F': 'H', '\u0F80': 'I', '\u0F83': '~'
}

VOWEL_DESCS = {
    '\u0F72': ('i', 'Gi-gu ( ི) - Nguyên âm I trên'),
    '\u0F74': ('u', 'Zhabs-kyu ( ུ) - Nguyên âm U dưới'),
    '\u0F7A': ('e', 'Dreng-bu ( ེ) - Nguyên âm E trên'),
    '\u0F7C': ('o', 'Na-ro ( ོ) - Nguyên âm O trên'),
    '\u0F71': ('A', 'A-chung ( ཱ) - Nguyên âm dài A'),
    '\u0F7E': ('M', 'Thigle / Anusvara ( ཾ) - Âm mũi m'),
    '\u0F7F': ('H', 'Visarga ( ཿ) - Âm h'),
    '\u0F80': ('I', 'Gi-gu ngược ( ྀ) - Nguyên âm I dài'),
    '\u0F83': ('~', 'Nada ( ྃ) - Mặt trăng & giọt sáng')
}

PREFIXES = {'ག', 'ད', 'བ', 'མ', 'འ'}
SUPERSCRIPTS = {'ར', 'ལ', 'ས'}
SUFFIXES = {'ག', 'ང', 'ད', 'ན', 'བ', 'མ', 'འ', 'ར', 'ལ', 'ས'}
POST_SUFFIXES = {'ད', 'ས'}

def unicode_syllable_to_wylie(syl):
    syl = syl.replace('་', '').replace('།', '').strip()
    if not syl:
        return ""
    res = []
    has_vowel = False
    for ch in syl:
        if ch in CONSONANT_MAP:
            res.append(CONSONANT_MAP[ch])
        elif ch in SUBJOINED_MAP:
            res.append(SUBJOINED_MAP[ch])
        elif ch in VOWEL_MAP:
            has_vowel = True
            v = VOWEL_MAP[ch]
            if v == 'A':
                res.append('a')
            elif v in ['M', 'H', '~']:
                if not has_vowel:
                    res.append('a')
                    has_vowel = True
                res.append(v)
            else:
                res.append(v)
                
    out = "".join(res)
    if not any(v in out for v in ['i', 'u', 'e', 'o']):
        vowel_found = any(v in out for v in ['i', 'u', 'e', 'o', 'a'])
        if not vowel_found:
            if len(out) <= 2:
                out += 'a'
            else:
                if out.endswith(('ngs', 'rgs', 'lgs', 'mgs')):
                    out = out[:-3] + 'a' + out[-3:]
                elif out.endswith(('gs', 'bs', 'ms', 'rs', 'ls', 'ts')):
                    out = out[:-2] + 'a' + out[-2:]
                elif out.endswith(('ng',)):
                    out = out[:-2] + 'a' + out[-2:]
                elif out.endswith(('g', 'd', 'n', 'b', 'm', 'r', 'l', 's')):
                    if len(out) == 3 and out.startswith(('bk', 'sk', 'br', 'gr', 'kr', 'pr', 'tr', 'dr', 'ky', 'py', 'my', 'khy', 'phy', 'by')):
                        out += 'a'
                    else:
                        out = out[:-1] + 'a' + out[-1]
                else:
                    out += 'a'
    return out

def unicode_to_wylie(tibetan_text):
    sylls = re.split(r'(་|།|\s+)', tibetan_text)
    res = []
    for s in sylls:
        if s == '་':
            res.append(' ')
        elif s == '།':
            res.append(' / ')
        elif s in [' ', '\n', '\t']:
            res.append(s)
        elif s:
            w = unicode_syllable_to_wylie(s)
            res.append(w)
    raw_wylie = "".join(res).strip()
    
    # Hyphenate common compound words & grammatical units in Wylie
    compound_patterns = [
        (r'\bbkra\s+shis\s+bde\s+legs\b', 'bkra-shis bde-legs'),
        (r'\bbkra\s+shis\b', 'bkra-shis'),
        (r'\bbde\s+legs\b', 'bde-legs'),
        (r'\bkhyed\s+rang\s+gi\b', 'khyed-rang-gi'),
        (r'\bkhyed\s+rang\s+tsho\b', 'khyed-rang-tsho'),
        (r'\bkhyed\s+rang\b', 'khyed-rang'),
        (r'\bkhong\s+tsho\'i\b', 'khong-tsho\'i'),
        (r'\bkhong\s+tsho\b', 'khong-tsho'),
        (r'\bkhong\s+gi\b', 'khong-gi'),
        (r'\bnga\s+tsho\b', 'nga-tsho'),
        (r'\bnga\s+rang\b', 'nga-rang'),
        (r'\bslob\s+phrug\b', 'slob-phrug'),
        (r'\bslob\s+ma\b', 'slob-ma'),
        (r'\bslob\s+deb\b', 'slob-deb'),
        (r'\bslob\s+grwa\b', 'slob-grwa'),
        (r'\bslob\s+dpon\b', 'slob-dpon'),
        (r'\bslob\s+gnyer\b', 'slob-gnyer'),
        (r'\bdge\s+rgan\b', 'dge-rgan'),
        (r'\bnang\s+mi\b', 'nang-mi'),
        (r'\bnang\s+la\b', 'nang-la'),
        (r'\bpa\s+lags\b', 'pa-lags'),
        (r'\ba\s+ma\s+lags\b', 'a-ma-lags'),
        (r'\ba\s+ma\b', 'a-ma'),
        (r'\bpha\s+ma\b', 'pha-ma'),
        (r'\ba\s+cag\b', 'a-cag'),
        (r'\bco\s+co\b', 'co-co'),
        (r'\bkhyo\s+ga\b', 'khyo-ga'),
        (r'\bskyes\s+dman\b', 'skyes-dman'),
        (r'\bbu\s+mo\b', 'bu-mo'),
        (r'\bphru\s+gu\b', 'phru-gu'),
        (r'\bpu\s+gu\b', 'pu-gu'),
        (r'\bsgrol\s+dkar\b', 'sgrol-dkar'),
        (r'\brdo\s+rje\b', 'rdo-rje'),
        (r'\bbod\s+pa\b', 'bod-pa'),
        (r'\bbod\s+skad\b', 'bod-skad'),
        (r'\bbod\s+yig\b', 'bod-yig'),
        (r'\brgya\s+gar\s+pa\b', 'rgya-gar-pa'),
        (r'\brgya\s+gar\b', 'rgya-gar'),
        (r'\bphyi\s+rgyal\b', 'phyi-rgyal'),
        (r'\bzhi\s+mi\b', 'zhi-mi'),
        (r'\bnyi\s+ma\b', 'nyi-ma'),
        (r'\bzhwa\s+mo\b', 'zhwa-mo'),
        (r'\blam\s+kha\b', 'lam-kha'),
        (r'\bdpe\s+cha\b', 'dpe-cha'),
        (r'\bcog\s+tse\b', 'cog-tse'),
        (r'\brkub\s+kyag\b', 'rkub-kyag'),
        (r'\bnyal\s+khri\b', 'nyal-khri'),
        (r'\bca\s+lag\b', 'ca-lag'),
        (r'\bchen\s+po\b', 'chen-po'),
        (r'\bchung\s+chung\b', 'chung-chung'),
        (r'\bmang\s+po\b', 'mang-po'),
        (r'\bnyung\s+nyung\b', 'nyung-nyung'),
        (r'\byag\s+po\b', 'yag-po'),
        (r'\bsdug\s+po\b', 'sdug-po'),
        (r'\bskyid\s+po\b', 'skyid-po'),
        (r'\byod\s+ma\s+red\b', 'yod-ma-red'),
        (r'\byod\s+red\b', 'yod-red'),
        (r'\byin\s+pas\b', 'yin-pas'),
        (r'\bred\s+pas\b', 'red-pas'),
        (r'\byod\s+pas\b', 'yod-pas'),
        (r'\bma\s+red\b', 'ma-red'),
        (r'\bmi\s+\'dug\b', 'mi-\'dug'),
        (r'\blags\s+so\b', 'lags-so'),
        (r'\bga\s+re\b', 'ga-re'),
        (r'\bga\s+nas\b', 'ga-nas'),
        (r'\bga\s+par\b', 'ga-par'),
        (r'\bga\s+tshod\b', 'ga-tshod'),
        (r'\b\'di\s+tsho\b', '\'di-tsho'),
        (r'\bde\s+tsho\b', 'de-tsho'),
        (r'\bdbyangs\s+bzhi\b', 'dbyangs-bzhi'),
        (r'\bgsal\s+byed\s+sum\s+cu\b', 'gsal-byed sum-cu'),
        (r'\bgsal\s+byed\b', 'gsal-byed'),
        (r'\bsangs\s+rgyas\b', 'sangs-rgyas'),
        (r'\bdge\s+\'dun\b', 'dge-\'dun'),
        (r'\bbla\s+ma\b', 'bla-ma'),
        (r'\bbyang\s+chub\s+sems\b', 'byang-chub-sems'),
        (r'\bstong\s+pa\s+nyid\b', 'stong-pa-nyid'),
        (r'\bsnying\s+rje\b', 'snying-rje')
    ]
    
    for pat, rep in compound_patterns:
        raw_wylie = re.sub(pat, rep, raw_wylie)
        
    return raw_wylie

def decompose_syllable(syllable):
    s = syllable.replace('་', '').replace('།', '').strip()
    if not s:
        return None
    chars = list(s)
    
    vowel_char = None
    vowel_info = None
    for ch in chars:
        if ch in VOWEL_DESCS:
            vowel_char = ch
            vowel_info = VOWEL_DESCS[ch]
            break

    sub_char = None
    for ch in chars:
        if ch in SUBJOINED_MAP:
            sub_char = ch
            break

    base_chars = [ch for ch in chars if ch in CONSONANT_MAP]
    
    prefix = None
    superscript = None
    root = None
    subscript = sub_char
    suffix = None
    post_suffix = None

    if len(base_chars) == 1:
        root = base_chars[0]
    elif len(base_chars) == 2:
        if sub_char:
            if base_chars[0] in PREFIXES:
                prefix = base_chars[0]
                root = base_chars[1]
            else:
                root = base_chars[0]
        elif vowel_char:
            root = base_chars[0]
            if base_chars[1] in SUFFIXES:
                suffix = base_chars[1]
        elif base_chars[0] in PREFIXES and base_chars[1] not in SUFFIXES:
            prefix = base_chars[0]
            root = base_chars[1]
        elif base_chars[1] in SUFFIXES:
            root = base_chars[0]
            suffix = base_chars[1]
        else:
            root = base_chars[0]
            suffix = base_chars[1]
    elif len(base_chars) == 3:
        if sub_char:
            prefix = base_chars[0]
            root = base_chars[1]
        elif base_chars[0] in SUPERSCRIPTS and base_chars[1] in CONSONANT_MAP and base_chars[2] in SUFFIXES:
            superscript = base_chars[0]
            root = base_chars[1]
            suffix = base_chars[2]
        elif base_chars[0] in PREFIXES and base_chars[2] in SUFFIXES:
            prefix = base_chars[0]
            root = base_chars[1]
            suffix = base_chars[2]
        else:
            root = base_chars[0]
            suffix = base_chars[1]
            post_suffix = base_chars[2]
    elif len(base_chars) >= 4:
        if base_chars[0] in PREFIXES:
            prefix = base_chars[0]
            if len(base_chars) > 1 and base_chars[1] in SUPERSCRIPTS:
                superscript = base_chars[1]
                root = base_chars[2] if len(base_chars) > 2 else base_chars[1]
                if len(base_chars) > 3:
                    suffix = base_chars[3]
                if len(base_chars) > 4:
                    post_suffix = base_chars[4]
            else:
                root = base_chars[1]
                if len(base_chars) > 2:
                    suffix = base_chars[2]
                if len(base_chars) > 3:
                    post_suffix = base_chars[3]
        else:
            superscript = base_chars[0]
            root = base_chars[1]
            suffix = base_chars[2]
            if len(base_chars) > 3:
                post_suffix = base_chars[3]

    if not root and base_chars:
        root = base_chars[0]

    # --- Intuitive Step-by-Step Monastic Spelling Construction ---
    steps = []
    root_latin = {
        'ཀ': 'Ka', 'ཁ': 'Kha', 'ག': 'Ga', 'ང': 'Nga',
        'ཅ': 'Ca', 'ཆ': 'Cha', 'ཇ': 'Ja', 'ཉ': 'Nya',
        'ཏ': 'Ta', 'ཐ': 'Tha', 'ད': 'Da', 'ན': 'Na',
        'པ': 'Pa', 'ཕ': 'Pha', 'བ': 'Ba', 'མ': 'Ma',
        'ཙ': 'Tsa', 'ཚ': 'Tsha', 'ཛ': 'Dza', 'ཝ': 'Wa',
        'ཞ': 'Zha', 'ཟ': 'Za', 'འ': "'A", 'ཡ': 'Ya',
        'ར': 'Ra', 'ལ': 'La', 'ཤ': 'Sha', 'ས': 'Sa',
        'ཧ': 'Ha', 'ཨ': 'A'
    }.get(root, 'Ka')

    curr_sound = root_latin

    # Step 1: Root and Subscript / Superscript
    if subscript == 'ྱ': # Ya-ta
        mapped = {'Ka': 'Cha (cao)', 'Kha': 'Cha (bật hơi)', 'Ga': 'Ja (trầm)', 'Pa': 'Cha (cao)', 'Pha': 'Cha (bật hơi)', 'Ba': 'Ja (trầm)', 'Ma': 'Nya (trầm)'}.get(root_latin, root_latin + '-ya')
        steps.append(f"📌 Bước 1 (Ghép chân Ya-ta ྱ): Chữ gốc {root} ({root_latin}) ghép chân Ya ➔ Biến thành âm **{mapped}**")
        curr_sound = mapped.split(' ')[0]
    elif subscript == 'ྲ': # Ra-ta
        mapped = {'Ka': 'Tra (cao)', 'Kha': 'Thra (bật hơi)', 'Ga': 'Dra (trầm)', 'Ta': 'Tra (cao)', 'Tha': 'Thra (bật hơi)', 'Da': 'Dra (trầm)', 'Pa': 'Tra (cao)', 'Pha': 'Thra (bật hơi)', 'Ba': 'Dra (trầm)', 'Ma': 'Mra (trầm)', 'Sa': 'Tra (cao)', 'Ha': 'Hra (cao)'}.get(root_latin, 'Tra')
        steps.append(f"📌 Bước 1 (Ghép chân Ra-ta ྲ): Chữ gốc {root} ({root_latin}) ghép chân Ra ➔ Chuyển thành âm uốn lưỡi **{mapped}**")
        curr_sound = mapped.split(' ')[0]
    elif subscript == 'ླ': # La-ta
        steps.append(f"📌 Bước 1 (Ghép chân La-ta ླ): Chữ gốc {root} ({root_latin}) ghép chân La ➔ Đọc là **La (thanh cao)**")
        curr_sound = 'La'
    elif subscript == 'ྭ': # Wa-zur
        steps.append(f"📌 Bước 1 (Góc Wa-zur ྭ): Chữ gốc {root} ({root_latin}) gắn góc Wa ➔ Tròn môi giữ nguyên âm **{root_latin}**")
        curr_sound = root_latin
    elif superscript: # Superscript
        sup_name = {'ར': 'Ra', 'ལ': 'La', 'ས': 'Sa'}.get(superscript, superscript)
        steps.append(f"📌 Bước 1 (Chữ đội đầu {superscript}): Chữ {superscript} ({sup_name}) đội trên đầu {root} ({root_latin}) ➔ Vẫn đọc là **{root_latin}** (giữ thanh cao)")
        curr_sound = root_latin
    else:
        steps.append(f"📌 Bước 1 (Căn tự gốc {root}): Đọc phụ âm gốc là **{root_latin}**")
        curr_sound = root_latin

    # Step 2: Vowels
    vowel_names = {
        'ི': ('Gi-gu', 'i', 'đổi sang âm [i]'),
        'ུ': ('Zhabs-kyu', 'u', 'đổi sang âm [u]'),
        'ེ': ("'Greng-bu", 'e', 'đổi sang âm [e]'),
        'ོ': ('Na-ro', 'o', 'đổi sang âm [o]')
    }
    if vowel_char and vowel_char in vowel_names:
        v_name, v_char, v_desc = vowel_names[vowel_char]
        base_stem = curr_sound.rstrip('aeou')
        if not base_stem: base_stem = curr_sound
        new_stem = base_stem + v_char
        steps.append(f"📌 Bước 2 (Dấu nguyên âm {vowel_char}): Gắn dấu {v_name} ➔ {v_desc} thành **{new_stem.capitalize()}**")
        curr_sound = new_stem.capitalize()
    else:
        steps.append("📌 Bước 2 (Nguyên âm): Không có dấu phụ, mang nguyên âm tự nhiên **[a]**")

    # Step 3: Prefix
    if prefix:
        p_name = {'ག': 'Ga', 'ད': 'Da', 'བ': 'Ba', 'མ': 'Ma', 'འ': "'A"}.get(prefix, prefix)
        steps.append(f"📌 Bước 3 (Tiền tự đứng trước {prefix}): Chữ {prefix} ({p_name}) đứng đầu không phát âm thành tiếng, chỉ làm nhiệm vụ giữ âm **{curr_sound}** ổn định, dứt khoát")

    # Step 4: Suffix
    suffix_rules = {
        'ག': ('Ga', 'khép nghẹn cuống họng', 'k'),
        'ང': ('Nga', 'ngân âm mũi ở cuối', 'ng'),
        'ད': ('Da', 'biến âm (a->e, o->ö, u->ü) và chặn đầu lưỡi', 't'),
        'ན': ('Na', 'biến âm và ngân âm mũi N', 'n'),
        'བ': ('Ba', 'khép chặt hai môi lại ở cuối vần', 'p'),
        'མ': ('Ma', 'khép môi ngân âm mũi M', 'm'),
        'འ': ("'A", 'kéo dài âm', ''),
        'ར': ('Ra', 'uốn nhẹ đầu lưỡi ở cuối âm', 'r'),
        'ལ': ('La', 'biến âm và nâng đầu lưỡi chạm ngạc', 'l'),
        'ས': ('Sa', 'biến âm (a->e, o->ö, u->ü) và ngắt dứt khoát', 'k / s')
    }
    if suffix and suffix in suffix_rules:
        s_name, s_desc, s_end = suffix_rules[suffix]
        steps.append(f"📌 Bước 4 (Hậu tự đứng sau {suffix}): Chữ đuôi {suffix} ({s_name}) ➔ {s_desc} (kết thúc vần **-{s_end}**)")

    return {
        "syllable": s,
        "wylie": unicode_syllable_to_wylie(s),
        "prefix": prefix,
        "superscript": superscript,
        "root": root,
        "subscript": subscript,
        "vowel": vowel_info[0] if vowel_info else "a",
        "vowel_desc": vowel_info[1] if vowel_info else "Âm A mặc định",
        "suffix": suffix,
        "post_suffix": post_suffix,
        "spelling_steps": steps
    }

DICTIONARY_DB = {
    # --- 30 PHỤ ÂM CĂN BẢN (30 CONSONANTS) ---
    "ཀ": {
        "vn": "Phụ âm Ka [ka] (Âm vòm họng cao, không bật hơi)",
        "pos": "Căn tự gốc (Phụ âm thứ 1)",
        "wylie": "ka",
        "usage": "Âm đầu tiên trong 30 phụ âm Tạng. Cột 1 (Âm cao không bật hơi). Gốc lưỡi chạm ngạc mềm.",
        "buddhist": "Chủng tự khởi đầu của trí tuệ thanh tịnh bản nguyên (Ka-dag - Bản sơ thanh tịnh trong Đại Toàn Thiện Dzogchen)."
    },
    "ཁ": {
        "vn": "Phụ âm Kha [kʰa] (Âm vòm họng cao, bật hơi mạnh) / Miệng, bề mặt",
        "pos": "Căn tự gốc (Phụ âm thứ 2) / Danh từ",
        "wylie": "kha",
        "usage": "Cột 2 (Âm cao bật hơi). Khẩu hình như ཀ nhưng đẩy luồng hơi mạnh từ cuống họng.",
        "buddhist": "Đại diện cho khẩu nghiệp thanh tịnh và pháp âm vi diệu."
    },
    "ག": {
        "vn": "Phụ âm Ga [kà / ɡà] (Âm vòm họng trầm, hạ giọng)",
        "pos": "Căn tự gốc (Phụ âm thứ 3) / Tiền tự / Hậu tự",
        "wylie": "ga",
        "usage": "Cột 3 (Âm trầm). Làm tiền tự (trong གདོང་) hoặc hậu tự (trong བཀྲ་ཤིས་རྟགས).",
        "buddhist": "Âm thanh trầm lắng mang ý nghĩa bảo hộ và an trụ trong chánh niệm."
    },
    "ང": {
        "vn": "Phụ âm Nga [ŋà] (Âm mũi họng trầm) / Tôi, bản thân tôi",
        "pos": "Căn tự gốc (Phụ âm thứ 4) / Đại từ nhân xưng ngôi 1",
        "wylie": "nga",
        "usage": "Cột 4 (Âm mũi). Có thể đứng một mình làm đại từ 'Tôi / Ngã' (ví dụ: nga bod pa yin - Tôi là người Tạng).",
        "buddhist": "Quán chiếu vô ngã (བདག་མེད - Anatman) để phá trừ sự chấp trước vào cái 'Tôi' (nga)."
    },
    "ཅ": {
        "vn": "Phụ âm Ca [tɕa] (Âm vòm cứng cao, không bật hơi)",
        "pos": "Căn tự gốc (Phụ âm thứ 5)",
        "wylie": "ca",
        "usage": "Hàng 2 Cột 1. Mặt lưỡi ép sát ngạc cứng, phát âm dứt khoát không có hơi gió.",
        "buddhist": "Âm thanh sáng tỏ của tuệ giác."
    },
    "ཆ": {
        "vn": "Phụ âm Cha [tɕʰa] (Âm vòm cứng cao, bật hơi mạnh) / Nước, phân nửa",
        "pos": "Căn tự gốc (Phụ âm thứ 6) / Danh từ (ཆུ - Nước)",
        "wylie": "cha",
        "usage": "Hàng 2 Cột 2. Mặt lưỡi áp ngạc cứng và bật luồng hơi mạnh ra ngoài.",
        "buddhist": "Thanh tịnh hóa thủy đại trong vũ trụ và nội tâm."
    },
    "ཇ": {
        "vn": "Phụ âm Ja [tɕà / dʑà] (Âm vòm cứng trầm) / Trà, nước trà",
        "pos": "Căn tự gốc (Phụ âm thứ 7) / Danh từ (Trà bơ Tạng)",
        "wylie": "ja",
        "usage": "Hàng 2 Cột 3. Âm vòm hạ giọng trầm. Trong văn hóa Tạng, ཇ (Ja) là thức uống trà bơ truyền thống.",
        "buddhist": "Gắn liền với nghi thức cúng dường trà (Ja-chö) trong các tu viện Tạng truyền."
    },
    "ཉ": {
        "vn": "Phụ âm Nya [ɲà] (Âm mũi vòm trầm) / Con cá (Fish)",
        "pos": "Căn tự gốc (Phụ âm thứ 8) / Danh từ",
        "wylie": "nya",
        "usage": "Hàng 2 Cột 4. Phát âm bằng mũi qua vòm miệng trên.",
        "buddhist": "Con cá vàng (gser nya) - Một trong Bát Cát Tường tượng trưng cho sự tự do tự tại thoát khỏi biển khổ luân hồi."
    },
    "ཏ": {
        "vn": "Phụ âm Ta [ta] (Âm đầu lưỡi răng cao, không bật hơi)",
        "pos": "Căn tự gốc (Phụ âm thứ 9)",
        "wylie": "ta",
        "usage": "Hàng 3 Cột 1. Đầu lưỡi chạm mặt trong răng cửa trên, âm dứt khoát.",
        "buddhist": "Âm thanh chân thật của chánh định."
    },
    "ཐ": {
        "vn": "Phụ âm Tha [tʰa] (Âm đầu lưỡi răng cao, bật hơi mạnh)",
        "pos": "Căn tự gốc (Phụ âm thứ 10)",
        "wylie": "tha",
        "usage": "Hàng 3 Cột 2. Đầu lưỡi chạm răng trên và bật hơi mạnh ra ngoài.",
        "buddhist": "Chủng tự biểu trưng cho sự đoạn trừ chấp thủ nhị biên."
    },
    "ད": {
        "vn": "Phụ âm Da [tà / dà] (Âm đầu lưỡi răng trầm)",
        "pos": "Căn tự gốc (Phụ âm thứ 11) / Tiền tự / Hậu tự",
        "wylie": "da",
        "usage": "Hàng 3 Cột 3. Âm răng hạ giọng. Đóng vai trò cực kỳ quan trọng làm tiền tự và hậu tự (biến âm).",
        "buddhist": "Chữ cái đầu của từ དམ་ཆོས (Dam-chö: Chánh Pháp tối thượng)."
    },
    "ན": {
        "vn": "Phụ âm Na [nà] (Âm mũi răng trầm) / Ốm, đau, bệnh tật",
        "pos": "Căn tự gốc (Phụ âm thứ 12) / Hậu tự / Động từ",
        "wylie": "na",
        "usage": "Hàng 3 Cột 4. Phát âm âm mũi răng trầm. Có thể làm trợ từ chỉ thời gian / điều kiện (nếu).",
        "buddhist": "Quán chiếu nỗi khổ đau của bệnh tật (Na-tsa) để khởi sinh tâm từ bi xót thương muôn loài."
    },
    "པ": {
        "vn": "Phụ âm Pa [pa] (Âm môi khép cao, không bật hơi)",
        "pos": "Căn tự gốc (Phụ âm thứ 13) / Hậu tố danh từ hóa",
        "wylie": "pa",
        "usage": "Hàng 4 Cột 1. Hai môi khép chặt rồi mở dứt khoát. Thường dùng làm hậu tố chỉ người hoặc sự việc (ví dụ: bod-pa - người Tạng).",
        "buddhist": "Chủng tự của Bát Nhã Ba La Mật Đa (Prajnaparamita - Pha rol tu phyin pa)."
    },
    "ཕ": {
        "vn": "Phụ âm Pha [pʰa] (Âm môi khép cao, bật hơi mạnh) / Người cha",
        "pos": "Căn tự gốc (Phụ âm thứ 14) / Danh từ (Pha: Cha)",
        "wylie": "pha",
        "usage": "Hàng 4 Cột 2. Hai môi khép và bật luồng gió mạnh ra ngoài.",
        "buddhist": "Biểu trưng cho Phụ tánh Từ bi và Phương tiện thiện xảo (Upaya)."
    },
    "བ": {
        "vn": "Phụ âm Ba [pà / bà] (Âm môi trầm) / Con bò / Đi, làm",
        "pos": "Căn tự gốc (Phụ âm thứ 15) / Tiền tự / Hậu tự / Động từ",
        "wylie": "ba",
        "usage": "Hàng 4 Cột 3. Làm tiền tự cho hàng loạt động từ và hậu tố danh từ (Ba/Wa).",
        "buddhist": "Chữ cái đầu của Bodhicitta (Bồ Đề Tâm) và Bodhisattva (Bồ Tát)."
    },
    "མ": {
        "vn": "Phụ âm Ma [mà] (Âm mũi môi trầm) / Người Mẹ / Trợ từ phủ định",
        "pos": "Căn tự gốc (Phụ âm thứ 16) / Danh từ / Tiền tự / Hậu tự / Phủ định từ",
        "wylie": "ma",
        "usage": "Hàng 4 Cột 4. Phát âm âm môi mũi. Đứng trước động từ mang nghĩa phủ định quá khứ / mệnh lệnh (ví dụ: ma byed - đừng làm).",
        "buddhist": "Biểu trưng cho Mẫu tánh Trí Tuệ Ba-la-mật, người mẹ sinh ra chư Phật mười phương."
    },
    "ཙ": {
        "vn": "Phụ âm Tsa [tsa] (Âm tắc xát đầu lưỡi cao, không bật hơi)",
        "pos": "Căn tự gốc (Phụ âm thứ 17)",
        "wylie": "tsa",
        "usage": "Hàng 5 Cột 1. Đầu lưỡi chạm chân răng tạo luồng ma sát khép kín không bật hơi.",
        "buddhist": "Chủng tự vi diệu trong hệ thống kinh điển Mật chú."
    },
    "ཚ": {
        "vn": "Phụ âm Tsha [tsʰa] (Âm tắc xát đầu lưỡi cao, bật hơi mạnh) / Nóng, mặn, muối",
        "pos": "Căn tự gốc (Phụ âm thứ 18) / Tính từ / Danh từ",
        "wylie": "tsha",
        "usage": "Hàng 5 Cột 2. Khẩu hình như ཙ nhưng đẩy luồng hơi ma sát mạnh qua kẽ răng.",
        "buddhist": "Tịnh hóa ngọn lửa phiền não sân hận và nhiệt não trong tâm."
    },
    "ཛ": {
        "vn": "Phụ âm Dza [tsà / dzà] (Âm tắc xát đầu lưỡi trầm)",
        "pos": "Căn tự gốc (Phụ âm thứ 19)",
        "wylie": "dza",
        "usage": "Hàng 5 Cột 3. Âm tắc xát hạ giọng trầm.",
        "buddhist": "Xuất hiện trong câu chú triệu thỉnh kim cương (DZA HUM BAM HO)."
    },
    "ཝ": {
        "vn": "Phụ âm Wa [wà] (Âm môi răng trầm) / Con cáo (Fox)",
        "pos": "Căn tự gốc (Phụ âm thứ 20) / Chân chữ Wa-zur (ྭ)",
        "wylie": "wa",
        "usage": "Hàng 5 Cột 4. Phát âm mềm ở môi răng. Dùng làm chân chữ phụ Wa-zur (ྭ) để giữ nguyên âm gốc.",
        "buddhist": "Âm chuyển êm dịu trong ngữ âm kinh điển."
    },
    "ཞ": {
        "vn": "Phụ âm Zha [ɕà / ʑà] (Âm xát vòm trầm) / Chiếc mũ, nón",
        "pos": "Căn tự gốc (Phụ âm thứ 21) / Danh từ",
        "wylie": "zha",
        "usage": "Hàng 6 Cột 1. Uốn lưỡi nhẹ sát vòm họng và phát âm xát trầm.",
        "buddhist": "Chữ cái đầu của mũ pandita (zhva mo) mà chư vị Đại Đạo sư Tây Tạng thường đội trong các pháp hội."
    },
    "ཟ": {
        "vn": "Phụ âm Za [sà / zà] (Âm xát răng trầm) / Ăn, ẩm thực, thức ăn",
        "pos": "Căn tự gốc (Phụ âm thứ 22) / Động từ / Danh từ",
        "wylie": "za",
        "usage": "Hàng 6 Cột 2. Răng khép nhẹ phát âm xát hạ giọng. Động từ ăn uống hàng ngày.",
        "buddhist": "Quán tưởng cúng dường thực phẩm (Zas-kyi mchod-pa) thanh tịnh trước khi thọ dụng."
    },
    "འ": {
        "vn": "Phụ âm 'A (A-chung / A-thở) [ʔà] (Âm thanh môn trầm nhẹ)",
        "pos": "Căn tự gốc (Phụ âm thứ 23) / Tiền tự / Hậu tự / Chân chữ ghép",
        "wylie": "'a",
        "usage": "Hàng 6 Cột 3. Đóng vai trò cực kỳ then chốt trong cấu trúc âm vị học tiếng Tạng (làm tiền tự འ, hậu tự འ và dấu sở hữu cách འི་).",
        "buddhist": "Đại diện cho âm thanh tự nhiên của Pháp Giới (Dharmadhatu) khởi sinh không gián đoạn."
    },
    "ཡ": {
        "vn": "Phụ âm Ya [jà] (Bán nguyên âm vòm trầm) / Phía trên",
        "pos": "Căn tự gốc (Phụ âm thứ 24) / Chân chữ Ya-tags (ྱ)",
        "wylie": "ya",
        "usage": "Hàng 6 Cột 4. Làm chân chữ Ya-tags (ྱ) ghép dưới 7 phụ âm chính để tạo các âm vòm như KYA, KHYA, GYA, PYA, PHYA, BYA, MYA.",
        "buddhist": "Tượng trưng cho sự câu hội và nâng đỡ tâm thức hướng thượng."
    },
    "ར": {
        "vn": "Phụ âm Ra [ra] (Âm rung nhẹ đầu lưỡi) / Con dê, sừng",
        "pos": "Căn tự gốc (Phụ âm thứ 25) / Đầu chữ Ra-go (རྐ) / Chân chữ Ra-tags (ྲ) / Hậu tự",
        "wylie": "ra",
        "usage": "Hàng 7 Cột 1. Rung nhẹ đầu lưỡi. Là một trong những chữ cái linh hoạt nhất: đứng trên (Ra-go), đứng dưới (Ra-tags) và đứng sau (Hậu tự đổi vần).",
        "buddhist": "Âm thanh thanh tịnh rực rỡ tượng trưng cho ngọn lửa trí tuệ thiêu đốt vô minh."
    },
    "ལ": {
        "vn": "Phụ âm La [la] (Âm cạnh lưỡi) / Con đèo, ngọn đèo / Trợ từ vị trí 'ở, tại, đến'",
        "pos": "Căn tự gốc (Phụ âm thứ 26) / Đầu chữ La-go (ལྐ) / Chân chữ La-tags (ླ) / Trợ từ cách",
        "wylie": "la",
        "usage": "Hàng 7 Cột 2. Đầu lưỡi áp chân răng trên, luồng hơi thoát ra hai bên cạnh lưỡi. Làm trợ từ vị trí cách (La-don) cực kỳ thông dụng.",
        "buddhist": "Gắn liền với hình ảnh các đèo núi linh thiêng tại Tây Tạng nơi treo cờ kinh Phong Mã (Lungta)."
    },
    "ཤ": {
        "vn": "Phụ âm Sha [ɕa] (Âm xát vòm cao) / Thịt, thân thể, xác thịt",
        "pos": "Căn tự gốc (Phụ âm thứ 27) / Hậu tự",
        "wylie": "sha",
        "usage": "Hàng 7 Cột 3. Mặt lưỡi nâng cao về phía vòm họng, phát âm xát nhẹ thanh cao.",
        "buddhist": "Chữ cái đầu của ngài Thích Ca Mâu Ni (Sha-kya Thub-pa)."
    },
    "ས": {
        "vn": "Phụ âm Sa [sa] (Âm xát răng cao) / Đất, mặt đất, địa cầu, cõi, nơi chốn",
        "pos": "Căn tự gốc (Phụ âm thứ 28) / Đầu chữ Sa-go (སྐ) / Hậu tự / Hậu-hậu tự",
        "wylie": "sa",
        "usage": "Hàng 7 Cột 4. Hai hàm răng khép gần nhau, phát âm xát thanh cao. Đóng vai trò chữ đội trên đầu (Sa-go) và hậu tự đổi nguyên âm.",
        "buddhist": "Chữ cái đầu của 10 Địa Bồ Tát (Thập Địa - Sa bcu) trên con đường tiến tu thành Phật."
    },
    "ཧ": {
        "vn": "Phụ âm Ha [ha] (Âm thanh môn cao) / Hơi thở, sự ngạc nhiên",
        "pos": "Căn tự gốc (Phụ âm thứ 29) / Đầu chữ Ha-go (ཧྲ)",
        "wylie": "ha",
        "usage": "Hàng 8 Cột 1. Luồng hơi mở tự do từ thanh môn với thanh điệu cao.",
        "buddhist": "Chủng tự xua tan chướng ngại và tiếng cười hoan hỷ của chư Hộ Pháp (HA HA HA)."
    },
    "ཨ": {
        "vn": "Nguyên âm gốc A [a] (Chủng tự A tối thượng thanh tịnh, vô sinh bất diệt)",
        "pos": "Căn tự gốc (Phụ âm thứ 30) / Mẹ của vạn âm",
        "wylie": "a",
        "usage": "Chữ cái cuối cùng của 30 căn tự Tạng. Đại diện cho âm A nguyên thủy vốn có sẵn trong mọi phụ âm.",
        "buddhist": "Chủng tự tối thượng trong Mật Thừa (Dzogchen & Mahamudra): Tượng trưng cho Tánh Giác Bổn Nguyên Không Sinh Không Diệt (A-kye-ba med-pa)."
    },

    # --- 4 NGUYÊN ÂM TIẾNG TẠNG ---
    "ི": {
        "vn": "Nguyên âm I (Gi-gu གི་གུ - Dấu mũ vòng trên đầu)",
        "pos": "Nguyên âm thứ 1",
        "wylie": "i",
        "usage": "Dấu móc cong trên đầu chữ cái biến âm 'a' thành âm 'i' (ví dụ: ཀ ka + ི = ཀི ki).",
        "buddhist": "Chuyển hóa âm thanh thanh tịnh."
    },
    "ུ": {
        "vn": "Nguyên âm U (Zhabs-kyu ཞབས་ཀྱུ - Dấu chân móc dưới)",
        "pos": "Nguyên âm thứ 2",
        "wylie": "u",
        "usage": "Dấu móc cong dưới chân chữ cái biến âm 'a' thành âm 'u' (ví dụ: ཀ ka + ུ = ཀུ ku).",
        "buddhist": "Tượng trưng cho sự nương tựa vững chãi nơi Pháp giới."
    },
    "ེ": {
        "vn": "Nguyên âm E ('Greng-bu འགྲེང་བུ - Dấu nghiêng trên đầu)",
        "pos": "Nguyên âm thứ 3",
        "wylie": "e",
        "usage": "Dấu phẩy nghiêng trên đầu chữ cái biến âm 'a' thành âm 'e' (ví dụ: ཀ ka + ེ = ཀེ ke).",
        "buddhist": "Âm thanh khai mở tuệ giác."
    },
    "ོ": {
        "vn": "Nguyên âm O (Na-ro ན་རོ - Dấu sừng đôi trên đầu)",
        "pos": "Nguyên âm thứ 4",
        "wylie": "o",
        "usage": "Dấu hai nhánh trên đầu chữ cái biến âm 'a' thành âm 'o' (ví dụ: ཀ ka + ོ = ཀོ ko).",
        "buddhist": "Biểu trưng cho sự viên mãn trọn vẹn của vạn pháp."
    },

    # --- TỪ VỰNG GIAO TIẾP & NGỮ PHÁP SÁCH SARA ---
    "སོ": {
        "vn": "Răng, cái răng (Tooth) / Hàng chục trong số đếm (như so-gcig 31) / Bản thân, riêng rẽ",
        "pos": "Danh từ / Hậu tố số đếm",
        "wylie": "so",
        "usage": "Trong bài học 4 nguyên âm: ས (Sa) + ོ (Naro) = སོ (So: Cái răng - hình vẽ hàm răng trong sách).",
        "buddhist": "Hình ảnh quán chiếu thân thể bất tịnh và vô thường."
    },
    "ཞི་མི": {
        "vn": "Con mèo (Cat)",
        "pos": "Danh từ",
        "wylie": "zhi mi",
        "usage": "Con mèo trong hình minh họa bài học nguyên âm.",
        "buddhist": "Loài hữu tình trong cõi súc sinh cần được yêu thương và bảo hộ."
    },
    "ཉི་མ": {
        "vn": "Mặt trời, ánh nắng, ban ngày, ngày (Sun)",
        "pos": "Danh từ",
        "wylie": "nyi ma",
        "usage": "Mặt trời trong hình minh họa bài học nguyên âm.",
        "buddhist": "Tượng trưng cho Tuệ giác Bát Nhã soi sáng xua tan bóng tối vô minh."
    },
    "བཀྲ་ཤིས": {
        "vn": "Cát tường, may mắn, tốt lành (Tashi)",
        "pos": "Tính từ / Danh từ",
        "wylie": "bkra shis",
        "usage": "Dùng trong câu chào: བཀྲ་ཤིས་བདེ་ལེགས (Tashi Delek). Thường đặt đầu các bài tụng để nguyện cầu sự cát tường.",
        "buddhist": "Xuất hiện khắp kinh điển và nghi lễ: 'Bát Cát Tường' (8 biểu tượng may mắn)."
    },
    "བཀྲ་ཤིས་བདེ་ལེགས": {
        "vn": "Xin chào / Chúc cát tường, bình an và hạnh phúc trọn vẹn",
        "pos": "Thành ngữ chào hỏi",
        "wylie": "bkra shis bde legs",
        "usage": "Lời chào mở đầu mọi cuộc gặp gỡ của người Tây Tạng và các hành giả Phật giáo.",
        "buddhist": "Kết hợp giữa Cát Tường (བཀྲ་ཤིས) và An Lạc Viên Mãn (བདེ་ལེགས)."
    },
    "བདེ་ལེགས": {
        "vn": "An lành, hạnh phúc, mọi sự tốt đẹp (Delek)",
        "pos": "Tính từ chúc phúc",
        "wylie": "bde legs",
        "usage": "Thành tố trong lời chào Tashi Delek.",
        "buddhist": "Sự an lạc phát xuất từ tâm thanh tịnh."
    },
    "བོད": {
        "vn": "Tây Tạng, xứ Tuyết (Bod / Tibet)",
        "pos": "Danh từ riêng / Địa danh",
        "wylie": "bod",
        "usage": "Tên gọi tự nhiên của đất nước và dân tộc Tây Tạng.",
        "buddhist": "Xứ sở linh thiêng của Đức Quán Thế Âm (Avalokiteshvara)."
    },
    "བོད་པ": {
        "vn": "Người Tây Tạng",
        "pos": "Danh từ chỉ người",
        "wylie": "bod pa",
        "usage": "Chỉ cư dân hoặc người mang dòng dõi Tây Tạng.",
        "buddhist": "Những người gìn giữ kho tàng Phật giáo Kim Cương Thừa."
    },
    "བོད་ཡིག": {
        "vn": "Tiếng Tạng, Văn tự chữ Tạng",
        "pos": "Danh từ",
        "wylie": "bod yig",
        "usage": "Ngôn ngữ và chữ viết truyền thống của Tây Tạng.",
        "buddhist": "Ngôn ngữ bảo tồn hoàn chỉnh nhất hệ thống Kinh luận Phật giáo Đại thừa & Kim Cương thừa."
    },
    "བོད་སྐད": {
        "vn": "Tiếng nói / Khẩu ngữ Tây Tạng",
        "pos": "Danh từ",
        "wylie": "bod skad",
        "usage": "Dùng để chỉ lời nói, đối thoại tiếng Tạng hàng ngày.",
        "buddhist": "Âm thanh truyền tải giáo pháp từ chư Đạo sư đến đệ tử."
    },
    "སློབ": {
        "vn": "Học tập, rèn luyện, huấn luyện (Slob)",
        "pos": "Động từ",
        "wylie": "slob",
        "usage": "Gốc từ của học tập: སློབ་མ (học sinh), སློབ་དེབ (sách giáo trình), སློབ་གྲྭ (trường học).",
        "buddhist": "Tam Vô Lậu Học: Giới - Định - Tuệ (Tshul khrims, Ting nge 'dzin, Shes rab)."
    },
    "སློབ་མ": {
        "vn": "Học sinh, học viên, hành giả học tập",
        "pos": "Danh từ",
        "wylie": "slob ma",
        "usage": "Người đang theo học.",
        "buddhist": "Người đệ tử lắng nghe và thực hành giáo lý giác ngộ."
    },
    "སློབ་དེབ": {
        "vn": "Giáo trình, sách giáo khoa",
        "pos": "Danh từ",
        "wylie": "slob deb",
        "usage": "Tài liệu học tập chính khóa.",
        "buddhist": "Sách hướng dẫn học chánh ngữ."
    },
    "སློབ་གྲྭ": {
        "vn": "Trường học, học đường",
        "pos": "Danh từ",
        "wylie": "slob grwa",
        "usage": "Nơi diễn ra hoạt động học tập giảng dạy.",
        "buddhist": "Các học viện Phật học viện (Shedra)."
    },
    "སློབ་དཔོན": {
        "vn": "Giảng sư, Bậc Thầy, Giáo thọ sư (Acharya / Lopon)",
        "pos": "Danh từ tôn xưng",
        "wylie": "slob dpon",
        "usage": "Tôn xưng vị thầy thông thạo giáo lý (ví dụ: Slob-dpon Padmasambhava - Đạo sư Liên Hoa Sinh).",
        "buddhist": "Bậc thầy dẫn dắt trên con đường tu học."
    },
    "དགེ་རྒན": {
        "vn": "Thầy giáo, Cô giáo (Genla)",
        "pos": "Danh từ xưng hô",
        "wylie": "dge rgan",
        "usage": "Cách gọi thân kính dành cho thầy cô giáo (dge rgan lags).",
        "buddhist": "Nghĩa đen: 'Người lớn tuổi trong thiện đức'."
    },
    "དཔེ་ཆ": {
        "vn": "Kinh sách truyền thống Tây Tạng (Pecha - bản in lá dài)",
        "pos": "Danh từ",
        "wylie": "dpe cha",
        "usage": "Kinh điển Phật giáo in trên giấy chữ nhật dài không đóng gáy, bọc bằng vải lụa vàng.",
        "buddhist": "Tượng trưng cho Pháp Thân thanh tịnh của chư Phật."
    },
    "དེབ": {
        "vn": "Quyển sách, tập vở",
        "pos": "Danh từ",
        "wylie": "deb",
        "usage": "Sách vở học tập đóng gáy hiện đại.",
        "buddhist": "Phương tiện lưu giữ tri thức."
    },
    "སྨྱུ་གུ": {
        "vn": "Bút viết, cây viết (Pen)",
        "pos": "Danh từ",
        "wylie": "smyu gu",
        "usage": "Cây bút truyền thống bằng tre mạ vàng hoặc bút mực viết thư pháp Uchen.",
        "buddhist": "Công cụ chép kinh tích lũy vô lượng công đức."
    },
    "ཡི་གེ": {
        "vn": "Chữ viết, văn tự, bức thư",
        "pos": "Danh từ",
        "wylie": "yi ge",
        "usage": "Chữ cái hoặc văn tự.",
        "buddhist": "Văn tự truyền tải Phật pháp."
    },
    "མི": {
        "vn": "Người, con người, nhân loại",
        "pos": "Danh từ",
        "wylie": "mi",
        "usage": "Thân người trong lục đạo.",
        "buddhist": "Thân người quý báu khó gặp (Dal 'byor rin chen)."
    },
    "ཁོང": {
        "vn": "Ngài ấy, vị ấy, thầy ấy (Đại từ tôn kính ngôi thứ 3)",
        "pos": "Đại từ nhân xưng tôn kính",
        "wylie": "khong",
        "usage": "Dùng để gọi quý thầy, đạo sư, cha mẹ hoặc người lớn tuổi.",
        "buddhist": "Thể hiện lòng tôn kính sâu sắc đối với các bậc thánh thiện tri thức."
    },
    "ཁོ": {
        "vn": "Anh ấy, cậu ấy (Ngôi thứ 3 nam)",
        "pos": "Đại từ nhân xưng",
        "wylie": "kho",
        "usage": "Dùng chỉ ngôi thứ 3 thông thường.",
        "buddhist": "Danh từ giao tiếp."
    },
    "མོ": {
        "vn": "Cô ấy, chị ấy (Ngôi thứ 3 nữ)",
        "pos": "Đại từ nhân xưng",
        "wylie": "mo",
        "usage": "Dùng chỉ ngôi thứ 3 nữ thông thường.",
        "buddhist": "Danh từ giao tiếp."
    },
    "ཁྱེད": {
        "vn": "Bạn, quý vị, anh/chị (Ngôi thứ 2 kính trọng)",
        "pos": "Đại từ nhân xưng ngôi 2",
        "wylie": "khyed",
        "usage": "Dùng để xưng hô lịch sự với người đối thoại (khyed rang).",
        "buddhist": "Tôn trọng Phật tánh trong mỗi người."
    },
    "ཁྱེད་རང": {
        "vn": "Bạn, quý bạn, bản thân bạn",
        "pos": "Đại từ nhân xưng ngôi 2",
        "wylie": "khyed rang",
        "usage": "Đại từ ngôi 2 phổ biến nhất trong đàm thoại Sara.",
        "buddhist": "Giao tiếp lịch thiệp."
    },
    "ང་རང": {
        "vn": "Bản thân tôi, chính tôi",
        "pos": "Đại từ nhân xưng ngôi 1",
        "wylie": "nga rang",
        "usage": "Tự xưng trong giao tiếp.",
        "buddhist": "Ngôi thứ nhất."
    },
    "ལགས": {
        "vn": "Dạ, vâng, kính thưa (Trợ từ kính ngữ Lags)",
        "pos": "Trợ từ kính ngữ",
        "wylie": "lags",
        "usage": "Đặt sau tên gọi (Tashi lags) hoặc đầu câu đáp để biểu thị lòng tôn kính.",
        "buddhist": "Nét văn hóa lễ độ đặc trưng của truyền thống Phật giáo Tây Tạng."
    },
    "ལགས་སོ": {
        "vn": "Dạ vâng, con hiểu rồi, xin vâng",
        "pos": "Thành ngữ kính ngữ",
        "wylie": "lags so",
        "usage": "Câu trả lời kính trọng khi nhận lời dặn dò từ bậc Thầy.",
        "buddhist": "Sự hoan hỷ vâng lời giáo huấn chánh pháp."
    },
    "ཡིན": {
        "vn": "Là (Động từ khẳng định định danh ngôi thứ nhất 'Tôi là...')",
        "pos": "Động từ vị ngữ định danh (Egophoric)",
        "wylie": "yin",
        "usage": "Dùng khi chủ ngữ là ngôi thứ 1: Nga bod pa yin (Tôi là người Tây Tạng).",
        "buddhist": "Khẳng định tự tánh."
    },
    "རེད": {
        "vn": "Là (Động từ khẳng định định danh ngôi thứ 2 & 3 'Anh ấy/Đó là...')",
        "pos": "Động từ vị ngữ định danh",
        "wylie": "red",
        "usage": "Dùng khi chủ ngữ là ngôi 2 hoặc ngôi 3: Khong dge rgan red (Ngài ấy là thầy giáo).",
        "buddhist": "Xác định sự thật duyên khởi."
    },
    "མིན": {
        "vn": "Không phải là (Phủ định định danh ngôi thứ 1 'Tôi không phải là...')",
        "pos": "Động từ phủ định",
        "wylie": "min",
        "usage": "Dùng phủ định cho ngôi thứ 1: Nga rgya gar pa min (Tôi không phải người Ấn Độ).",
        "buddhist": "Phủ định huyễn tướng."
    },
    "མ་རེད": {
        "vn": "Không phải là (Phủ định định danh ngôi thứ 2 & 3)",
        "pos": "Động từ phủ định",
        "wylie": "ma red",
        "usage": "Phủ định cho ngôi 2 và 3: 'Di deb ma red (Đây không phải là sách).",
        "buddhist": "Phủ định sai biệt."
    },
    "ཡོད": {
        "vn": "Có, ở (Động từ chỉ sự tồn tại / sở hữu ngôi thứ 1 'Tôi có / Tôi ở...')",
        "pos": "Động từ tồn tại",
        "wylie": "yod",
        "usage": "Dùng cho sự tồn tại ngôi 1: Nga la deb yod (Tôi có sách).",
        "buddhist": "Hiện hữu duyên sinh."
    },
    "འདུག": {
        "vn": "Có, đang ở (Động từ chỉ sự tồn tại do mắt thấy / chứng kiến trực tiếp)",
        "pos": "Động từ tồn tại chứng kiến",
        "wylie": "'dug",
        "usage": "Dùng khi người nói trực tiếp quan sát thấy: 'Dir deb 'dug (Ở đây có cuốn sách).",
        "buddhist": "Chứng kiến thực tại."
    },
    "མེད": {
        "vn": "Không có (Phủ định sự tồn tại ngôi thứ 1)",
        "pos": "Động từ phủ định",
        "wylie": "med",
        "usage": "Phủ định của ཡོད.",
        "buddhist": "Vô tự tánh."
    },
    "མི་འདུག": {
        "vn": "Không có (Phủ định sự tồn tại chứng kiến)",
        "pos": "Động từ phủ định",
        "wylie": "mi 'dug",
        "usage": "Phủ định của འདུག.",
        "buddhist": "Không tìm thấy trong thực tại chứng kiến."
    },
    "འདི": {
        "vn": "Cái này, ở đây, đây (Chỉ định từ gần)",
        "pos": "Đại từ chỉ định",
        "wylie": "'di",
        "usage": "Chỉ vật ở gần người nói: 'Di deb red (Đây là quyển sách).",
        "buddhist": "Trực chỉ hiện tại."
    },
    "དེ": {
        "vn": "Cái đó, cái kia, ở đó (Chỉ định từ xa vừa)",
        "pos": "Đại từ chỉ định",
        "wylie": "de",
        "usage": "Chỉ vật ở xa người nói hoặc đã nhắc trước đó: De slob ma red (Đó là học sinh).",
        "buddhist": "Chỉ định đối tượng."
    },
    "ཕ་གི": {
        "vn": "Cái đằng kia, tít đằng kia (Chỉ định từ rất xa)",
        "pos": "Đại từ chỉ định",
        "wylie": "pha gi",
        "usage": "Chỉ vật ở khoảng cách xa trong tầm mắt.",
        "buddhist": "Không gian rộng mở."
    },
    "གང": {
        "vn": "Cái gì, nào (Từ để hỏi sự vật)",
        "pos": "Đại từ nghi vấn",
        "wylie": "gang",
        "usage": "Dùng trong câu hỏi: 'Di gang red? (Đây là cái gì?).",
        "buddhist": "Truy tìm nguồn gốc."
    },
    "གང་རེད": {
        "vn": "Là cái gì? (Câu hỏi định danh đồ vật)",
        "pos": "Cụm từ nghi vấn",
        "wylie": "gang red",
        "usage": "Hỏi về bản chất, tên gọi của sự vật: 'Di gang red? (Đây là cái gì?).",
        "buddhist": "Vấn đáp học tập."
    },
    "སུ": {
        "vn": "Ai, người nào (Từ để hỏi người)",
        "pos": "Đại từ nghi vấn",
        "wylie": "su",
        "usage": "Dùng trong câu hỏi nhân xưng: Khong su red? (Ngài ấy là ai?).",
        "buddhist": "Vấn đáp nhân sinh."
    },
    "སུ་རེད": {
        "vn": "Là ai? (Câu hỏi danh tính con người)",
        "pos": "Cụm từ nghi vấn",
        "wylie": "su red",
        "usage": "Hỏi danh tính: Khong su red? (Vị ấy là ai?).",
        "buddhist": "Nhận diện thiện tri thức."
    },
    "ག་པར": {
        "vn": "Ở đâu, nơi nào (Từ hỏi vị trí)",
        "pos": "Trạng từ nghi vấn",
        "wylie": "ga par",
        "usage": "Hỏi nơi chốn: Khyed rang ga par 'gro gi yod? (Bạn đang đi đâu đấy?).",
        "buddhist": "Nơi chốn an trụ."
    },
    "ག་དུས": {
        "vn": "Khi nào, lúc nào (Từ hỏi thời gian)",
        "pos": "Trạng từ nghi vấn",
        "wylie": "ga dus",
        "usage": "Hỏi thời gian xảy ra sự việc.",
        "buddhist": "Thời khắc hiện tiền."
    },
    "ག་ཚོད": {
        "vn": "Bao nhiêu? (Hỏi số lượng hoặc giá cả)",
        "pos": "Từ nghi vấn số lượng",
        "wylie": "ga tshod",
        "usage": "'Di la gong ga tshod red? (Cái này giá bao nhiêu?).",
        "buddhist": "Số lượng vạn pháp."
    },
    "ཀློག": {
        "vn": "Đọc, tụng đọc sách kinh (Klog)",
        "pos": "Động từ",
        "wylie": "klog",
        "usage": "Hành động đọc to hoặc tụng kinh.",
        "buddhist": "Đọc tụng kinh điển mở mang trí huệ."
    },
    "འབྲི": {
        "vn": "Viết chữ, sao chép văn bản ('Bri)",
        "pos": "Động từ",
        "wylie": "'bri",
        "usage": "Viết chữ Tạng bằng bút trên giấy/Wacom.",
        "buddhist": "Chép kinh tích phước."
    },
    "ཉན": {
        "vn": "Lắng nghe, tiếp nhận âm thanh (Nyan)",
        "pos": "Động từ",
        "wylie": "nyan",
        "usage": "Lắng nghe lời giảng dạy của giáo thọ sư.",
        "buddhist": "Văn huệ (Nghe pháp sinh trí huệ)."
    },
    "བཤད": {
        "vn": "Nói, giảng giải, diễn thuyết (Bshad)",
        "pos": "Động từ",
        "wylie": "bshad",
        "usage": "Nói chuyện hoặc thuyết pháp.",
        "buddhist": "Thuyết giảng diệu pháp."
    },
    "ལྟ": {
        "vn": "Xem, nhìn, quán sát (Lta)",
        "pos": "Động từ",
        "wylie": "lta",
        "usage": "Nhìn ngắm hoặc quán sát nội tâm (Lta-ba: Tri kiến).",
        "buddhist": "Chánh kiến trong Bát Chánh Đạo."
    },
    "འགྲོ": {
        "vn": "Đi, di chuyển ('Gro)",
        "pos": "Động từ",
        "wylie": "'gro",
        "usage": "Hành động đi lại: Nga slob grwar 'gro gi yin (Tôi đi đến trường).",
        "buddhist": "Bước đi trên lộ trình giải thoát."
    },
    "ཡོང": {
        "vn": "Đến, lại, trở về (Yong)",
        "pos": "Động từ",
        "wylie": "yong",
        "usage": "Hành động đi đến phía người nói.",
        "buddhist": "Như Lai (Tathagata - Đấng đến như vậy)."
    },
    "ཡག་པོ": {
        "vn": "Tốt, đẹp, giỏi giang (Yag-po)",
        "pos": "Tính từ",
        "wylie": "yag po",
        "usage": "Khen ngợi: Dpe cha 'di yag po 'dug (Cuốn kinh này rất tốt/đẹp).",
        "buddhist": "Thiện lành thanh tịnh."
    },
    "སྡུག་པོ": {
        "vn": "Xấu, tồi tệ, khổ sở (Sdug-po)",
        "pos": "Tính từ",
        "wylie": "sdug po",
        "usage": "Trái nghĩa với ཡག་པོ.",
        "buddhist": "Khổ đế."
    },
    "ཆེན་པོ": {
        "vn": "To lớn, vĩ đại (Chen-po)",
        "pos": "Tính từ",
        "wylie": "chen po",
        "usage": "Chỉ kích thước hoặc ý nghĩa vĩ đại (Mahayana: Theg pa chen po).",
        "buddhist": "Đại thừa vô thượng."
    },
    "ཆུང་ཆུང": {
        "vn": "Nhỏ bé, khiêm nhường (Chung-chung)",
        "pos": "Tính từ",
        "wylie": "chung chung",
        "usage": "Chỉ sự vật nhỏ nhắn.",
        "buddhist": "Tâm khiêm hạ."
    },
    "མང་པོ": {
        "vn": "Nhiều, phong phú (Mang-po)",
        "pos": "Tính từ chỉ lượng",
        "wylie": "mang po",
        "usage": "Chỉ số lượng nhiều.",
        "buddhist": "Vô lượng vô biên."
    },
    "ཉུང་ཉུང": {
        "vn": "Ít ỏi (Nyung-nyung)",
        "pos": "Tính từ chỉ lượng",
        "wylie": "nyung nyung",
        "usage": "Trái nghĩa với མང་པོ.",
        "buddhist": "Thiểu dục tri túc."
    },

    # --- SỐ ĐẾM TỪ 1 ĐẾN 10 ---
    "གཅིག": {
        "vn": "Số 1 (Gcig)",
        "pos": "Số đếm",
        "wylie": "gcig",
        "usage": "Số 1 trong bảng số đếm tiếng Tạng.",
        "buddhist": "Nhất Như, duy nhất thanh tịnh."
    },
    "གཉིས": {
        "vn": "Số 2 (Gnyis)",
        "pos": "Số đếm",
        "wylie": "gnyis",
        "usage": "Số 2.",
        "buddhist": "Nhị đế: Chân đế và Tục đế."
    },
    "གསུམ": {
        "vn": "Số 3 (Gsum)",
        "pos": "Số đếm",
        "wylie": "gsum",
        "usage": "Số 3.",
        "buddhist": "Tam Bảo: Phật, Pháp, Tăng."
    },
    "བཞི": {
        "vn": "Số 4 (Bzhi)",
        "pos": "Số đếm",
        "wylie": "bzhi",
        "usage": "Số 4.",
        "buddhist": "Tứ Diệu Đế, Bốn tâm Vô Lượng."
    },
    "ལྔ": {
        "vn": "Số 5 (Lnga)",
        "pos": "Số đếm",
        "wylie": "lnga",
        "usage": "Số 5.",
        "buddhist": "Ngũ Trí Như Lai, Năm Uẩn."
    },
    "དྲུག": {
        "vn": "Số 6 (Drug)",
        "pos": "Số đếm",
        "wylie": "drug",
        "usage": "Số 6.",
        "buddhist": "Lục Độ Ba-la-mật, Sáu cõi luân hồi."
    },
    "བདུན": {
        "vn": "Số 7 (Bdun)",
        "pos": "Số đếm",
        "wylie": "bdun",
        "usage": "Số 7.",
        "buddhist": "Thất Giác Chi, 7 bát cúng dường."
    },
    "བརྒྱད": {
        "vn": "Số 8 (Brgyad)",
        "pos": "Số đếm",
        "wylie": "brgyad",
        "usage": "Số 8.",
        "buddhist": "Bát Chánh Đạo, Bát Cát Tường."
    },
    "དགུ": {
        "vn": "Số 9 (Dgu)",
        "pos": "Số đếm",
        "wylie": "dgu",
        "usage": "Số 9.",
        "buddhist": "Chín thứ đệ định, 9 cỗ xe thừa."
    },
    "བཅུ": {
        "vn": "Số 10 (Bcu)",
        "pos": "Số đếm",
        "wylie": "bcu",
        "usage": "Số 10.",
        "buddhist": "Thập Thiện nghiệp, Thập Địa Bồ Tát."
    },

    # --- KINH ĐIỂN, THẦN CHÚ & TỰA ĐỀ SÁCH SARA ---
    "སངས་རྒྱས": {
        "vn": "Đức Phật, Đấng Toàn Giác (Buddha)",
        "pos": "Danh từ Phật học",
        "wylie": "sangs rgyas",
        "usage": "Chỉ Đức Bổn Sư Thích Ca Mâu Ni hoặc quả vị Phật viên mãn.",
        "buddhist": "སངས (Sang: Thức tỉnh, tịnh hóa vô minh) + རྒྱས (Gye: Khai mở trọn vẹn trí tuệ và từ bi)."
    },
    "ཆོས": {
        "vn": "Pháp (Dharma), Chân lý, Giáo lý giải thoát, Vạn pháp",
        "pos": "Danh từ",
        "wylie": "chos",
        "usage": "Toàn bộ giáo pháp Đức Phật thuyết giảng.",
        "buddhist": "Ngôi thứ hai trong Tam Bảo, chuyển hóa tâm cấu nhiễm thành thanh tịnh."
    },
    "དགེ་འདུན": {
        "vn": "Tăng đoàn (Sangha), Tăng già thanh tịnh",
        "pos": "Danh từ",
        "wylie": "dge 'dun",
        "usage": "Đoàn thể chư Tăng Ni tu hành phạm hạnh.",
        "buddhist": "Ngôi thứ ba trong Tam Bảo (དགེ: Thiện đức + འདུན: Nguyện ước giải thoát)."
    },
    "བླ་མ": {
        "vn": "Lạt-ma, Đạo Sư Tối Thượng (Guru / Lama)",
        "pos": "Danh từ tôn xưng",
        "wylie": "bla ma",
        "usage": "Vị Thầy tâm linh dẫn dắt trong Kim Cương Thừa.",
        "buddhist": "བླ (Cao thượng tột cùng) + མ (Mẹ hiền chở che)."
    },
    "བྱང་ཆུབ་སེམས": {
        "vn": "Bồ Đề Tâm (Bodhicitta)",
        "pos": "Thuật ngữ Phật học",
        "wylie": "byang chub sems",
        "usage": "Tâm nguyện giác ngộ vì lợi ích giải thoát muôn loài hữu tình.",
        "buddhist": "Trọng tâm của Đại Thừa Bồ Tát đạo."
    },
    "སྟོང་པ་ཉིད": {
        "vn": "Tánh Không (Shunyata)",
        "pos": "Thuật ngữ Triết học",
        "wylie": "stong pa nyid",
        "usage": "Bản chất rốt ráo duyên khởi, không tự tính của vạn pháp.",
        "buddhist": "Cốt tủy của Bát Nhã Tâm Kinh."
    },
    "སྙིང་རྗེ": {
        "vn": "Đại Từ Bi (Karuna)",
        "pos": "Danh từ",
        "wylie": "snying rje",
        "usage": "Lòng thương xót muốn giải cứu tất cả chúng sinh khỏi đau khổ.",
        "buddhist": "Đức tính của Đức Quán Thế Âm Bồ Tát."
    },
    "ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ": {
        "vn": "Lục Tự Đại Minh Chân Ngôn (Thần chú Quan Thế Âm Bồ Tát)",
        "pos": "Thần chú Mật tông",
        "wylie": "om ma ni pad me hum",
        "usage": "Thần chú phổ biến nhất xứ Tuyết, khắc trên đá Mani và kinh luân.",
        "buddhist": "Sáu âm thanh tịnh hóa sáu cõi luân hồi sinh tử."
    },
    "ཨོཾ་ཨཱཿཧཱུྃ": {
        "vn": "Tam Tự Minh Chú (Chân ngôn Thân - Khẩu - Ý Kim Cương)",
        "pos": "Thần chú",
        "wylie": "om ah hum",
        "usage": "Thanh tịnh hóa ba nghiệp Thân - Khẩu - Ý.",
        "buddhist": "OM (Đảnh đầu), AH (Cổ họng), HUM (Tâm luân xa)."
    },
    "ཨོཾ་ཏཱ་རེ་ཏུཏྟཱ་རེ་ཏུ་རེ་སྭཱ་ཧཱ": {
        "vn": "Thần Chú Đức Thánh Mẫu Tara Xanh (Green Tara Mantra)",
        "pos": "Thần chú",
        "wylie": "om ta re tut ta re tu re sva ha",
        "usage": "Cứu độ vượt qua 8 nỗi sợ hãi và chướng ngại.",
        "buddhist": "Hiện thân giải thoát mau chóng của chư Phật."
    },
    "དཀོན་མཆོག་གསུམ": {
        "vn": "Tam Bảo (Phật Bảo, Pháp Bảo, Tăng Bảo)",
        "pos": "Danh từ",
        "wylie": "dkon mchog gsum",
        "usage": "Nơi quy y tối thượng của người con Phật.",
        "buddhist": "Ba ngôi báu tối thắng hiếm gặp."
    },
    "སྐྱབས་སུ་མཆི": {
        "vn": "Con xin Quy Y, Con về nương tựa",
        "pos": "Cụm từ phát nguyện",
        "wylie": "skyabs su mchi",
        "usage": "Bài kệ Quy Y Tam Bảo.",
        "buddhist": "Cửa ngõ bước vào Phật đạo."
    },
    "སེམས་ཅན": {
        "vn": "Chúng sinh, hữu tình chúng sinh (Sentient beings)",
        "pos": "Danh từ",
        "wylie": "sems can",
        "usage": "Mọi loài có tâm thức trong tam giới.",
        "buddhist": "Tất cả chúng sinh từng là cha mẹ ta."
    },
    "ཕྱི་རྒྱལ་སློབ་མའི་བོད་ཡིག་སློབ་དེབ": {
        "vn": "Giáo trình Tiếng Tạng dành cho Học viên Quốc tế (Bìa Sách Sara)",
        "pos": "Tựa đề sách",
        "wylie": "phi rgyal slob ma'i bod yig slob deb",
        "usage": "Tựa đề chính thức của bộ giáo trình giảng dạy tại Học viện Sara.",
        "buddhist": "Biên soạn bởi chư học giả Phật học Dharamsala."
    },
    "སློབ་དུས་དང་པོ": {
        "vn": "Học kỳ 1 / Quyển thứ nhất (Tập 1)",
        "pos": "Cụm danh từ",
        "wylie": "slob dus dang po",
        "usage": "Quyển căn bản từ chữ cái đến đàm thoại.",
        "buddhist": "Nền tảng tiếp cận Đại Tạng Kinh."
    },
    "ས་རཱ་བོད་ཀྱི་མཐོ་རིམ་སློབ་གཉེར་ཁང": {
        "vn": "Học Viện Cao Cấp Nghiên Cứu Tây Tạng Sara (Dharamsala)",
        "pos": "Địa danh / Tên viện",
        "wylie": "sa rA bod kyi mtho rim slob gnyer khang",
        "usage": "Trường cao đẳng Phật học xuất bản giáo trình.",
        "buddhist": "Trung tâm gìn giữ văn hóa và triết học Tạng truyền."
    },
    "གསལ་བྱེད་སུམ་ཅུ": {
        "vn": "30 Phụ âm căn bản (Căn tự Ka đến A)",
        "pos": "Thuật ngữ ngữ pháp",
        "wylie": "gsal byed sum cu",
        "usage": "Bảng chữ cái Tạng 30 phụ âm.",
        "buddhist": "Do Thonmi Sambhota sáng tạo thế kỷ thứ 7."
    },
    "དབྱངས་བཞི": {
        "vn": "4 Nguyên âm tiếng Tạng (i, u, e, o)",
        "pos": "Thuật ngữ ngữ pháp",
        "wylie": "dbyangs bzhi",
        "usage": "Gi-gu, Zhabs-kyu, 'Greng-bu, Na-ro.",
        "buddhist": "Bốn nguyên âm thanh tịnh."
    },
    "ཕྱི་རྒྱལ": {
        "vn": "Nước ngoài, Quốc tế",
        "pos": "Danh từ",
        "wylie": "phi rgyal",
        "usage": "Các quốc gia bên ngoài Tây Tạng.",
        "buddhist": "Hành giả bốn phương."
    },
    "ས་རཱ": {
        "vn": "Học Viện Sara (Sara College tại Dharamsala)",
        "pos": "Địa danh / Tên riêng",
        "wylie": "sa rA",
        "usage": "Học viện Sara Dharamsala.",
        "buddhist": "Trung tâm Phật học Tạng truyền."
    }
}


# ======================================================================================
# 2.5 SEGMENTATION & 3-COLUMN TABLE & FULL SENTENCE TRANSLATION ENGINE
# ======================================================================================
WORD_DB = {
    "བཀྲ་ཤིས་བདེ་ལེགས": {"ipa": "[tra-shi de-lek]", "wylie": "bkra-shis-bde-legs", "pos": "Thành ngữ chào hỏi", "vn": "Xin chào / Lời chúc cát tường, bình an và hạnh phúc trọn vẹn"},
    "བཀྲ་ཤིས": {"ipa": "[tra-shi]", "wylie": "bkra-shis", "pos": "Tính từ / Danh từ", "vn": "Cát tường, may mắn, tốt lành"},
    "བདེ་ལེགས": {"ipa": "[de-lek]", "wylie": "bde-legs", "pos": "Tính từ", "vn": "An lành, hạnh phúc viên mãn"},
    "ངའི": {"ipa": "[ngai]", "wylie": "nga'i", "pos": "Đại từ sở hữu", "vn": "Của tôi (Ngôi thứ nhất sở hữu)"},
    "ངའི་": {"ipa": "[ngai]", "wylie": "nga'i", "pos": "Đại từ sở hữu", "vn": "Của tôi (Ngôi thứ nhất sở hữu)"},
    "ང": {"ipa": "[nga]", "wylie": "nga", "pos": "Đại từ nhân xưng", "vn": "Tôi, con, em (Ngôi thứ 1)"},
    "ང་རང": {"ipa": "[nga-rang]", "wylie": "nga-rang", "pos": "Đại từ nhân xưng", "vn": "Bản thân tôi, chính tôi"},
    "ང་ཚོ": {"ipa": "[nga-tsho]", "wylie": "nga-tsho", "pos": "Đại từ nhân xưng", "vn": "Chúng tôi, chúng ta"},
    "མིང": {"ipa": "[ming]", "wylie": "ming", "pos": "Danh từ", "vn": "Tên, danh tính, danh xưng"},
    "མིང་": {"ipa": "[ming]", "wylie": "ming", "pos": "Danh từ", "vn": "Tên, danh tính, danh xưng"},
    "ལ": {"ipa": "[la]", "wylie": "la", "pos": "Trợ từ La-don", "vn": "Là, ở, vào, đến (Trợ từ vị cách)"},
    "ལ་": {"ipa": "[la]", "wylie": "la", "pos": "Trợ từ La-don", "vn": "Là, ở, vào, đến (Trợ từ vị cách)"},
    "སློབ་མ": {"ipa": "[lop-ma]", "wylie": "slob-ma", "pos": "Danh từ", "vn": "Học sinh, học viên, đệ tử"},
    "སློབ་ཕྲུག": {"ipa": "[lop-thruk]", "wylie": "slob-phrug", "pos": "Danh từ", "vn": "Học sinh, em học sinh nhỏ"},
    "སློབ་དེབ": {"ipa": "[lop-dep]", "wylie": "slob-deb", "pos": "Danh từ", "vn": "Giáo trình, sách giáo khoa"},
    "སློབ་གྲྭ": {"ipa": "[lop-dra]", "wylie": "slob-grwa", "pos": "Danh từ", "vn": "Trường học, tu viện học tập"},
    "སློབ་དཔོན": {"ipa": "[lop-pön]", "wylie": "slob-dpon", "pos": "Danh từ tôn xưng", "vn": "A-xà-lê, Đạo sư, Giáo sư"},
    "སློབ་གཉེར": {"ipa": "[lop-nyer]", "wylie": "slob-gnyer", "pos": "Động từ / Danh từ", "vn": "Nghiên cứu học tập, tu học"},
    "དགེ་རྒན": {"ipa": "[ge-gen]", "wylie": "dge-rgan", "pos": "Danh từ tôn xưng", "vn": "Giáo viên, giáo thọ sư, thầy cô"},
    "ཁོང": {"ipa": "[khong]", "wylie": "khong", "pos": "Đại từ tôn kính", "vn": "Ngài ấy, vị ấy, thầy ấy (Ngôi 3 tôn kính)"},
    "ཁོང་གི": {"ipa": "[khong-gi]", "wylie": "khong-gi", "pos": "Đại từ sở hữu", "vn": "Của ngài ấy, của vị ấy"},
    "ཁོང་ཚོ": {"ipa": "[khong-tsho]", "wylie": "khong-tsho", "pos": "Đại từ nhân xưng", "vn": "Các vị ấy, các ngài ấy"},
    "ཁོང་ཚོའི": {"ipa": "[khong-tsho'i]", "wylie": "khong-tsho'i", "pos": "Đại từ sở hữu", "vn": "Của các vị ấy"},
    "ཁྱེད": {"ipa": "[khye]", "wylie": "khyed", "pos": "Đại từ nhân xưng", "vn": "Bạn, anh, chị (Ngôi 2 lịch sự)"},
    "ཁྱེད་རང": {"ipa": "[khye-rang]", "wylie": "khyed-rang", "pos": "Đại từ nhân xưng", "vn": "Bạn, quý bạn (Ngôi 2 phổ biến)"},
    "ཁྱེད་རང་གི": {"ipa": "[khye-rang-gi]", "wylie": "khyed-rang-gi", "pos": "Đại từ sở hữu", "vn": "Của bạn, của anh/chị"},
    "ཁྱེད་རང་ཚོ": {"ipa": "[khye-rang-tsho]", "wylie": "khyed-rang-tsho", "pos": "Đại từ nhân xưng", "vn": "Các bạn, quý vị"},
    "ནང་མི": {"ipa": "[nang-mi]", "wylie": "nang-mi", "pos": "Danh từ", "vn": "Gia đình, người trong nhà, thân quyến"},
    "པ་ལགས": {"ipa": "[pa-lak]", "wylie": "pa-lags", "pos": "Danh từ kính ngữ", "vn": "Cha, bố, thân phụ (Tôn kính)"},
    "ཨ་མ་ལགས": {"ipa": "[a-ma-lak]", "wylie": "a-ma-lags", "pos": "Danh từ kính ngữ", "vn": "Mẹ, má, thân mẫu (Tôn kính)"},
    "ཨ་མ": {"ipa": "[a-ma]", "wylie": "a-ma", "pos": "Danh từ", "vn": "Mẹ, người mẹ"},
    "ཕ་མ": {"ipa": "[pha-ma]", "wylie": "pha-ma", "pos": "Danh từ", "vn": "Cha mẹ, phụ mẫu"},
    "ཨ་ཅག": {"ipa": "[a-cak]", "wylie": "a-cag", "pos": "Danh từ", "vn": "Chị gái"},
    "ཅོ་ཅོ": {"ipa": "[co-co]", "wylie": "co-co", "pos": "Danh từ", "vn": "Anh trai"},
    "ཁྱོ་ག": {"ipa": "[khyo-ga]", "wylie": "khyo-ga", "pos": "Danh từ", "vn": "Người chồng (Husband)"},
    "སྐྱེས་དམན": {"ipa": "[kye-men]", "wylie": "skyes-dman", "pos": "Danh từ", "vn": "Người vợ (Wife)"},
    "བུ་མོ": {"ipa": "[bu-mo]", "wylie": "bu-mo", "pos": "Danh từ", "vn": "Con gái, người con gái"},
    "བུ": {"ipa": "[bu]", "wylie": "bu", "pos": "Danh từ", "vn": "Con trai, người con trai"},
    "ཕྲུ་གུ": {"ipa": "[thru-gu]", "wylie": "phru-gu", "pos": "Danh từ", "vn": "Đứa trẻ, con cái (Children)"},
    "པུ་གུ": {"ipa": "[pu-gu]", "wylie": "pu-gu", "pos": "Danh từ", "vn": "Đứa bé, đứa trẻ nhỏ"},
    "སྒྲོལ་དཀར": {"ipa": "[Drol-kar]", "wylie": "Sgrol-dkar", "pos": "Tên riêng", "vn": "Dolkar (Tên riêng người Tạng / Bạch Độ Mẫu)"},
    "རྡོ་རྗེ": {"ipa": "[Dor-je]", "wylie": "Rdo-rje", "pos": "Tên riêng / Pháp khí", "vn": "Dorje (Kim Cương / Tên riêng)"},
    "བོད": {"ipa": "[Pö]", "wylie": "bod", "pos": "Địa danh", "vn": "Tây Tạng, xứ Tuyết"},
    "བོད་པ": {"ipa": "[Pö-pa]", "wylie": "bod-pa", "pos": "Danh từ", "vn": "Người Tây Tạng"},
    "བོད་ཡིག": {"ipa": "[Pö-yik]", "wylie": "bod-yig", "pos": "Danh từ", "vn": "Chữ Tạng, văn tự Tạng"},
    "བོད་སྐད": {"ipa": "[Pö-ke]", "wylie": "bod-skad", "pos": "Danh từ", "vn": "Tiếng Tạng, khẩu ngữ Tạng"},
    "རྒྱ་གར": {"ipa": "[Gya-gar]", "wylie": "rgya-gar", "pos": "Địa danh", "vn": "Ấn Độ (Xứ sở Chánh pháp)"},
    "རྒྱ་གར་པ": {"ipa": "[Gya-gar-pa]", "wylie": "rgya-gar-pa", "pos": "Danh từ", "vn": "Người Ấn Độ"},
    "ཡིན": {"ipa": "[yin]", "wylie": "yin", "pos": "Động từ định danh", "vn": "Là (Định danh khẳng định ngôi thứ 1)"},
    "རེད": {"ipa": "[re / red]", "wylie": "red", "pos": "Động từ định danh", "vn": "Là (Định danh khẳng định ngôi 2 & 3)"},
    "མིན": {"ipa": "[min]", "wylie": "min", "pos": "Động từ phủ định", "vn": "Không phải là (Phủ định ngôi thứ 1)"},
    "མ་རེད": {"ipa": "[ma-re]", "wylie": "ma-red", "pos": "Động từ phủ định", "vn": "Không phải là (Phủ định ngôi 2 & 3)"},
    "ཡོད": {"ipa": "[yö / yod]", "wylie": "yod", "pos": "Động từ tồn tại", "vn": "Có, ở (Khẳng định tồn tại/sở hữu ngôi 1)"},
    "ཡོད་རེད": {"ipa": "[yo-re]", "wylie": "yod-red", "pos": "Động từ tồn tại", "vn": "Có, đang có (Khẳng định tồn tại ngôi 2 & 3)"},
    "མེད": {"ipa": "[me / med]", "wylie": "med", "pos": "Động từ phủ định", "vn": "Không có (Phủ định tồn tại ngôi 1)"},
    "ཡོད་མ་རེད": {"ipa": "[yo-ma-re]", "wylie": "yod-ma-red", "pos": "Động từ phủ định", "vn": "Không có (Phủ định tồn tại ngôi 2 & 3)"},
    "འདུག": {"ipa": "[duk]", "wylie": "'dug", "pos": "Động từ chứng kiến", "vn": "Có, thấy có (Tồn tại chứng kiến trực tiếp)"},
    "མི་འདུག": {"ipa": "[mi-duk]", "wylie": "mi-'dug", "pos": "Động từ phủ định", "vn": "Không có (Phủ định chứng kiến)"},
    "ཡིན་པས": {"ipa": "[yin-pe]", "wylie": "yin-pas", "pos": "Trợ từ nghi vấn", "vn": "Có phải là... không? (Hỏi ngôi 2)"},
    "རེད་པས": {"ipa": "[re-pe]", "wylie": "red-pas", "pos": "Trợ từ nghi vấn", "vn": "Có phải là... không? (Hỏi ngôi 3)"},
    "ཡོད་པས": {"ipa": "[yo-pe]", "wylie": "yod-pas", "pos": "Trợ từ nghi vấn", "vn": "Có... không? (Hỏi sự tồn tại/sở hữu)"},
    "ག་རེ": {"ipa": "[ka-re]", "wylie": "ga-re", "pos": "Đại từ nghi vấn", "vn": "Cái gì? Gì? (What?)"},
    "ག་ནས": {"ipa": "[ka-ne]", "wylie": "ga-nas", "pos": "Đại từ nghi vấn", "vn": "Từ đâu? Ở đâu đến? (Where from?)"},
    "ག་པར": {"ipa": "[ka-par]", "wylie": "ga-par", "pos": "Đại từ nghi vấn", "vn": "Ở đâu? Chỗ nào? (Where?)"},
    "སུ": {"ipa": "[su]", "wylie": "su", "pos": "Đại từ nghi vấn", "vn": "Ai? Người nào? (Who?)"},
    "ག་ཚོད": {"ipa": "[ka-tshö]", "wylie": "ga-tshod", "pos": "Đại từ nghi vấn", "vn": "Bao nhiêu? Mấy? (How much/many?)"},
    "འདི": {"ipa": "[di]", "wylie": "'di", "pos": "Chỉ định từ", "vn": "Đây, cái này (Chỉ định gần)"},
    "འདི་ཚོ": {"ipa": "[di-tsho]", "wylie": "'di-tsho", "pos": "Chỉ định từ", "vn": "Những cái này, những người này"},
    "དེ": {"ipa": "[de]", "wylie": "de", "pos": "Chỉ định từ", "vn": "Đó, cái đó, kia (Chỉ định xa)"},
    "དེ་ཚོ": {"ipa": "[de-tsho]", "wylie": "de-tsho", "pos": "Chỉ định từ", "vn": "Những cái đó, những người đó"},
    "དང": {"ipa": "[thang / dang]", "wylie": "dang", "pos": "Liên từ", "vn": "Và, cùng với"},
    "དང་": {"ipa": "[thang / dang]", "wylie": "dang", "pos": "Liên từ", "vn": "Và, cùng với"},
    "ནས": {"ipa": "[ne / nas]", "wylie": "nas", "pos": "Giới từ", "vn": "Từ, từ nơi, sau khi"},
    "ནང": {"ipa": "[nang]", "wylie": "nang", "pos": "Danh từ chỉ vị trí", "vn": "Trong, bên trong"},
    "ནང་ལ": {"ipa": "[nang-la]", "wylie": "nang-la", "pos": "Cụm vị trí", "vn": "Ở trong, vào bên trong"},
    "ཤག": {"ipa": "[shak]", "wylie": "shag", "pos": "Danh từ", "vn": "Phòng ở, tăng phòng tu viện"},
    "ཅ་ལག": {"ipa": "[ca-lak]", "wylie": "ca-lag", "pos": "Danh từ", "vn": "Đồ đạc, vật dụng, hành lý"},
    "མང་པོ": {"ipa": "[mang-po]", "wylie": "mang-po", "pos": "Tính từ", "vn": "Nhiều, phong phú"},
    "ཉུང་ཉུང": {"ipa": "[nyung-nyung]", "wylie": "nyung-nyung", "pos": "Tính từ", "vn": "Ít, ít ỏi"},
    "ཆེན་པོ": {"ipa": "[chen-po]", "wylie": "chen-po", "pos": "Tính từ", "vn": "To lớn, lớn"},
    "ཆུང་ཆུང": {"ipa": "[chung-chung]", "wylie": "chung-chung", "pos": "Tính từ", "vn": "Nhỏ bé, nhỏ"},
    "ཡག་པོ": {"ipa": "[yag-po]", "wylie": "yag-po", "pos": "Tính từ", "vn": "Tốt, đẹp, giỏi"},
    "སྐྱིད་པོ": {"ipa": "[kyi-po]", "wylie": "skyid-po", "pos": "Tính từ", "vn": "Vui vẻ, hạnh phúc, an lành"},
    "ཅོག་ཙེ": {"ipa": "[cok-tse]", "wylie": "cog-tse", "pos": "Danh từ", "vn": "Cái bàn"},
    "རྐུབ་ཀྱག": {"ipa": "[kup-kyak]", "wylie": "rkub-kyag", "pos": "Danh từ", "vn": "Cái ghế ngồi"},
    "ཉལ་ཁྲི": {"ipa": "[nyal-thri]", "wylie": "nyal-khri", "pos": "Danh từ", "vn": "Cái giường ngủ"},
    "དཔེ་ཆ": {"ipa": "[pe-cha]", "wylie": "dpe-cha", "pos": "Danh từ", "vn": "Kinh sách, sách học"},
    "ཞི་མི": {"ipa": "[zhi-mi]", "wylie": "zhi-mi", "pos": "Danh từ", "vn": "Con mèo (Cat)"},
    "སོ": {"ipa": "[so]", "wylie": "so", "pos": "Danh từ", "vn": "Răng, cái răng (Tooth)"},
    "ཉི་མ": {"ipa": "[nyi-ma]", "wylie": "nyi-ma", "pos": "Danh từ", "vn": "Mặt trời, ban ngày (Sun)"},
    "མིག": {"ipa": "[mik]", "wylie": "mig", "pos": "Danh từ", "vn": "Con mắt (Eye)"},
    "ཞྭ་མོ": {"ipa": "[zhwa-mo]", "wylie": "zhwa-mo", "pos": "Danh từ", "vn": "Chiếc mũ, nón (Hat)"},
    "ལམ་ཁ": {"ipa": "[lam-kha]", "wylie": "lam-kha", "pos": "Danh từ", "vn": "Con đường (Road)"},
    "གཅིག": {"ipa": "[cik]", "wylie": "gcig", "pos": "Số đếm", "vn": "Số 1"},
    "གཉིས": {"ipa": "[nyi]", "wylie": "gnyis", "pos": "Số đếm", "vn": "Số 2"},
    "གསུམ": {"ipa": "[sum]", "wylie": "gsum", "pos": "Số đếm", "vn": "Số 3"},
    "བཞི": {"ipa": "[zhi]", "wylie": "bzhi", "pos": "Số đếm", "vn": "Số 4"},
    "ལྔ": {"ipa": "[nga]", "wylie": "lnga", "pos": "Số đếm", "vn": "Số 5"},
    "དྲུག": {"ipa": "[thruk]", "wylie": "drug", "pos": "Số đếm", "vn": "Số 6"},
    "བདུན": {"ipa": "[dün]", "wylie": "bdun", "pos": "Số đếm", "vn": "Số 7"},
    "བརྒྱད": {"ipa": "[gye]", "wylie": "brgyad", "pos": "Số đếm", "vn": "Số 8"},
    "དགུ": {"ipa": "[gu]", "wylie": "dgu", "pos": "Số đếm", "vn": "Số 9"},
    "བཅུ": {"ipa": "[cu]", "wylie": "bcu", "pos": "Số đếm", "vn": "Số 10"},
    "གསལ་བྱེད": {"ipa": "[sal-je]", "wylie": "gsal-byed", "pos": "Ngữ pháp", "vn": "Phụ âm, Căn tự Tạng"},
    "དབྱངས་བཞི": {"ipa": "[yang-zhi]", "wylie": "dbyangs-bzhi", "pos": "Ngữ pháp", "vn": "Bốn nguyên âm tiếng Tạng"},
    "གསལ་བྱེད་སུམ་ཅུ": {"ipa": "[sal-je sum-cu]", "wylie": "gsal-byed-sum-cu", "pos": "Ngữ pháp", "vn": "30 Phụ âm căn bản (Ka đến A)"},
    "སངས་རྒྱས": {"ipa": "[Sang-gye]", "wylie": "sangs-rgyas", "pos": "Phật học", "vn": "Đức Phật, Đấng Toàn Giác"},
    "ཆོས": {"ipa": "[Chö]", "wylie": "chos", "pos": "Phật học", "vn": "Giáo Pháp, Chân lý (Dharma)"},
    "དགེ་འདུན": {"ipa": "[Gen-dün]", "wylie": "dge-'dun", "pos": "Phật học", "vn": "Tăng đoàn thanh tịnh (Sangha)"},
    "བླ་མ": {"ipa": "[La-ma]", "wylie": "bla-ma", "pos": "Phật học", "vn": "Bậc Đạo Sư (Guru / Lama)"},
    "བྱང་ཆུབ་སེམས": {"ipa": "[Jang-chub sem]", "wylie": "byang-chub-sems", "pos": "Phật học", "vn": "Bồ Đề Tâm (Bodhicitta)"},
    "སྟོང་པ་ཉིད": {"ipa": "[Tong-pa-nyi]", "wylie": "stong-pa-nyid", "pos": "Triết học", "vn": "Tánh Không (Shunyata)"},
    "སྙིང་རྗེ": {"ipa": "[Nying-je]", "wylie": "snying-rje", "pos": "Phật học", "vn": "Đại Từ Bi (Karuna)"},
    "ཟེར་གྱི་ཡོད": {"ipa": "[ser-gyi yod]", "wylie": "zer-gyi yod", "pos": "Cụm động từ", "vn": "Tên là, được gọi là (Hỏi/xưng tên)"},
    "ཟེར": {"ipa": "[ser]", "wylie": "zer", "pos": "Động từ", "vn": "Nói, gọi là (Say / Call)"},
    "གྱི": {"ipa": "[gyi]", "wylie": "gyi", "pos": "Trợ từ", "vn": "Trợ từ sở hữu cách / Trợ từ kết nối thời"}
}

# Rich Buddhist Canonical Database
BUDDHIST_CANON_DB = {
    "default": {
        "sutra_tibetan": "ན་མོ་གུ་རུ་བྷྱཿ ན་མོ་བུདྡྷཱ་ཡ། ན་མོ་དྷརྨཱ་ཡ། ན་མོ་སངྒྷཱ་ཡ།",
        "sutra_wylie": "na mo gu ru bh+yaH / na mo bud+dhA ya / na mo d+harmA ya / na mo sang+g+hA ya /",
        "sutra_chanting": "Nam-mô Gu-ru-bê, Nam-mô Bút-đa-da, Nam-mô Đạt-ma-da, Nam-mô Sang-ga-da",
        "sutra_translation": "Con xin quy y Bậc Đạo Sư, Quy y Phật, Quy y Pháp, Quy y Tăng thanh tịnh.",
        "dharma_insight": "Pháp quy y Tứ Bảo là nền tảng tối thượng của Kim Cương Thừa, bảo hộ hành giả qua khỏi luân hồi sinh tử."
    },
    "ས": {
        "sutra_tibetan": "ས་བཅུ་རིམ་གྱིས་བགྲོད་ནས་ཀྱང་། །རྡོ་རྗེ་འཆང་གི་གོ་འཕང་མྱུར་ཐོབ་ཤོག །",
        "sutra_wylie": "sa bcu rim gyis bgrod nas kyang / /rdo rje 'chang gi go 'phang myur thob shog /",
        "sutra_chanting": "Sa cu rim-gyi drö-ne kyang / Dor-je-chang-gi go-phang nyur-thob shog",
        "sutra_translation": "Nguyện con thứ lớp viên mãn Thập Địa Bồ Tát (Sa-bcu), mau chóng chứng đắc Phật quả Kim Cương Trì tối thượng.",
        "dharma_insight": "Chữ SA (ས) đại diện cho Thập Địa (Sa-bcu) trên con đường tiến tu giác ngộ vô thượng bồ đề."
    },
    "བཀྲ་ཤིས": {
        "sutra_tibetan": "ཉིན་མོ་བདེ་ལེགས་མཚན་བདེ་ལེགས། །ཉིན་raw་གུང་ཡང་བདེ་ལེགས་ཤིང་། །",
        "sutra_wylie": "nyin mo bde legs mtshan bde legs / /nyin gung yang bde legs shing /",
        "sutra_chanting": "Nyin-mo de-lek tshen de-lek / Nyin-gung yang de-lek shing",
        "sutra_translation": "Ngày an lành, đêm an lành, đêm ngày sáu thời đều an lành viên mãn.",
        "dharma_insight": "Lời chúc Cát Tường (Tashi Delek) mở ra năng lượng từ bi và trí tuệ bình an của chư Phật mười phương."
    },
    "སློབ": {
        "sutra_tibetan": "ཐོས་བསམ་སྒོམ་གསུམ་གྱིས་ནི་བསླབ་བྱ་རྫོགས། །",
        "sutra_wylie": "thos bsam sgom gsum gyis ni bslab bya rdzogs /",
        "sutra_chanting": "Thö Sam Gom sum gyi ni lab-ja dzok",
        "sutra_translation": "Nhờ tu tập trọn vẹn Văn - Tư - Tu mà hoàn thiện mọi sự học pháp giải thoát.",
        "dharma_insight": "Sự học (Slob) trong Phật giáo Tạng truyền luôn gắn liền với việc chuyển hóa tâm thức và chứng ngộ chân lý."
    },
    "དགེ་རྒན": {
        "sutra_tibetan": "བླ་མ་སངས་རྒྱས་བླ་མ་ཆོས། །དེ་བཞིན་བླ་མ་དགེ་འདུན་ཏེ། །",
        "sutra_wylie": "bla ma sangs rgyas bla ma chos / /de bzhin bla ma dge 'dun te /",
        "sutra_chanting": "La-ma Sang-gye La-ma Chö / De-zhin La-ma Gen-dün te",
        "sutra_translation": "Thầy là Phật, Thầy là Pháp, và Thầy cũng chính là Tăng già hòa hợp.",
        "dharma_insight": "Tâm chí thành tôn kính Bậc Thầy (Guru Yoga) là cội nguồn của mọi sự chứng ngộ tâm linh."
    }
}

def segment_tibetan_text(text):
    """
    Intelligently segment a Tibetan sentence into words and phrases for the 3-column table
    """
    clean_no_punc = re.sub(r'[།༎༄༅]+', ' ', text)
    sylls = [s.strip() for s in re.split(r'[་\s]+', clean_no_punc) if s.strip()]
    
    table_rows = []
    i = 0
    while i < len(sylls):
        matched = False
        for l in [4, 3, 2, 1]:
            if i + l <= len(sylls):
                candidate_tsheg = "་".join(sylls[i:i+l])
                candidate_no_tsheg = candidate_tsheg.replace('་', '')
                
                info = None
                if candidate_tsheg in WORD_DB:
                    info = WORD_DB[candidate_tsheg]
                elif candidate_no_tsheg in WORD_DB:
                    info = WORD_DB[candidate_no_tsheg]
                elif candidate_tsheg in DICTIONARY_DB:
                    d = DICTIONARY_DB[candidate_tsheg]
                    info = {"ipa": f"[{candidate_tsheg}]", "wylie": d.get('wylie', ''), "pos": d.get('pos', 'Từ vựng'), "vn": d.get('vn', '')}
                elif candidate_no_tsheg in DICTIONARY_DB:
                    d = DICTIONARY_DB[candidate_no_tsheg]
                    info = {"ipa": f"[{candidate_no_tsheg}]", "wylie": d.get('wylie', ''), "pos": d.get('pos', 'Từ vựng'), "vn": d.get('vn', '')}
                    
                if info:
                    table_rows.append({
                        "tibetan": candidate_tsheg,
                        "phonetic": info.get('ipa', f"[{info.get('wylie', candidate_tsheg)}]"),
                        "wylie": info.get('wylie', ''),
                        "pos": info.get('pos', 'Từ vựng'),
                        "meaning": info.get('vn', '')
                    })
                    i += l
                    matched = True
                    break
        if not matched:
            s_single = sylls[i]
            table_rows.append({
                "tibetan": s_single,
                "phonetic": f"[{s_single}]",
                "wylie": s_single,
                "pos": "Âm tiết",
                "meaning": "Âm tiết / Thành tố ngữ pháp"
            })
            i += 1
            
    return table_rows

def synthesize_sentence_translation(text, table_rows):
    """
    Synthesizes a coherent, natural full-sentence Vietnamese translation
    """
    clean = text.replace('།', '').replace('་', ' ').strip()
    
    # 1. Direct Pattern Translations for Textbook Dialogues
    if 'བཀྲ་ཤིས་བདེ་ལེགས' in text:
        if 'སློབ་མ་ཡིན' in text:
            return "Xin chào! Chúc cát tường bình an. Tên của tôi là [tên]... Tôi là học sinh."
        elif 'དགེ་རྒན་' in text:
            return "Xin chào! Chúc cát tường. Tôi là giáo viên / giáo thọ sư."
        return "Xin chào! Chúc cát tường, bình an và mọi điều tốt đẹp viên mãn."
        
    if 'ཁོང་གི་མིང་' in text or 'ཁོང་གི་' in text:
        if 'སློབ་མ་རེད' in text or 'སློབ་མ་' in text:
            return "Tên của ngài ấy/vị ấy là [tên]... Vị ấy là học sinh."
        elif 'དགེ་རྒན་' in text:
            return "Vị ấy là giáo viên / giáo thọ sư."
        elif 'སྒྲོལ་དཀར་' in text:
            return "Tên của cô ấy là Dolkar (Bạch Độ Mẫu)."
        return "Tên của ngài ấy/vị ấy là..."
        
    if 'ཁྱེད་རང་གི་ཤག་' in text:
        return "Trong phòng ở / tăng phòng của bạn có nhiều đồ đạc không?"
        
    if 'སྒྲོལ་དཀར་གྱི་ནང་མི' in text or 'ནང་མི་རེད' in text:
        return "Đây là gia đình của Dolkar."
        
    if 'ང་ལ་པ་ལགས་དང་ཨ་མ་ལགས་ཡོད' in text:
        return "Tôi có cả cha (bố) và mẹ."
        
    if 'ཕ་མ་ལ་བུ་མོ་གཉིས་ཡོད་རེད' in text:
        return "Cha mẹ tôi có hai người con gái."
        
    if 'དབྱངས་བཞི' in text:
        return "Bốn nguyên âm căn bản trong tiếng Tạng: Gi-gu (i), Zhabs-kyu (u), 'Greng-bu (e), Na-ro (o)."
        
    if 'གསལ་བྱེད་སུམ་ཅུ' in text:
        return "Bảng chữ cái 30 phụ âm căn bản tiếng Tạng (từ Ka đến A)."

    # 2. General Synthesis from segmented components
    meanings = [r['meaning'].split('/')[0].split('(')[0].strip() for r in table_rows if r['meaning'] and r['pos'] != 'Âm tiết']
    if meanings:
        return " ".join(meanings) + "."
        
    return f"Câu thực hành tiếng Tạng: {text}"



def generate_practical_usage_context(text, table_rows, full_trans, wylie_str=""):
    """
    Generates rich, highly practical real-world usage context, cultural etiquette,
    and interactive dialogue examples for Tibetan learners.
    """
    clean = text.replace('།', '').replace('་', ' ').strip()
    
    # 1. Greetings & Well-wishing
    if 'བཀྲ་ཤིས་བདེ་ལེགས' in text or 'བདེ་ལེགས' in text:
        return {
            "situation": "Lời chào hỏi cát tường mở đầu mọi cuộc giao tiếp hàng ngày, khi gặp gỡ bạn bè, chào đón khách quý hoặc diện kiến chư Tăng Ni.",
            "cultural_notes": "Khi chào người lớn tuổi hoặc Bậc Thầy (Lama/Rinpoche), người Tạng thường chắp hai tay trước ngực và thêm tiếp vĩ ngữ tôn kính 'ལགས' (Tashi Delek-lags) để bày tỏ lòng kính ngưỡng thanh tịnh.",
            "dialogue_examples": [
                {
                    "speaker": "Người hỏi (A)",
                    "tibetan": "བཀྲ་ཤིས་བདེ་ལེགས། ཁྱེད་རང་སྐུ་གཟུགས་བདེ་པོ་ཡིན་པས།",
                    "wylie": "bkra-shis bde-legs / khyed-rang sku-gzugs bde-po yin-pas /",
                    "vn": "Xin chào! Bạn/Ngài có khỏe không ạ?"
                },
                {
                    "speaker": "Người đáp (B)",
                    "tibetan": "ལགས་ཡིན། ང་བདེ་པོ་ཡིན། ཐུགས་རྗེ་ཆེ།",
                    "wylie": "lags-yin / nga bde-po yin / thugs-rje-che /",
                    "vn": "Dạ khỏe ạ! Con/Tôi rất khỏe, xin chân thành cảm ơn!"
                }
            ]
        }

    # 2. Asking & Stating Names / Identity / Profession
    if any(k in text for k in ['མིང་', 'ཟེར་གྱི་ཡོད', 'སློབ་མ་', 'དགེ་རྒན་', 'སྒྲོལ་དཀར་', 'རྡོ་རྗེ་', 'སུ']):
        return {
            "situation": "Dùng khi làm quen, tự giới thiệu bản thân, hỏi tên tuổi, nghề nghiệp trong lớp học, tu viện hoặc cộng đồng người Tạng.",
            "cultural_notes": "Động từ 'ཟེར་གྱི་ཡོད' (zer-gyi yod) nghĩa là 'được gọi là / tên là'. Khi xưng hô về người thứ ba tôn kính luôn dùng 'ཁོང' (khong), còn xưng về bản thân dùng khiêm tốn 'ང' (nga).",
            "dialogue_examples": [
                {
                    "speaker": "Hỏi tên (A)",
                    "tibetan": "ཁྱེད་རང་གི་མིང་ལ་ག་རེ་ཟེར་གྱི་ཡོད།",
                    "wylie": "khyed-rang-gi ming-la ga-re zer-gyi yod /",
                    "vn": "Tên của bạn/anh/chị là gì?"
                },
                {
                    "speaker": "Trả lời (B)",
                    "tibetan": "ངའི་མིང་ལ་བཀྲ་ཤིས་ཟེར་གྱི་ཡོད། ང་སློབ་མ་ཡིན།",
                    "wylie": "nga'i ming-la bkra-shis zer-gyi yod / nga slob-ma yin /",
                    "vn": "Tên của tôi là Tashi. Tôi là học sinh/học viên."
                },
                {
                    "speaker": "Giới thiệu (A)",
                    "tibetan": "ཁོང་གི་མིང་ལ་སྒྲོལ་དཀར་ཟེར་གྱི་ཡོད། ཁོང་དགེ་རྒན་རེད།",
                    "wylie": "khong-gi ming-la sgrol-dkar zer-gyi yod / khong dge-rgan red /",
                    "vn": "Tên của cô ấy là Dolkar. Cô ấy là giáo viên/giảng sư."
                }
            ]
        }

    # 3. Family Members & Relationships
    if any(k in text for k in ['ནང་མི', 'པ་ལགས', 'ཨ་མ་ལགས', 'ཕ་མ', 'བུ་མོ', 'བུ', 'ཕྲུ་གུ', 'ཨ་ཅག', 'ཅོ་ཅོ']):
        return {
            "situation": "Đàm thoại về gia đình, giới thiệu các thành viên trong nhà hoặc hỏi thăm người thân khi giao lưu thân mật.",
            "cultural_notes": "Người Tạng luôn thêm 'ལགས' (lags) sau danh từ chỉ cha mẹ ('པ་ལགས' - Bố, 'ཨ་མ་ལགས' - Mẹ) để biểu thị lòng hiếu thảo và sự tôn kính sâu sắc.",
            "dialogue_examples": [
                {
                    "speaker": "Hỏi gia đình (A)",
                    "tibetan": "འདི་ཁྱེད་རང་གི་ནང་མི་རེད་པས།",
                    "wylie": "'di khyed-rang-gi nang-mi red-pas /",
                    "vn": "Đây có phải là gia đình của bạn không?"
                },
                {
                    "speaker": "Trả lời (B)",
                    "tibetan": "ལགས་རེད། ང་ལ་པ་ལགས་དང་ཨ་མ་ལགས་ཡོད།",
                    "wylie": "lags-red / nga-la pa-lags dang a-ma-lags yod /",
                    "vn": "Dạ đúng rồi, tôi có cả cha và mẹ."
                }
            ]
        }

    # 4. Monastic Living Quarters, Belongings & Books
    if any(k in text for k in ['ཤག', 'ཅ་ལག', 'ཅོག་ཙེ', 'རྐུབ་ཀྱག', 'ཉལ་ཁྲི', 'དཔེ་ཆ', 'ནང་ལ']):
        return {
            "situation": "Sinh hoạt tu viện và đời sống thường nhật: Hỏi thăm vị trí phòng ở (tăng phòng - Shag), sắp xếp đồ đạc, bàn ghế học tập hoặc tìm kinh sách.",
            "cultural_notes": "Từ 'ཤག' (Shag) là thuật ngữ đặc thù chỉ tăng phòng nơi các chư Tăng sinh sống và tu học trong các đại tu viện Tây Tạng.",
            "dialogue_examples": [
                {
                    "speaker": "Hỏi phòng ở (A)",
                    "tibetan": "ཁྱེད་རང་གི་ཤག་ནང་ལ་ཅ་ལག་མང་པོ་ཡོད་པས།",
                    "wylie": "khyed-rang-gi shag nang-la ca-lag mang-po yod-pas /",
                    "vn": "Trong tăng phòng của bạn có nhiều đồ đạc không?"
                },
                {
                    "speaker": "Trả lời (B)",
                    "tibetan": "ངའི་ཤག་ནང་ལ་དཔེ་ཆ་དང་ཅོག་ཙེ་ཡོད།",
                    "wylie": "nga'i shag nang-la dpe-cha dang cog-tse yod /",
                    "vn": "Trong phòng của tôi có kinh sách học tập và một cái bàn."
                }
            ]
        }

    # 5. Asking Where / Origin / Country
    if any(k in text for k in ['ག་ནས', 'ག་པར', 'བོད', 'རྒྱ་གར']):
        return {
            "situation": "Giao tiếp hỏi thăm xuất xứ, quê quán, chỉ đường khi đi du lịch hoặc hành hương Dharamsala / Tây Tạng.",
            "cultural_notes": "'ག་ནས' (Ga-ne) dùng để hỏi nguồn gốc xuất xứ ('từ đâu đến'), còn 'ག་པར' (Ga-par) hỏi vị trí địa điểm ('ở đâu').",
            "dialogue_examples": [
                {
                    "speaker": "Hỏi quê quán (A)",
                    "tibetan": "ཁྱེད་རང་ག་ནས་ཡིན།",
                    "wylie": "khyed-rang ga-nas yin /",
                    "vn": "Bạn/Quý vị từ đâu đến?"
                },
                {
                    "speaker": "Trả lời (B)",
                    "tibetan": "ང་བོད་ནས་ཡིན། ང་སློབ་མ་ཡིན།",
                    "wylie": "nga bod-nas yin / nga slob-ma yin /",
                    "vn": "Tôi đến từ Tây Tạng. Tôi là học sinh."
                }
            ]
        }

    # 6. Buddhist Practice & Dharma Terms
    if any(k in text for k in ['སངས་རྒྱས', 'ཆོས', 'དགེ་འདུན', 'བླ་མ', 'བྱང་ཆུབ་སེམས', 'སྟོང་པ་ཉིད', 'སྙིང་རྗེ']):
        return {
            "situation": "Sử dụng trong tụng đọc kinh văn, đàm luận Phật pháp, hành trì tâm linh Kim Cương thừa và phát nguyện tu tập.",
            "cultural_notes": "Các thuật ngữ này mang năng lượng gia trì thanh tịnh, khi xưng tụng cần giữ tâm chí thành hướng về Tam Bảo và Bậc Đạo Sư.",
            "dialogue_examples": [
                {
                    "speaker": "Quy y Tam Bảo",
                    "tibetan": "བླ་མ་ལ་སྐྱབས་སུ་མཆིའོ། སངས་རྒྱས་ལ་སྐྱབས་སུ་མཆིའོ།",
                    "wylie": "bla-ma la skyabs-su mchi'o / sangs-rgyas la skyabs-su mchi'o /",
                    "vn": "Con xin quy y Bậc Đạo Sư. Con xin quy y Đức Phật Toàn Giác."
                }
            ]
        }

    # 7. General / Fallback Context
    return {
        "situation": f"Mẫu câu đàm thoại và thực hành tiếng Tạng thông dụng: '{full_trans}'",
        "cultural_notes": "Cấu trúc câu chuẩn tiếng Tạng là SOV (Chủ ngữ + Bổ ngữ + Động từ). Động từ khẳng định định danh dùng 'ཡིན' cho ngôi 1 ('tôi là') và 'རེད' cho ngôi 2 & 3 ('bạn/vị ấy là').",
        "dialogue_examples": [
            {
                "speaker": "Thực hành đàm thoại (A)",
                "tibetan": text,
                "wylie": wylie_str or text,
                "vn": full_trans
            }
        ]
    }


def analyze_text(text):
    clean_t = clean_legacy_tibetan(text.strip())
    wylie_str = unicode_to_wylie(clean_t)
    
    # 1. Segment text into 3-column table rows
    table_rows = segment_tibetan_text(clean_t)
    
    # 2. Syllable-by-syllable decomposition for spelling tab
    raw_sylls = [s.strip() for s in re.split(r'[་\s]+', clean_t) if s.strip() and s not in ['།', '༎', '༄༅']]
    syllable_analyses = []
    for syl in raw_sylls:
        dec = decompose_syllable(syl)
        if dec:
            syllable_analyses.append(dec)
            
    # 3. Synthesize coherent full sentence translation
    full_trans = synthesize_sentence_translation(clean_t, table_rows)
    
    # 4. Find matching Buddhist Canon Context
    buddhist_data = BUDDHIST_CANON_DB.get("default")
    for k in BUDDHIST_CANON_DB:
        if k != "default" and k in clean_t:
            buddhist_data = BUDDHIST_CANON_DB[k]
            break
            
    # 5. Generate Rich Practical Usage Context & Interactive Dialogues
    usage_context = generate_practical_usage_context(clean_t, table_rows, full_trans, wylie_str)

    # 6. Fallback dictionary object for backward compatibility
    dict_match = {
        "vn": full_trans,
        "pos": "Cụm từ / Câu tiếng Tạng",
        "wylie": wylie_str,
        "usage": usage_context.get("situation", "Được dùng trong ngữ cảnh đàm thoại giáo trình Sara."),
        "buddhist": buddhist_data.get("dharma_insight", "")
    }

    return {
        "original_text": clean_t,
        "wylie": wylie_str,
        "syllables": syllable_analyses,
        "table_rows": table_rows,
        "full_translation": full_trans,
        "buddhist_context": buddhist_data,
        "usage_context": usage_context,
        "dictionary": dict_match
    }

# ======================================================================================
# 3. PRONUNCIATION COACHING & ARTICULATION GUIDE ENGINE
# ======================================================================================
CONSONANT_ARTICULATION = {
    'ཀ': {'ipa': '[ka]', 'tone': 'Cao', 'aspiration': 'Không bật hơi', 'guide': 'Đặt gốc lưỡi chạm ngạc mềm, phát âm dứt khoát không có luồng hơi thoát ra.'},
    'ཁ': {'ipa': '[kʰa]', 'tone': 'Cao', 'aspiration': 'Bật hơi mạnh', 'guide': 'Đặt gốc lưỡi như ཀ nhưng bật một luồng hơi mạnh từ cuống họng ra ngoài.'},
    'ག': {'ipa': '[kà / ɡà]', 'tone': 'Trầm', 'aspiration': 'Âm trầm', 'guide': 'Phát âm ở cuống họng nhưng hạ thấp giọng (thanh trầm).'},
    'ང': {'ipa': '[ŋà]', 'tone': 'Trầm', 'aspiration': 'Âm mũi', 'guide': 'Phát âm bằng mũi giống chữ Ng tiếng Việt nhưng hạ thấp thanh điệu.'},
    'ཅ': {'ipa': '[tɕa]', 'tone': 'Cao', 'aspiration': 'Không bật hơi', 'guide': 'Mặt lưỡi ép sát ngạc cứng, phát âm như chữ Ch tiếng Việt nhưng cao và gọn.'},
    'ཆ': {'ipa': '[tɕʰa]', 'tone': 'Cao', 'aspiration': 'Bật hơi mạnh', 'guide': 'Khẩu hình như ཅ nhưng đẩy luồng hơi mạnh ra ngoài (Ch-h bật gió).'},
    'ཇ': {'ipa': '[tɕà / dʑà]', 'tone': 'Trầm', 'aspiration': 'Âm trầm', 'guide': 'Khẩu hình như ཅ nhưng hạ giọng xuống âm trầm.'},
    'ཉ': {'ipa': '[ɲà]', 'tone': 'Trầm', 'aspiration': 'Âm mũi', 'guide': 'Phát âm như chữ Nh tiếng Việt nhưng ở giọng trầm.'},
    'ཏ': {'ipa': '[ta]', 'tone': 'Cao', 'aspiration': 'Không bật hơi', 'guide': 'Đầu lưỡi chạm mặt sau răng trên, phát âm chữ T dứt khoát không bật hơi.'},
    'ཐ': {'ipa': '[tʰa]', 'tone': 'Cao', 'aspiration': 'Bật hơi mạnh', 'guide': 'Đầu lưỡi chạm răng trên rồi bật mạnh luồng hơi ra ngoài (Th bật gió).'},
    'ད': {'ipa': '[tà / dà]', 'tone': 'Trầm', 'aspiration': 'Âm trầm', 'guide': 'Khẩu hình như ཏ nhưng phát âm ở tông giọng trầm.'},
    'ན': {'ipa': '[nà]', 'tone': 'Trầm', 'aspiration': 'Âm mũi', 'guide': 'Phát âm chữ N tiếng Việt ở giọng trầm.'},
    'པ': {'ipa': '[pa]', 'tone': 'Cao', 'aspiration': 'Không bật hơi', 'guide': 'Hai môi khép chặt rồi mở nhanh phát âm P dứt khoát, không bật hơi.'},
    'ཕ': {'ipa': '[pʰa]', 'tone': 'Cao', 'aspiration': 'Bật hơi mạnh', 'guide': 'Hai môi khép rồi bật mạnh một luồng hơi ra ngoài (P-h bật gió).'},
    'བ': {'ipa': '[pà / bà]', 'tone': 'Trầm', 'aspiration': 'Âm trầm', 'guide': 'Khẩu hình hai môi phát âm giọng trầm.'},
    'མ': {'ipa': '[mà]', 'tone': 'Trầm', 'aspiration': 'Âm mũi', 'guide': 'Phát âm chữ M ở giọng trầm.'},
    'ཙ': {'ipa': '[tsa]', 'tone': 'Cao', 'aspiration': 'Tắc xát không bật hơi', 'guide': 'Đầu lưỡi để sát chân răng phát âm Ts.'},
    'ཚ': {'ipa': '[tsʰa]', 'tone': 'Cao', 'aspiration': 'Tắc xát bật hơi mạnh', 'guide': 'Đầu lưỡi ở chân răng và bật mạnh luồng hơi ra ngoài (Tsh).' },
    'ཛ': {'ipa': '[tsà / dzà]', 'tone': 'Trầm', 'aspiration': 'Âm trầm', 'guide': 'Phát âm âm Ts nhưng hạ thấp giọng.'},
    'ཝ': {'ipa': '[wà]', 'tone': 'Trầm', 'aspiration': 'Âm môi', 'guide': 'Tròn môi phát âm chữ Oa/Wa ở giọng trầm.'},
    'ཞ': {'ipa': '[ɕà / ʑà]', 'tone': 'Trầm', 'aspiration': 'Âm xát', 'guide': 'Phát âm chữ Sh uốn nhẹ lưỡi ở giọng trầm.'},
    'ཟ': {'ipa': '[sà / zà]', 'tone': 'Trầm', 'aspiration': 'Âm xát', 'guide': 'Phát âm chữ S tiếng Việt nhưng ở tông giọng trầm.'},
    'འ': {'ipa': '[ʔà]', 'tone': 'Trầm', 'aspiration': 'Âm họng', 'guide': 'Phát âm âm A từ sâu trong cuống họng với giọng trầm nhẹ.'},
    'ཡ': {'ipa': '[jà]', 'tone': 'Trầm', 'aspiration': 'Bán nguyên âm', 'guide': 'Phát âm chữ D/Gi (Ya) ở giọng trầm.'},
    'ར': {'ipa': '[ra]', 'tone': 'Trung tính', 'aspiration': 'Rung nhẹ', 'guide': 'Đầu lưỡi rung nhẹ phát âm Ra.'},
    'ལ': {'ipa': '[la]', 'tone': 'Trung tính', 'aspiration': 'Âm bên', 'guide': 'Đầu lưỡi chạm lợi trên phát âm La mượt mà.'},
    'ཤ': {'ipa': '[ɕa]', 'tone': 'Cao', 'aspiration': 'Âm xát cao', 'guide': 'Uốn nhẹ đầu lưỡi phát âm Sh tiếng Anh ở giọng cao.'},
    'ས': {'ipa': '[sa]', 'tone': 'Cao', 'aspiration': 'Âm xát cao', 'guide': 'Đầu lưỡi ở sau răng cửa trên phát âm S sắc nét, giọng cao.'},
    'ཧ': {'ipa': '[ha]', 'tone': 'Cao', 'aspiration': 'Thanh môn cao', 'guide': 'Mở rộng họng thở ra chữ H ở giọng cao.'},
    'ཨ': {'ipa': '[a]', 'tone': 'Cao', 'aspiration': 'Nguyên âm gốc', 'guide': 'Mở miệng tự nhiên phát âm A ở giọng cao thanh tịnh.'}
}

SUBJOINED_ARTICULATION = {
    'ྱ': 'Ghép chân Ya (Ya-ta): Kết hợp tạo âm vòm hóa (vd: ཀྱ -> cha cao; པྱ -> cha cao).',
    'ྲ': 'Ghép chân Ra (Ra-ta): Uốn lưỡi tạo âm tắc sau răng (vd: ཀྲ -> tra cao; པྲ -> tra cao).',
    'ླ': 'Ghép chân La (La-ta): Âm thanh chuyển thành La giọng cao thanh thoát (vd: ཀླ -> la cao; བླ -> la cao).',
    'ྭ': 'Góc Wa (Wa-zur): Tròn môi giữ nguyên phụ âm chính.'
}

SUFFIX_ARTICULATION = {
    'ག': 'Hậu tự Ga: Khép âm nghẹn lại ở cuống họng (như vần -c nhưng êm).',
    'ང': 'Hậu tự Nga: Ngân âm mũi ở cuối (như vần -ng).',
    'ད': 'Hậu tự Da: Làm biến đổi nguyên âm (a -> e, u -> ü, o -> ö) và chặn đầu lưỡi.',
    'ན': 'Hậu tự Na: Làm biến đổi nguyên âm và kết thúc bằng âm mũi N.',
    'བ': 'Hậu tự Ba: Khép chặt hai môi lại ở cuối âm (như vần -p).',
    'མ': 'Hậu tự Ma: Khép môi ngân âm mũi M.',
    'འ': 'Hậu tự \'A: Kéo dài nguyên âm.',
    'ར': 'Hậu tự Ra: Uốn nhẹ đầu lưỡi ở cuối âm.',
    'ལ': 'Hậu tự La: Làm biến đổi nguyên âm và nâng đầu lưỡi chạm ngạc cứng.',
    'ས': 'Hậu tự Sa: Làm biến đổi nguyên âm (a -> e, u -> ü, o -> ö) và ngắt dứt khoát.'
}

def get_detailed_pronunciation_guide(syllable_data):
    if not syllable_data:
        return {}
    root = syllable_data.get('root')
    root_guide = CONSONANT_ARTICULATION.get(root, {})
    sub = syllable_data.get('subscript')
    sub_guide = SUBJOINED_ARTICULATION.get(sub, "")
    suf = syllable_data.get('suffix')
    suf_guide = SUFFIX_ARTICULATION.get(suf, "")
    
    correction_tips = []
    if root_guide.get('aspiration') == 'Bật hơi mạnh':
        correction_tips.append(f"⚠️ Chữ '{root}': Cần bật mạnh luồng hơi từ họng.")
    if root_guide.get('tone') == 'Trầm':
        correction_tips.append(f"⚠️ Chữ '{root}': Tông giọng phải hạ thấp.")
    if sub and sub == 'ྲ':
        correction_tips.append("⚠️ Có chân Ra (ྲ): Chuyển sang âm uốn lưỡi (Tr).")
    if suf in ['ད', 'ས', 'ལ', 'ན']:
        correction_tips.append(f"⚠️ Có hậu tự '{suf}': Làm biến đổi nguyên âm đi trước.")

    return {
        "root_guide": root_guide,
        "sub_guide": sub_guide,
        "suf_guide": suf_guide,
        "correction_tips": correction_tips
    }


# ======================================================================================
# 4. TIBETAN TTS CLIENT (WITH CACHE)
# ======================================================================================
HF_SPACE_URL = "https://aipmtdd-tibetan-tts-service.hf.space"
AUDIO_STATIC_DIR = os.path.join(APP_DIR, 'audio')

NATIVE_AUDIO_MAP = {
    'ཀ': 'cons_1_ka.mp3', 'ཁ': 'cons_2_kha.mp3', 'ག': 'cons_3_ga.mp3', 'ང': 'cons_4_nga.mp3',
    'ཅ': 'cons_5_ca.mp3', 'ཆ': 'cons_6_cha.mp3', 'ཇ': 'cons_7_ja.mp3', 'ཉ': 'cons_8_nya.mp3',
    'ཏ': 'cons_9_ta.mp3', 'ཐ': 'cons_10_tha.mp3', 'ད': 'cons_11_da.mp3', 'ན': 'cons_12_na.mp3',
    'པ': 'cons_13_pa.mp3', 'ཕ': 'cons_14_pha.mp3', 'བ': 'cons_15_ba.mp3', 'མ': 'cons_16_ma.mp3',
    'ཙ': 'cons_17_tsa.mp3', 'ཚ': 'cons_18_tsha.mp3', 'ཛ': 'cons_19_dza.mp3', 'ཝ': 'cons_20_wa.mp3',
    'ཞ': 'cons_21_zha.mp3', 'ཟ': 'cons_22_za.mp3', 'འ': 'cons_23_a_chung.mp3', 'ཡ': 'cons_24_ya.mp3',
    'ར': 'cons_25_ra.mp3', 'ལ': 'cons_26_la.mp3', 'ཤ': 'cons_27_sha.mp3', 'ས': 'cons_28_sa.mp3',
    'ཧ': 'cons_29_ha.mp3', 'ཨ': 'cons_30_a.mp3',
    'ི': 'vowel_1_i.mp3', 'ུ': 'vowel_2_u.mp3', 'ེ': 'vowel_3_e.mp3', 'ོ': 'vowel_4_o.mp3'
}

def get_text_hash(text):
    return hashlib.md5(text.strip().encode('utf-8')).hexdigest()

def get_audio_url_for_text(text):
    text_clean = text.strip().replace('་', '').replace('།', '')
    if text_clean in NATIVE_AUDIO_MAP:
        fn = NATIVE_AUDIO_MAP[text_clean]
        p = os.path.join(AUDIO_STATIC_DIR, fn)
        if os.path.exists(p) and os.path.getsize(p) > 500:
            return f"/app/audio/{fn}"
            
    # Check cache
    h = get_text_hash(text.strip())
    fn_cache = f"{h}.wav"
    p_cache = os.path.join(AUDIO_CACHE_DIR, fn_cache)
    if os.path.exists(p_cache) and os.path.getsize(p_cache) > 500:
        return f"/audio_cache/{fn_cache}"
        
    return None

def get_cached_audio_path(text):
    h = get_text_hash(text)
    filename = f"{h}.wav"
    filepath = os.path.join(AUDIO_CACHE_DIR, filename)
    if os.path.exists(filepath) and os.path.getsize(filepath) > 500:
        return filename, filepath
    return filename, None

def generate_tibetan_audio(text, timeout=25):
    text_clean = text.strip()
    if not text_clean:
        return None
        
    # 1. Native Audio Check
    direct_url = get_audio_url_for_text(text_clean)
    if direct_url:
        if direct_url.startswith('/app/audio/'):
            return direct_url.replace('/app/audio/', '')
        elif direct_url.startswith('/audio_cache/'):
            return direct_url.replace('/audio_cache/', '')

    filename, existing_path = get_cached_audio_path(text_clean)
    if existing_path:
        return filename

    target_filepath = os.path.join(AUDIO_CACHE_DIR, filename)
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    try:
        query_text = text_clean
        if not query_text.endswith(('།', ' ')):
            query_text += '།'

        call_url = f"{HF_SPACE_URL}/gradio_api/call/generate_tibetan_speech"
        post_payload = json.dumps({"data": [query_text]}).encode('utf-8')
        req = urllib.request.Request(
            call_url,
            data=post_payload,
            headers={'Content-Type': 'application/json'}
        )
        
        with urllib.request.urlopen(req, context=ctx, timeout=timeout) as resp:
            call_res = json.loads(resp.read().decode('utf-8'))
            event_id = call_res.get('event_id')
            
        if not event_id:
            return None

        sse_url = f"{HF_SPACE_URL}/gradio_api/call/generate_tibetan_speech/{event_id}"
        req_sse = urllib.request.Request(sse_url)
        audio_url = None
        
        with urllib.request.urlopen(req_sse, context=ctx, timeout=timeout) as resp:
            for line in resp:
                line_str = line.decode('utf-8', errors='ignore').strip()
                if line_str.startswith('data:'):
                    raw_data = line_str[5:].strip()
                    try:
                        data_arr = json.loads(raw_data)
                        if isinstance(data_arr, list) and len(data_arr) > 0:
                            item = data_arr[0]
                            if isinstance(item, dict) and 'url' in item:
                                audio_url = item['url']
                                break
                    except Exception:
                        pass

        if not audio_url:
            return None

        req_download = urllib.request.Request(audio_url)
        with urllib.request.urlopen(req_download, context=ctx, timeout=timeout) as resp:
            audio_bytes = resp.read()
            with open(target_filepath, 'wb') as f:
                f.write(audio_bytes)
                
        return filename
    except Exception as e:
        print(f"TTS Error for '{text_clean}': {e}", flush=True)
        return None


# ======================================================================================
# 5. WACOM & STYLUS HANDWRITING RECOGNITION (HWR) ENGINE
# ======================================================================================
TIBETAN_ALPHABET = [
    ('ཀ', 'ka', 'Căn tự Ka - Âm họng không bật hơi, thanh cao'),
    ('ཁ', 'kha', 'Căn tự Kha - Âm họng bật hơi mạnh, thanh cao'),
    ('ག', 'ga', 'Căn tự Ga - Âm họng, thanh trầm'),
    ('ང', 'nga', 'Căn tự Nga - Âm mũi họng, thanh trầm'),
    ('ཅ', 'ca', 'Căn tự Ca - Âm vòm không bật hơi, thanh cao'),
    ('ཆ', 'cha', 'Căn tự Cha - Âm vòm bật hơi mạnh, thanh cao'),
    ('ཇ', 'ja', 'Căn tự Ja - Âm vòm, thanh trầm'),
    ('ཉ', 'nya', 'Căn tự Nya - Âm mũi vòm, thanh trầm'),
    ('ཏ', 'ta', 'Căn tự Ta - Âm răng/đầu lưỡi không bật hơi, thanh cao'),
    ('ཐ', 'tha', 'Căn tự Tha - Âm răng bật hơi mạnh, thanh cao'),
    ('ད', 'da', 'Căn tự Da - Âm răng, thanh trầm'),
    ('ན', 'na', 'Căn tự Na - Âm mũi răng, thanh trầm'),
    ('པ', 'pa', 'Căn tự Pa - Âm môi không bật hơi, thanh cao'),
    ('ཕ', 'pha', 'Căn tự Pha - Âm môi bật hơi mạnh, thanh cao'),
    ('བ', 'ba', 'Căn tự Ba - Âm môi, thanh trầm'),
    ('མ', 'ma', 'Căn tự Ma - Âm mũi môi, thanh trầm'),
    ('ཙ', 'tsa', 'Căn tự Tsa - Âm đầu lưỡi tắc xát không bật hơi, thanh cao'),
    ('ཚ', 'tsha', 'Căn tự Tsha - Âm tắc xát bật hơi mạnh, thanh cao'),
    ('ཛ', 'dza', 'Căn tự Dza - Âm tắc xát, thanh trầm'),
    ('ཝ', 'wa', 'Căn tự Wa - Âm môi-răng, thanh trầm'),
    ('ཞ', 'zha', 'Căn tự Zha - Âm xát vòm thanh trầm'),
    ('ཟ', 'za', 'Căn tự Za - Âm xát răng thanh trầm'),
    ('འ', '\'a', 'Căn tự \'A - A-thở (A-chung), thanh trầm'),
    ('ཡ', 'ya', 'Căn tự Ya - Âm bán nguyên âm vòm, thanh trầm'),
    ('ར', 'ra', 'Căn tự Ra - Âm rung đầu lưỡi, thanh trầm'),
    ('ལ', 'la', 'Căn tự La - Âm cạnh lưỡi, thanh trầm'),
    ('ཤ', 'sha', 'Căn tự Sha - Âm xát vòm, thanh cao'),
    ('ས', 'sa', 'Căn tự Sa - Âm xát răng, thanh cao'),
    ('ཧ', 'ha', 'Căn tự Ha - Âm thanh môn bật hơi, thanh cao'),
    ('ཨ', 'a', 'Căn tự A - Nguyên âm A gốc, thanh cao'),
    ('ི', 'i', 'Nguyên âm Gi-gu (i)'),
    ('ུ', 'u', 'Nguyên âm Zhabs-kyu (u)'),
    ('ེ', 'e', 'Nguyên âm \'Greng-bu (e)'),
    ('ོ', 'o', 'Nguyên âm Na-ro (o)'),
    ('་', 'tsheg', 'Dấu ngắt âm tiết Tsheg'),
    ('།', 'shad', 'Dấu chấm câu Shad'),
    ('ཨོཾ', 'om', 'Chủng tự thiêng OM (Om Mani Padme Hum)'),
    ('ཧཱུྃ', 'hum', 'Chủng tự thiêng HUM (Bảo Thân Phật)'),
    ('བོད', 'bod', 'Tây Tạng (Bod)'),
    ('སློབ', 'slob', 'Học tập (Slob)'),
    ('དགེ', 'dge', 'Thiện lành / Đạo đức (Ge / Dge)'),
    ('ཆོས', 'chos', 'Phật Pháp (Dharma / Chos)'),
    ('སངས', 'sangs', 'Giác ngộ (Sangs / Sangye)')
]

TEMPLATE_DB = []
FONT_OBJ = None

def init_font():
    global FONT_OBJ
    if FONT_OBJ is not None:
        return FONT_OBJ
    font_paths = [
        'C:\\Windows\\Fonts\\himalaya.ttf',
        'C:\\Windows\\Fonts\\NotoSansTibetan-Regular.ttf',
        'C:\\Windows\\Fonts\\TibetanMachineUni.ttf',
        'C:\\Windows\\Fonts\\arial.ttf'
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                FONT_OBJ = ImageFont.truetype(p, 56)
                return FONT_OBJ
            except Exception:
                continue
    FONT_OBJ = ImageFont.load_default()
    return FONT_OBJ

def extract_hwr_features(img_gray):
    arr = np.array(img_gray, dtype=np.float32)
    bin_arr = (arr < 180).astype(np.float32)
    rows = np.any(bin_arr, axis=1)
    cols = np.any(bin_arr, axis=0)
    if not np.any(rows) or not np.any(cols):
        return None
    ymin, ymax = np.where(rows)[0][[0, -1]]
    xmin, xmax = np.where(cols)[0][[0, -1]]
    cropped = bin_arr[ymin:ymax+1, xmin:xmax+1]
    
    pil_cropped = Image.fromarray((cropped * 255).astype(np.uint8))
    pil_resized = pil_cropped.resize((32, 32), Image.Resampling.BILINEAR)
    norm_arr = np.array(pil_resized, dtype=np.float32) / 255.0
    
    blocks = []
    for r in range(8):
        for c in range(8):
            block = norm_arr[r*4:(r+1)*4, c*4:(c+1)*4]
            blocks.append(np.mean(block))
            
    h, w = cropped.shape
    aspect = float(w) / max(1.0, float(h))
    features = np.array(blocks, dtype=np.float32)
    norm = np.linalg.norm(features)
    if norm > 0:
        features = features / norm
    return features, aspect

def build_template_database():
    global TEMPLATE_DB
    if TEMPLATE_DB:
        return TEMPLATE_DB
    font = init_font()
    db = []
    for char, wylie, desc in TIBETAN_ALPHABET:
        img = Image.new('L', (100, 100), 255)
        draw = ImageDraw.Draw(img)
        draw.text((25, 20), char, font=font, fill=0)
        feats = extract_hwr_features(img)
        if feats is not None:
            vec, aspect = feats
            db.append({'char': char, 'wylie': wylie, 'desc': desc, 'vector': vec, 'aspect': aspect})
    TEMPLATE_DB = db
    return TEMPLATE_DB

def recognize_tibetan_drawing(base64_data):
    if not base64_data:
        return []
    if ',' in base64_data:
        base64_data = base64_data.split(',', 1)[1]
    img_bytes = base64.b64decode(base64_data)
    img = Image.open(io.BytesIO(img_bytes)).convert('RGBA')
    
    white_bg = Image.new('L', img.size, 255)
    if img.mode == 'RGBA':
        white_bg.paste(img.convert('L'), (0, 0), img.split()[3])
    else:
        white_bg = img.convert('L')
        
    feats = extract_hwr_features(white_bg)
    if feats is None:
        return []
    input_vec, input_aspect = feats
    db = build_template_database()
    results = []
    for item in db:
        tpl_vec = item['vector']
        tpl_aspect = item['aspect']
        sim = float(np.dot(input_vec, tpl_vec))
        aspect_ratio_diff = abs(input_aspect - tpl_aspect) / max(0.5, tpl_aspect)
        score = sim * max(0.5, 1.0 - (aspect_ratio_diff * 0.25))
        results.append({
            'char': item['char'],
            'wylie': item['wylie'],
            'desc': item['desc'],
            'confidence': max(0.0, min(1.0, score))
        })
    results.sort(key=lambda x: x['confidence'], reverse=True)
    return results[:6]

try:
    build_template_database()
except Exception as e:
    print(f"HWR Init warning: {e}", flush=True)


# ======================================================================================
# 6. SARA BOOK PDF LOADER & PARSER
# ======================================================================================
PDF_DOC = None
if os.path.exists(PDF_PATH):
    try:
        PDF_DOC = pymupdf.open(PDF_PATH)
    except Exception as e:
        print(f"Error opening PDF: {e}", flush=True)

def parse_sara_book_if_needed():
    if os.path.exists(BOOK_DATA_PATH) or not PDF_DOC:
        return
    print("Parsing Sara Book PDF structure...", flush=True)
    topic_keywords = {
        3: "Bài 1: 30 Phụ Âm Gốc (གསལ་བྱེད་སུམ་ཅུ)",
        6: "Bài 2: 4 Nguyên Âm & Cách Đọc (དབྱངས་བཞི)",
        7: "Bài 3: Bài Hát Chữ Cái (ཀ་གཞས)",
        8: "Bài 4: Chữ Chèn Trên Mgo-can (མགོ་ཅན - Ra-mgo)",
        9: "Bài 5: Chữ Chèn Trên La-mgo (ལ་མགོ་བཅུ)",
        10: "Bài 6: Chữ Chèn Dưới 'Dogs-can (འདོགས་ཅན - Ya-btags)",
        11: "Bài 7: Chữ Chèn Dưới Ra-btags & La-btags (ར་བཏགས་དང་ལ་བཏགས)",
        12: "Bài 8: Chữ Chèn Dưới Wa-zur (ཝ་ཟུར་བཅུ་གསུམ)",
        13: "Bài 9: Chữ Đảo Ngược Phạn Văn (ལོག་ཡིག)",
        14: "Bài 10: Tiền Tự - Chèn Trước (སྔོན་འཇུག - ག ད བ མ འ)",
        15: "Bài 11: Hậu Tự & Hậu Hậu Tự (རྗེས་འཇུག་དང་ཡང་འཇུག)",
        16: "Bài 12: Đánh Vần Từ Ghép Phức Hợp",
        20: "Bài 13: Đại Từ Nhân Xưng & Chào Hỏi Cơ Bản",
        25: "Bài 14: Động Từ Tồn Tại (ཡིན / རེད / ཡོད / འདུག)",
        30: "Bài 15: Sở Hữu Cách & Chỉ Định Từ",
        35: "Bài 16: Số Từ & Đếm Tiền, Thời Gian",
        40: "Bài 17: Hỏi Đường & Phương Hướng",
        50: "Bài 18: Thì Quá Khứ (དུས་འདས་པ)",
        60: "Bài 19: Cuộc Sống Tại Tu Viện & Trường Học",
        70: "Bài 20: Đàm Thoại Mua Bán & Ẩm Thực Tạng",
        80: "Bài 21: Mua Sắm Y Phục & Thuật Ngữ",
        90: "Bài 22: Y Học & Sức Khỏe Truyền Thống Tạng (སྨན་རྩིས་ཁང་)",
        100: "Bài 23: Gia Đình & Phong Tục Tây Tạng",
        110: "Bài 24: Lễ Hội & Văn Hóa Phật Giáo Tây Tạng"
    }
    pages_data = []
    current_topic = "Lời Mở Đầu"
    for page_num in range(len(PDF_DOC)):
        p_idx = page_num + 1
        page = PDF_DOC[page_num]
        raw_text = page.get_text()
        lines = [l.strip() for l in raw_text.split('\n') if l.strip() and 'ས་རཱ་' not in l and not re.match(r'^\d+$', l)]
        for k in sorted(topic_keywords.keys()):
            if p_idx >= k:
                current_topic = topic_keywords[k]
        title = f"Trang {p_idx}"
        if lines and len(lines[0]) < 50:
            title = f"Trang {p_idx}: {lines[0]}"
        full_text = " ".join(lines)
        sentences = [s.strip() for s in re.split(r'(?<=།)', full_text) if s.strip() and len(s.strip()) > 1]
        pages_data.append({
            "page_number": p_idx,
            "title": title,
            "topic": current_topic,
            "lines": lines,
            "sentences": sentences if sentences else lines,
            "full_content": "\n".join(lines)
        })
    with open(BOOK_DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(pages_data, f, ensure_ascii=False, indent=2)

parse_sara_book_if_needed()

BOOK_PAGES = []
if os.path.exists(BOOK_DATA_PATH):
    with open(BOOK_DATA_PATH, 'r', encoding='utf-8') as f:
        BOOK_PAGES = json.load(f)

USER_NOTES = {}
if os.path.exists(NOTES_DATA_PATH):
    try:
        with open(NOTES_DATA_PATH, 'r', encoding='utf-8') as f:
            USER_NOTES = json.load(f)
    except Exception:
        USER_NOTES = {}


# ======================================================================================
# 7. UNIFIED HTTP SERVER & REST API HANDLERS
# ======================================================================================
class TibetanUnifiedHandler(BaseHTTPRequestHandler):
    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Range')
        self.send_header('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges')

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.send_header('Content-Length', '0')
        self.end_headers()

    def do_GET(self):
        try:
            parsed = urllib.parse.urlparse(self.path)
            path = parsed.path
            query = urllib.parse.parse_qs(parsed.query)

            # 1. Main Root / UI
            if path == '/' or path == '/index.html':
                self.serve_file(os.path.join(APP_DIR, 'index.html'), 'text/html; charset=utf-8')
                return

            # 2. Original PDF File
            if path == '/sara-book.pdf':
                if os.path.exists(PDF_PATH):
                    self.serve_file(PDF_PATH, 'application/pdf')
                    return
                else:
                    self.send_error(404, 'PDF file not found')
                    return

            # 3. Static Assets in app/
            if path.startswith('/app/'):
                rel_path = path[5:]
                filepath = os.path.join(APP_DIR, rel_path)
                if os.path.exists(filepath) and os.path.isfile(filepath):
                    ext = os.path.splitext(filepath)[1].lower()
                    mime = {
                        '.html': 'text/html; charset=utf-8',
                        '.css': 'text/css; charset=utf-8',
                        '.js': 'application/javascript; charset=utf-8',
                        '.json': 'application/json; charset=utf-8',
                        '.png': 'image/png',
                        '.svg': 'image/svg+xml',
                        '.ico': 'image/x-icon',
                        '.pdf': 'application/pdf',
                        '.mp3': 'audio/mpeg',
                        '.wav': 'audio/wav'
                    }.get(ext, 'application/octet-stream')
                    self.serve_file(filepath, mime)
                    return

            # 4. Audio Cache Files
            if path.startswith('/audio_cache/'):
                filename = os.path.basename(path)
                filepath = os.path.join(AUDIO_CACHE_DIR, filename)
                if os.path.exists(filepath) and os.path.isfile(filepath):
                    self.serve_file(filepath, 'audio/wav')
                    return
                else:
                    self.send_error(404, 'Audio not found')
                    return

            # 5. API: Book Table of Contents & All Pages
            if path == '/api/book':
                self.send_json(BOOK_PAGES)
                return

            # 6. API: Single Page Data
            if path == '/api/page':
                p_num = int(query.get('num', [1])[0])
                if 1 <= p_num <= len(BOOK_PAGES):
                    page_data = dict(BOOK_PAGES[p_num - 1])
                    page_data['user_notes'] = USER_NOTES.get(str(p_num), {})
                    self.send_json(page_data)
                else:
                    self.send_error(404, 'Page out of range')
                return

            # 7. API: High-Res PDF Page PNG Render
            if path == '/api/pdf-page':
                p_num = int(query.get('num', [1])[0])
                if PDF_DOC and 1 <= p_num <= len(PDF_DOC):
                    page = PDF_DOC[p_num - 1]
                    pix = page.get_pixmap(dpi=140)
                    img_bytes = pix.tobytes("png")
                    self.send_response(200)
                    self.send_header('Content-Type', 'image/png')
                    self.send_header('Content-Length', str(len(img_bytes)))
                    self.send_cors_headers()
                    self.end_headers()
                    self.wfile.write(img_bytes)
                    return
                else:
                    self.send_error(404, 'PDF page not found')
                    return

            # 8. API: Get User Custom Notes
            if path == '/api/get-notes':
                self.send_json(USER_NOTES)
                return

            self.send_error(404, 'File not found')
        except Exception as e:
            traceback.print_exc()
            self.send_json({'error': str(e)}, status=500)

    def do_POST(self):
        try:
            parsed = urllib.parse.urlparse(self.path)
            path = parsed.path

            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else ""
            try:
                req_data = json.loads(body) if body else {}
            except Exception:
                req_data = {}

            # 1. API: Text Analysis + Pronunciation Coaching
            if path == '/api/analyze':
                raw_text = req_data.get('text', '').strip()
                if not raw_text:
                    self.send_json({'error': 'Empty text'}, status=400)
                    return
                
                cleaned_text = clean_legacy_tibetan(raw_text)
                if not cleaned_text:
                    cleaned_text = raw_text
                
                result = analyze_text(cleaned_text)
                for syl in result.get('syllables', []):
                    syl['coach_guide'] = get_detailed_pronunciation_guide(syl)
                    
                self.send_json(result)
                return

            # 2. API: Snipping Area / Crop Image OCR (Space + D)
            if path == '/api/crop-analyze':
                page_num = int(req_data.get('page_num', 1))
                crop_rect = req_data.get('rect', [0, 0, 100, 100])
                canvas_size = req_data.get('canvas_size', [600, 800])
                fallback_text = req_data.get('fallback_text', '')

                if not PDF_DOC or page_num < 1 or page_num > len(PDF_DOC):
                    self.send_json({'status': 'error', 'message': 'Invalid page number'}, status=400)
                    return

                page = PDF_DOC[page_num - 1]
                pdf_w = page.rect.width
                pdf_h = page.rect.height

                cw = max(1, canvas_size[0])
                ch = max(1, canvas_size[1])
                scale_x = pdf_w / cw
                scale_y = pdf_h / ch

                x0 = min(crop_rect[0], crop_rect[2]) * scale_x
                y0 = min(crop_rect[1], crop_rect[3]) * scale_y
                x1 = max(crop_rect[0], crop_rect[2]) * scale_x
                y1 = max(crop_rect[1], crop_rect[3]) * scale_y

                x0_c = max(0, min(pdf_w, min(x0, x1) - 4))
                y0_c = max(0, min(pdf_h, min(y0, y1) - 4))
                x1_c = max(0, min(pdf_w, max(x0, x1) + 4))
                y1_c = max(0, min(pdf_h, max(y0, y1) + 4))

                clip_rect = pymupdf.Rect(x0_c, y0_c, x1_c, y1_c)

                b64_img = ""
                try:
                    pix = page.get_pixmap(clip=clip_rect, dpi=140)
                    img_bytes = pix.tobytes("png")
                    b64_img = f"data:image/png;base64,{base64.b64encode(img_bytes).decode('utf-8')}"
                except Exception as pix_err:
                    print(f"Pixmap crop error: {pix_err}", flush=True)

                detected_text = extract_cropped_tibetan_text(page, clip_rect)
                if not detected_text and fallback_text:
                    detected_text = clean_legacy_tibetan(fallback_text)
                if not detected_text:
                    detected_text = "བོད"

                analysis = analyze_text(detected_text)
                for syl in analysis.get('syllables', []):
                    syl['coach_guide'] = get_detailed_pronunciation_guide(syl)

                self.send_json({
                    'status': 'success',
                    'detected_text': detected_text,
                    'cropped_image': b64_img,
                    'analysis': analysis
                })
                return

            # 3. API: Wacom / Stylus Handwriting Recognition (HWR)
            if path == '/api/hwr-recognize':
                image_data = req_data.get('image', '')
                if not image_data:
                    self.send_json({'error': 'Empty image'}, status=400)
                    return

                candidates = recognize_tibetan_drawing(image_data)
                best_char = candidates[0]['char'] if candidates else 'ཀ'

                analysis = analyze_text(best_char)
                for syl in analysis.get('syllables', []):
                    syl['coach_guide'] = get_detailed_pronunciation_guide(syl)

                audio_file = generate_tibetan_audio(best_char)
                audio_url = f"/app/audio/{audio_file}" if audio_file and audio_file.endswith('.mp3') else (f"/audio_cache/{audio_file}" if audio_file else None)

                self.send_json({
                    'status': 'success',
                    'best_char': best_char,
                    'candidates': candidates,
                    'analysis': analysis,
                    'audio_url': audio_url
                })
                return

            # 4. API: TTS Generation
            if path == '/api/tts':
                text = req_data.get('text', '').strip()
                if not text:
                    self.send_json({'error': 'Empty text'}, status=400)
                    return
                
                audio_file = generate_tibetan_audio(text)
                analysis = analyze_text(text)
                phonetic = analysis.get('phonetic', '') or analysis.get('wylie', '')
                if audio_file:
                    audio_url = f"/app/audio/{audio_file}" if audio_file.endswith('.mp3') else f"/audio_cache/{audio_file}"
                    self.send_json({
                        'status': 'success',
                        'audio_url': audio_url,
                        'text': text,
                        'phonetic': phonetic
                    })
                else:
                    self.send_json({
                        'status': 'error',
                        'message': 'TTS synthesis failed from Hugging Face service',
                        'phonetic': phonetic
                    }, status=500)
                return

            # 5. API: Ask AI Assistant (Smart Context-Aware AI Chatbot)
            if path == '/api/ask-ai':
                question = req_data.get('question', '').strip()
                target_text = req_data.get('target_text', '').strip()
                
                analysis = analyze_text(target_text)
                wylie = analysis.get('wylie', '')
                full_trans = analysis.get('full_translation', '')
                buddhist = analysis.get('buddhist_context', {})
                table_rows = analysis.get('table_rows', [])
                
                q_lower = question.lower()
                
                if 'ngữ pháp' in q_lower or 'cấu trúc' in q_lower:
                    grammar_points = []
                    for r in table_rows:
                        if r.get('pos') and r.get('pos') != 'Âm tiết':
                            grammar_points.append(f"• **{r['tibetan']}** (`{r['wylie']}`): {r['pos']} — {r['meaning']}")
                    
                    ai_answer = f"""☸️ **PHÂN TÍCH NGỮ PHÁP TÂY TẠNG CHUYÊN SÂU**:
• **Cụm từ / Câu**: {target_text}
• **Chuyển tự Wylie**: `{wylie}`
• **Bản dịch toàn câu**: *"{full_trans}"*

📌 **Cấu trúc câu Tiếng Tạng (SOV - Chủ ngữ + Bổ ngữ + Động từ)**:
{chr(10).join(grammar_points)}

💡 **Quy tắc ngữ pháp quan trọng**:
1. Tiếng Tạng đặt động từ ở cuối câu (`ཡིན` dùng cho ngôi 1, `རེད` dùng cho ngôi 2 & 3).
2. Sở hữu cách (`གི` sau vần nga/ga, `གྱི` sau vần da/ba/sa, `ཀྱི` sau vần ga/ba).
3. Trợ từ chỉ cách `ལ་` (La-don) xác định tân ngữ, vị trí hoặc đích đến."""

                elif 'phát âm' in q_lower or 'khẩu hình' in q_lower or 'đọc' in q_lower:
                    ai_answer = f"""🗣️ **HƯỚNG DẪN KHẨU HÌNH & PHÁT ÂM CHUẨN XÁC**:
• **Chữ Tạng**: {target_text}
• **Phiên âm IPA / Việt**: `{wylie}`
• **Khẩu quyết tu viện**:
1. **Thanh điệu (Tones)**: Các phụ âm nhóm 1 & 2 (`ཀ, ཁ, ཅ, ཆ, ཏ, ཐ, པ, ཕ, ཙ, ཚ, ཤ, ས, ཧ`) đọc ở **thanh cao**, dứt khoát. Nhóm 3 (`ག, ང, ཇ, ཉ, ད, ན, བ, མ, ཛ, ཝ, ཞ, ཟ, འ, ཡ`) đọc ở **thanh trầm**.
2. **Bật hơi (Aspiration)**: Phân biệt rõ âm không bật hơi (như `ཀ` - Ka) và âm bật hơi mạnh từ cuống họng (như `ཁ` - Kha).
3. **Hậu tự (Coda)**: Khi gặp hậu tự `ད, ས, ལ, ན`, nguyên âm đi trước sẽ biến âm (a ➔ e, o ➔ ö, u ➔ ü)."""

                elif 'phật học' in q_lower or 'kinh' in q_lower or 'ý nghĩa' in q_lower:
                    s_tib = buddhist.get('sutra_tibetan', 'ན་མོ་གུ་རུ་བྷྱཿ')
                    s_chant = buddhist.get('sutra_chanting', '')
                    s_trans = buddhist.get('sutra_translation', '')
                    s_insight = buddhist.get('dharma_insight', '')
                    
                    ai_answer = f"""🕉️ **Ý NGHĨA PHẬT HỌC & KINH ĐIỂN TÂY TẠNG**:
• **Từ khóa quán chiếu**: {target_text} (`{wylie}`)
• **Đoạn kinh / Chân ngôn liên quan**:
> **{s_tib}**
> *Trì tụng:* {s_chant}
> *Bản dịch:* "{s_trans}"

☸️ **Quán chiếu giải thoát**:
{s_insight}
Chữ viết tiếng Tạng được sáng lập bởi Đại thần Thonmi Sambhota dựa trên Phạn tự cổ điển với mục đích tối hậu là chuyển tải trọn vẹn giáo pháp của Đức Phật Thích Ca Mâu Ni."""

                elif 'ví dụ' in q_lower or 'câu' in q_lower:
                    ai_answer = f"""📝 **3 CÂU VÍ DỤ ĐÀM THOẠI TƯƠNG TỰ TRONG GIÁO TRÌNH SARA**:
1. བཀྲ་ཤིས་བདེ་ལེགས། ང་སློབ་མ་ཡིན།
   • *Wylie:* `bkra-shis bde-legs / nga slob-ma yin /`
   • *Dịch nghĩa:* "Xin chào! Tôi là học sinh."

2. ཁོང་གི་མིང་ལ་རྡོ་རྗེ་ཟེར་གྱི་ཡོད། ཁོང་དགེ་རྒན་རེད།
   • *Wylie:* `khong-gi ming-la rdo-rje zer-gyi yod / khong dge-rgan red /`
   • *Dịch nghĩa:* "Tên của ngài ấy là Dorje. Ngài ấy là giáo viên."

3. འདི་ངའི་བོད་ཡིག་སློབ་དེབ་རེད།
   • *Wylie:* `'di nga'i bod-yig slob-deb red /`
   • *Dịch nghĩa:* "Đây là giáo trình tiếng Tạng của tôi." """

                else:
                    ai_answer = f"""🤖 **TRẢ LỜI TRỢ LÝ AI CHO CÂU HỎI: "{question}"**:
• **Văn bản đang chọn**: {target_text}
• **Chuyển tự Wylie**: `{wylie}`
• **Bản dịch chuẩn**: *"{full_trans}"*

💡 **Giải đáp chi tiết**: Trong ngữ cảnh bài học hiện tại, cụm từ này là mẫu câu nền tảng giúp người học làm quen với ngữ pháp Tạng truyền và đàm thoại hàng ngày tại Học viện Sara Dharamsala. Bạn có thể bấm các nút gợi ý phía trên để xem sâu hơn về cấu trúc ngữ pháp, khẩu hình phát âm hoặc ý nghĩa Phật pháp."""

                self.send_json({
                    'status': 'success',
                    'answer': ai_answer,
                    'analysis': analysis
                })
                return

            # 6. API: Save User Custom Note
            if path == '/api/save-note':
                page_num = str(req_data.get('page_num', '1'))
                item_key = req_data.get('item_key', '')
                note_content = req_data.get('note_content', '')
                
                if page_num not in USER_NOTES:
                    USER_NOTES[page_num] = {}
                    
                USER_NOTES[page_num][item_key] = note_content
                
                with open(NOTES_DATA_PATH, 'w', encoding='utf-8') as f:
                    json.dump(USER_NOTES, f, ensure_ascii=False, indent=2)
                    
                self.send_json({'status': 'saved', 'page_num': page_num, 'item_key': item_key})
                return

            self.send_error(404, 'Endpoint not found')
        except Exception as e:
            traceback.print_exc()
            self.send_json({'error': str(e)}, status=500)

    def serve_file(self, filepath, content_type):
        try:
            with open(filepath, 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(content)))
            self.send_header('Accept-Ranges', 'bytes')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, f"Error reading file: {e}")

    def send_json(self, data, status=200):
        try:
            content = json.dumps(data, ensure_ascii=False).encode('utf-8')
            self.send_response(status)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(content)))
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            traceback.print_exc()

def run_server(port=8769):
    server_address = ('127.0.0.1', port)
    httpd = ThreadingHTTPServer(server_address, TibetanUnifiedHandler)
    print(f"============================================================", flush=True)
    print(f"  TIBETAN SARA BOOK & WACOM SERVER AT http://localhost:{port}", flush=True)
    print(f"============================================================", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()

if __name__ == '__main__':
    port = 8769
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    run_server(port)
