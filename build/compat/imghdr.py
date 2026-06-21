"""
Compatibility shim: imghdr was removed in Python 3.13.
Provides the subset used by Sphinx (including the .tests extension hook).
"""

# Sphinx appends its own test functions to this list (e.g. test_svg).
tests = []


def what(file=None, h=None, f=None):
    """Identify image type from a file path or byte header."""
    if file and h is None:
        try:
            with open(file, 'rb') as fp:
                h = fp.read(32)
        except Exception:
            return None

    if not h:
        return None

    # Run any externally registered tests first (e.g. Sphinx's SVG test).
    for test in tests:
        result = test(h, f)
        if result:
            return result

    if h[:8] == b'\x89PNG\r\n\x1a\n':
        return 'png'
    if h[:3] == b'\xff\xd8\xff':
        return 'jpeg'
    if h[:6] in (b'GIF87a', b'GIF89a'):
        return 'gif'
    if h[:2] in (b'BM', b'BA', b'CI', b'CP', b'IC', b'PT'):
        return 'bmp'
    if h[:4] in (b'MM\x00*', b'II*\x00'):
        return 'tiff'
    if h[:4] == b'RIFF' and h[8:12] == b'WEBP':
        return 'webp'
    return None
