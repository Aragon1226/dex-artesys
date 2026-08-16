"""Shared Playwright harness for the CrypX-Pro loading/retry end-to-end tests.

Run the suite with:  python3 tests/e2e/test_loading_states.py
"""

import asyncio
import json
import os
import time
import traceback
import uuid

BASE_URL = os.environ.get("E2E_BASE_URL", "http://localhost:8080")
SHOTS_DIR = os.environ.get("E2E_SHOTS_DIR", "/tmp/browser/loading-states")

# Every backend the app talks to for the screens under test.
DATA_URL_PATTERNS = [
    "**/rest/v1/**",
    "**/api.binance.com/**",
    "**/api.binance.us/**",
    "**/api.coincap.io/**",
]

ADMIN_PERMISSIONS_KEY = "admin_portal_permissions_v2"
FULL_ADMIN_PAGES = {
    "dashboard": True,
    "users": True,
    "financial-status": True,
    "deposit-requests": True,
    "withdrawals": True,
    "futures": True,
    "sample-tokens": True,
    "kyc": True,
    "wallets": True,
    "customer-service": True,
    "support": True,
    "administrator": True,
}


# --------------------------------------------------------------------------- #
# Tiny test registry (pytest is not available in this environment)
# --------------------------------------------------------------------------- #
TESTS = []


def test(name):
    def wrap(fn):
        TESTS.append((name, fn))
        return fn

    return wrap


class AssertionFail(Exception):
    pass


def check(condition, message):
    if not condition:
        raise AssertionFail(message)


async def run_registry(playwright_module):
    os.makedirs(SHOTS_DIR, exist_ok=True)
    passed, failed = [], []
    async with playwright_module() as p:
        browser = await p.chromium.launch(headless=True)
        for name, fn in TESTS:
            context = await browser.new_context(viewport={"width": 1280, "height": 1800})
            page = await context.new_page()
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            started = time.time()
            try:
                await fn(page)
                passed.append(name)
                print(f"PASS  {name}  ({time.time() - started:.1f}s)")
            except Exception as exc:  # noqa: BLE001 - report every failure
                failed.append((name, exc))
                print(f"FAIL  {name}  ({time.time() - started:.1f}s)")
                traceback.print_exc()
                try:
                    await page.screenshot(path=f"{SHOTS_DIR}/{slug(name)}-failure.png")
                except Exception:
                    pass
            finally:
                await context.close()
        await browser.close()

    print(f"\n{len(passed)} passed, {len(failed)} failed")
    for name, exc in failed:
        print(f"  - {name}: {exc}")
    return 0 if not failed else 1


def slug(name):
    return "".join(c if c.isalnum() else "-" for c in name.lower()).strip("-")


# --------------------------------------------------------------------------- #
# Network conditions
# --------------------------------------------------------------------------- #
async def slow_network(page, delay_ms=4000, patterns=None):
    """Delay every data request so loading skeletons stay on screen."""

    async def handler(route):
        await asyncio.sleep(delay_ms / 1000)
        try:
            await route.continue_()
        except Exception:
            pass

    for pattern in patterns or DATA_URL_PATTERNS:
        await page.route(pattern, handler)


async def offline_network(page, patterns=None):
    """Fail every data request so retry states render."""

    async def handler(route):
        try:
            await route.abort("failed")
        except Exception:
            pass

    for pattern in patterns or DATA_URL_PATTERNS:
        await page.route(pattern, handler)


async def restore_network(page, patterns=None):
    for pattern in patterns or DATA_URL_PATTERNS:
        try:
            await page.unroute(pattern)
        except Exception:
            pass


# --------------------------------------------------------------------------- #
# Auth helpers
# --------------------------------------------------------------------------- #
def fresh_credentials():
    token = uuid.uuid4().hex[:10]
    return f"e2e-{token}@crypxpro-e2e.test", "E2ePassw0rd!42"


async def sign_up(page, email=None, password=None):
    """Create a brand new account through the UI and land in the app shell."""
    email, password = (email, password) if email else fresh_credentials()
    await page.goto(f"{BASE_URL}/auth", wait_until="domcontentloaded")

    # The form opens in sign-in mode; flip to sign-up once React has hydrated.
    await page.get_by_placeholder("Email Address").first.wait_for(timeout=30000)
    create_btn = page.get_by_role("button", name="Create Account", exact=True)
    for _ in range(10):
        if await create_btn.count():
            break
        await page.get_by_role("button", name="Sign Up", exact=True).first.click()
        try:
            await create_btn.first.wait_for(timeout=2000)
        except Exception:
            continue
    check(await create_btn.count() > 0, "could not switch the auth form into sign-up mode")

    await page.get_by_placeholder("Display Name").first.fill("E2E Tester")
    await page.get_by_placeholder("Email Address").first.fill(email)
    await page.get_by_placeholder("Password", exact=True).first.fill(password)

    terms = page.locator('input[type="checkbox"]')
    if await terms.count():
        try:
            await terms.first.check()
        except Exception:
            pass

    await page.get_by_role("button", name="Create Account", exact=True).first.click()
    await page.wait_for_url("**/app/**", timeout=45000)
    return email, password


async def grant_admin(page, email):
    """Seed the client-side admin permission cache for the given account."""
    configs = {
        email.lower().strip(): {
            "email": email.lower().strip(),
            "isAdmin": True,
            "permissions": FULL_ADMIN_PAGES,
        }
    }
    await page.evaluate(
        "([key, value]) => localStorage.setItem(key, value)",
        [ADMIN_PERMISSIONS_KEY, json.dumps(configs)],
    )


# --------------------------------------------------------------------------- #
# Assertions
# --------------------------------------------------------------------------- #
async def expect_skeleton(page, variant=None, timeout=15000, label=None):
    selector = '[data-testid="loading-block"]'
    if variant:
        selector += f'[data-variant="{variant}"]'
    block = page.locator(selector).first
    await block.wait_for(state="visible", timeout=timeout)
    check(
        await page.locator('[data-testid="brand-loader"]').first.is_visible(),
        "branded loader mark should render above the skeleton rows",
    )
    if label:
        await page.get_by_text(label, exact=False).first.wait_for(timeout=timeout)
    return block


async def expect_retry(page, title=None, timeout=25000):
    retry = page.locator('[data-testid="retry-state"]').first
    await retry.wait_for(state="visible", timeout=timeout)
    if title:
        check(
            title.lower() in (await retry.inner_text()).lower(),
            f"retry state should mention {title!r}",
        )
    check(
        await retry.locator('[data-testid="retry-button"]').first.is_visible(),
        "retry state should expose a retry button",
    )
    return retry


async def click_retry(page):
    await page.locator('[data-testid="retry-button"]').first.click()


async def shot(page, name):
    os.makedirs(SHOTS_DIR, exist_ok=True)
    await page.screenshot(path=f"{SHOTS_DIR}/{slug(name)}.png")
