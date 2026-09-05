"""Capture FINAL v4 Next.js portfolio screenshots.

v4 changes from v3:
- Wait 3s after page load (animation settle)
- forceShowAll before hero capture AND before fullpage
- Verify WebGLFallback presence in DOM before screenshot
- Real scroll top -> bottom -> top with step delays (Framer Motion whileInView)
- Force WebGL check returns false so CSS fallback renders
- 3D background now uses z-0 (was -z-10) so it is actually visible

Outputs:
- nextjs-v4-desktop-fullpage.png
- nextjs-v4-desktop-hero.png
- nextjs-v4-mobile-375.png
"""
import os
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT_DIR = Path("/home/ubs/projects-analysis/portfolio-next/screenshots")
OUT_DIR.mkdir(parents=True, exist_ok=True)

URL = "http://127.0.0.1:3100/"

FORCE_SHOW_ALL_JS = r"""
() => {
  // Flip any element with opacity 0 or hidden via framer-controlled transform back to visible
  const all = document.querySelectorAll('*');
  let flipped = 0;
  for (const el of all) {
    const cs = window.getComputedStyle(el);
    const opacity = parseFloat(cs.opacity || '1');
    const transform = cs.transform || '';
    if (opacity === 0 || opacity < 0.05) {
      el.style.opacity = '1';
      flipped++;
    }
    if (transform && transform !== 'none' && el.hasAttribute('style')) {
      const t = transform.match(/matrix\(([^)]+)\)/);
      if (t) {
        const parts = t[1].split(',').map(s => parseFloat(s.trim()));
        if (parts.length === 6) {
          const scaleX = parts[0];
          const scaleY = parts[3];
          if (scaleX === 0 || scaleY === 0) {
            el.style.transform = 'none';
            flipped++;
          }
        }
      }
    }
  }
  return flipped;
}
"""

CHECK_FALLBACK_JS = r"""
() => {
  // Verify the WebGLFallback (gradient mesh + orbs) is in the DOM and visible
  const orbs = document.querySelectorAll('.blur-3xl');
  const gradients = Array.from(document.querySelectorAll('div[style*="radial-gradient"]'));
  return {
    orbCount: orbs.length,
    gradientCount: gradients.length,
  };
}
"""


def force_webgl_false(page):
    """Stub WebGL so the CSS fallback is rendered (matches what headless shows)."""
    page.add_init_script(
        """
        const origCreate = document.createElement.bind(document);
        document.createElement = function(tag, ...rest) {
          const el = origCreate(tag, ...rest);
          if (String(tag).toLowerCase() === 'canvas') {
            const origGet = el.getContext.bind(el);
            el.getContext = function(type, ...a) {
              if (String(type).startsWith('webgl')) return null;
              return origGet(type, ...a);
            };
          }
          return el;
        };
        """
    )


def warmup_scroll(page):
    """Real scroll top -> bottom -> top with step delays to trigger whileInView."""
    total = page.evaluate("document.documentElement.scrollHeight")
    y = 0
    step = 400
    while y <= total:
        page.evaluate(f"window.scrollTo(0, {y})")
        time.sleep(0.18)
        y += step
    page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
    time.sleep(0.6)
    page.evaluate("window.scrollTo(0, 0)")
    time.sleep(0.5)


def force_show_all(page):
    return page.evaluate(FORCE_SHOW_ALL_JS)


