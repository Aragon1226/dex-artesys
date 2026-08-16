"""Visual regression snapshots for the branded skeleton + retry UI.

Screens: Market, Assets history, Futures positions/history, Support chat,
Admin > Users — each captured in both the dark and light theme.

Usage:
    python3 tests/e2e/test_visual_regression.py
    E2E_UPDATE_SNAPSHOTS=1 python3 tests/e2e/test_visual_regression.py   # re-record
"""

import asyncio
import sys

from playwright.async_api import async_playwright

sys.path.insert(0, __file__.rsplit("/", 1)[0])

from harness import (  # noqa: E402
    BASE_URL,
    expect_retry,
    expect_skeleton,
    grant_admin,
    offline_network,
    run_registry,
    sign_up,
    slow_network,
    test,
)
from visual import THEMES, apply_theme, snapshot  # noqa: E402


async def capture(page, name, theme, locator):
    await apply_theme(page, theme)
    await snapshot(page, name, theme, locator=locator)


# --------------------------------------------------------------------------- #
# Market
# --------------------------------------------------------------------------- #
@test("visual: market skeleton in both themes")
async def market_skeleton_visual(page):
    for theme in THEMES:
        await slow_network(page, delay_ms=20000)
        await page.goto(f"{BASE_URL}/app/market", wait_until="domcontentloaded")
        block = await expect_skeleton(page, variant="table")
        await capture(page, "market skeleton", theme, block)


@test("visual: market retry state in both themes")
async def market_retry_visual(page):
    for theme in THEMES:
        await page.goto(
            f"{BASE_URL}/app/market?forceFetchError=market", wait_until="domcontentloaded"
        )
        retry = await expect_retry(page, title="market")
        await capture(page, "market retry", theme, retry)


# --------------------------------------------------------------------------- #
# Assets — deposit / withdrawal history
# --------------------------------------------------------------------------- #
async def open_assets_history(page):
    await page.goto(f"{BASE_URL}/app/assets", wait_until="domcontentloaded")
    await page.get_by_text("History", exact=True).first.click()


@test("visual: assets history skeleton in both themes")
async def assets_skeleton_visual(page):
    await sign_up(page)
    for theme in THEMES:
        await slow_network(page, delay_ms=20000)
        await open_assets_history(page)
        block = await expect_skeleton(page, variant="history")
        await capture(page, "assets history skeleton", theme, block)


@test("visual: assets history retry state in both themes")
async def assets_retry_visual(page):
    await sign_up(page)
    await offline_network(page)
    for theme in THEMES:
        await open_assets_history(page)
        retry = await expect_retry(page, title="deposits")
        await capture(page, "assets history retry", theme, retry)


# --------------------------------------------------------------------------- #
# Futures
# --------------------------------------------------------------------------- #
@test("visual: futures positions skeleton in both themes")
async def futures_skeleton_visual(page):
    await sign_up(page)
    for theme in THEMES:
        await slow_network(page, delay_ms=20000)
        await page.goto(f"{BASE_URL}/app/futures", wait_until="domcontentloaded")
        block = await expect_skeleton(page, variant="positions")
        await capture(page, "futures positions skeleton", theme, block)


@test("visual: futures positions and history retry states in both themes")
async def futures_retry_visual(page):
    await sign_up(page)
    await offline_network(page)
    for theme in THEMES:
        await page.goto(f"{BASE_URL}/app/futures", wait_until="domcontentloaded")
        retry = await expect_retry(page, title="positions")
        await capture(page, "futures positions retry", theme, retry)

        await page.get_by_text("History", exact=True).first.click()
        history_retry = await expect_retry(page, title="trade history")
        await capture(page, "futures history retry", theme, history_retry)


# --------------------------------------------------------------------------- #
# Support chat
# --------------------------------------------------------------------------- #
async def open_support_chat(page):
    await page.goto(f"{BASE_URL}/app/home", wait_until="domcontentloaded")
    await page.get_by_text("Support", exact=True).first.click()


@test("visual: support chat skeleton in both themes")
async def support_skeleton_visual(page):
    await sign_up(page)
    for theme in THEMES:
        await slow_network(page, delay_ms=20000)
        await open_support_chat(page)
        block = await expect_skeleton(page, variant="chat")
        await capture(page, "support chat skeleton", theme, block)


@test("visual: support chat retry state in both themes")
async def support_retry_visual(page):
    await sign_up(page)
    await offline_network(page)
    for theme in THEMES:
        await open_support_chat(page)
        retry = await expect_retry(page)
        await capture(page, "support chat retry", theme, retry)


# --------------------------------------------------------------------------- #
# Admin > Users
# --------------------------------------------------------------------------- #
@test("visual: admin users skeleton in both themes")
async def admin_skeleton_visual(page):
    email, _ = await sign_up(page)
    await grant_admin(page, email)
    for theme in THEMES:
        await slow_network(page, delay_ms=20000)
        await page.goto(f"{BASE_URL}/admin/users", wait_until="domcontentloaded")
        block = await expect_skeleton(page, variant="table", timeout=25000)
        await capture(page, "admin users skeleton", theme, block)


@test("visual: admin users retry state in both themes")
async def admin_retry_visual(page):
    email, _ = await sign_up(page)
    await grant_admin(page, email)
    await offline_network(page)
    for theme in THEMES:
        await page.goto(f"{BASE_URL}/admin/users", wait_until="domcontentloaded")
        retry = await expect_retry(page, timeout=35000)
        await capture(page, "admin users retry", theme, retry)


if __name__ == "__main__":
    sys.exit(asyncio.run(run_registry(async_playwright)))
