"""
Patch for Sphinx 7.4 + jupyter-book 0.15 + Python 3.13:
jupyter-book passes outdir as str, but Sphinx 7.4's _file_checksum
expects a Path. Convert transparently.
"""
from pathlib import Path


def _apply_patch():
    try:
        import sphinx.builders.html._assets as _assets
        _orig = _assets._file_checksum

        def _fixed(outdir, filename):
            if isinstance(outdir, str):
                outdir = Path(outdir)
            return _orig(outdir, filename)

        _assets._file_checksum = _fixed
    except Exception:
        pass


_apply_patch()


def setup(app):
    return {"version": "0.1", "parallel_read_safe": True, "parallel_write_safe": True}