def capture_desktop(browser):
    print("[desktop] launching 1440x900 context")
    ctx = browser.new_context(
        viewport={"width": 1440, "height": 900},
        device_scale_factor=1,
        color_scheme="dark",
    )
    page = ctx.new_page()
    force_webgl_false(page)

    print(f"[desktop] goto {URL}")
    page.goto(URL, wait_until="domcontentloaded", timeout=30000)

    # Wait for hero photo to load
    try:
        page.wait_for_selector("img[alt='Ubim portrait']", state="attached", timeout=10000)
        page.wait_for_function(
            "() => { const i = document.querySelector(\"img[alt='Ubim portrait']\"); return i && i.complete && i.naturalWidth > 0; }",
            timeout=10000,
        )
        print("[desktop] hero photo loaded")
    except Exception as e:
        print(f"[desktop] WARN: hero photo wait: {e}")

    # v4: 3s settle for animations
    print("[desktop] waiting 3s for animation settle...")
    time.sleep(3.0)

    # Verify fallback is present
    info = page.evaluate(CHECK_FALLBACK_JS)
    print(f"[desktop] fallback check: orbs={info['orbCount']} gradients={info['gradientCount']}")

    # Warmup scroll for whileInView
    warmup_scroll(page)
    time.sleep(0.8)

    # Re-trigger IntersectionObserver: nudge scroll slightly so hero FadeIn fires
    page.evaluate("window.scrollTo(0, 50)")
    time.sleep(0.4)
    page.evaluate("window.scrollTo(0, 0)")
    time.sleep(0.6)

    # Force-show hidden elements FIRST so hero content actually paints
    n = force_show_all(page)
    print(f"[desktop] forceShowAll flipped {n} elements")
    time.sleep(0.5)

    # Hero screenshot (above-the-fold)
    hero_path = OUT_DIR / "nextjs-v4-desktop-hero.png"
    page.screenshot(path=str(hero_path), full_page=False)
    print(f"[desktop] saved hero -> {hero_path}")

    # Re-run forceShowAll before fullpage (in case more elements rendered off-screen)
    n2 = force_show_all(page)
    print(f"[desktop] forceShowAll (2nd pass) flipped {n2} elements")

    # Full-page screenshot
    full_path = OUT_DIR / "nextjs-v4-desktop-fullpage.png"
    page.screenshot(path=str(full_path), full_page=True)
    print(f"[desktop] saved fullpage -> {full_path}")

    ctx.close()


def capture_mobile(browser):
    print("[mobile] launching 375x812 context (iPhone-ish)")
    ctx = browser.new_context(
        viewport={"width": 375, "height": 812},
        device_scale_factor=2,
        is_mobile=True,
        has_touch=True,
        color_scheme="dark",
    )
    page = ctx.new_page()
    force_webgl_false(page)

    print(f"[mobile] goto {URL}")
    page.goto(URL, wait_until="domcontentloaded", timeout=30000)
    try:
        page.wait_for_function(
            "() => { const i = document.querySelector(\"img[alt='Ubim portrait']\"); return i && i.complete && i.naturalWidth > 0; }",
            timeout=10000,
        )
        print("[mobile] hero photo loaded")
    except Exception as e:
        print(f"[mobile] WARN: hero photo wait: {e}")

    # v4: 3s settle
    print("[mobile] waiting 3s for animation settle...")
    time.sleep(3.0)

    info = page.evaluate(CHECK_FALLBACK_JS)
    print(f"[mobile] fallback check: orbs={info['orbCount']} gradients={info['gradientCount']}")

    warmup_scroll(page)
    time.sleep(0.8)

    n = force_show_all(page)
    print(f"[mobile] forceShowAll flipped {n} elements")

    full_path = OUT_DIR / "nextjs-v4-mobile-375.png"
    page.screenshot(path=str(full_path), full_page=True)
    print(f"[mobile] saved -> {full_path}")
    ctx.close()


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--use-gl=swiftshader",
                "--enable-webgl",
                "--ignore-gpu-blocklist",
            ],
        )
        try:
            capture_desktop(browser)
        finally:
            try:
                capture_mobile(browser)
            finally:
                browser.close()

    # Verify
    for fname in (
        "nextjs-v4-desktop-fullpage.png",
        "nextjs-v4-desktop-hero.png",
        "nextjs-v4-mobile-375.png",
    ):
        p = OUT_DIR / fname
        if p.exists():
            size = p.stat().st_size
            print(f"OK {fname} ({size:,} bytes)")
        else:
            print(f"MISSING {fname}")
            sys.exit(1)


if __name__ == "__main__":
    main()
