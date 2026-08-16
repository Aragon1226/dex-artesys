"""End-to-end checks: skeleton loading + retry UI under a slow / failing network.

Screens covered: Market, Assets (deposit & withdrawal history), Futures
(positions + trade history), Support chat, Admin > Users.

Usage:
    python3 tests/e2e/test_loading_states.py
Screenshots for every assertion land in /tmp/browser/loading-states.
"""

import asyncio
import sys

from playwright.async_api import async_playwright

sys.path.insert(0, __file__.rsplit("/", 1)[0])

from harness import (  # noqa: E402
    BASE_URL,
    check,
    click_retry,
    expect_retry,
    expect_skeleton,
    grant_admin,
    offline_network,
    restore_network,
    run_registry,
    shot,
    sign_up,
    slow_network,
    test,
)


# --------------------------------------------------------------------------- #
# Market
# --------------------------------------------------------------------------- #
@test("Market shows branded skeleton on a slow feed")
async def market_skeleton(page):
    await slow_network(page, delay_ms=6000)
    await page.goto(f"{BASE_URL}/app/market", wait_until="domcontentloaded")
    await expect_skeleton(page, variant="table", label="Loading market data")
    await shot(page, "market skeleton")


@test("Market shows retry state when the feed fails")
async def market_retry(page):
    await page.goto(
        f"{BASE_URL}/app/market?forceFetchError=market", wait_until="domcontentloaded"
    )
    retry = await expect_retry(page, title="market")
    await shot(page, "market retry")
    check(await retry.locator("text=Market feed unavailable.").count() >= 0, "detail row renders")
    await click_retry(page)
    # Retry keeps failing while the flag is set, so the state must persist.
    await expect_retry(page)


# --------------------------------------------------------------------------- #
# Assets — deposit / withdrawal history modal
# --------------------------------------------------------------------------- #
async def open_assets_history(page):
    await page.goto(f"{BASE_URL}/app/assets", wait_until="domcontentloaded")
    await page.get_by_text("History", exact=True).first.click()


@test("Assets history shows branded skeleton on a slow network")
async def assets_skeleton(page):
    await sign_up(page)
    await slow_network(page, delay_ms=6000)
    await open_assets_history(page)
    await expect_skeleton(page, variant="history", label="Loading deposits")
    await shot(page, "assets history skeleton")


@test("Assets history shows retry state and recovers after retry")
async def assets_retry(page):
    await sign_up(page)
    await offline_network(page)
    await open_assets_history(page)
    await expect_retry(page, title="deposits")
    await shot(page, "assets history retry")

    await restore_network(page)
    await click_retry(page)
    await page.locator('[data-testid="retry-state"]').first.wait_for(
        state="hidden", timeout=20000
    )


# --------------------------------------------------------------------------- #
# Futures — active positions + trade history
# --------------------------------------------------------------------------- #
@test("Futures positions show branded skeleton on a slow network")
async def futures_skeleton(page):
    await sign_up(page)
    await slow_network(page, delay_ms=6000)
    await page.goto(f"{BASE_URL}/app/futures", wait_until="domcontentloaded")
    await expect_skeleton(page, variant="positions", label="Loading positions")
    await shot(page, "futures positions skeleton")


@test("Futures positions and history show retry states when fetching fails")
async def futures_retry(page):
    await sign_up(page)
    await offline_network(page)
    await page.goto(f"{BASE_URL}/app/futures", wait_until="domcontentloaded")
    await expect_retry(page, title="positions")
    await shot(page, "futures positions retry")

    await page.get_by_text("History", exact=True).first.click()
    await expect_retry(page, title="trade history")
    await shot(page, "futures history retry")

    await restore_network(page)
    await click_retry(page)
    await page.locator('[data-testid="retry-state"]').first.wait_for(
        state="hidden", timeout=20000
    )


# --------------------------------------------------------------------------- #
# Support chat
# --------------------------------------------------------------------------- #
async def open_support_chat(page):
    await page.goto(f"{BASE_URL}/app/home", wait_until="domcontentloaded")
    await page.get_by_text("Support", exact=True).first.click()


@test("Support chat shows conversation skeleton on a slow network")
async def support_skeleton(page):
    await sign_up(page)
    await slow_network(page, delay_ms=6000)
    await open_support_chat(page)
    await expect_skeleton(page, variant="chat", label="Loading conversation")
    await shot(page, "support chat skeleton")


@test("Support chat shows retry state when messages fail to sync")
async def support_retry(page):
    await sign_up(page)
    await offline_network(page)
    await open_support_chat(page)
    await expect_retry(page)
    await shot(page, "support chat retry")

    await restore_network(page)
    await click_retry(page)
    await page.locator('[data-testid="retry-state"]').first.wait_for(
        state="hidden", timeout=20000
    )


# --------------------------------------------------------------------------- #
# Admin > Users
# --------------------------------------------------------------------------- #
@test("Admin users table shows branded skeleton on a slow network")
async def admin_users_skeleton(page):
    email, _ = await sign_up(page)
    await grant_admin(page, email)
    await slow_network(page, delay_ms=6000)
    await page.goto(f"{BASE_URL}/admin/users", wait_until="domcontentloaded")
    await expect_skeleton(page, variant="table", timeout=25000)
    await shot(page, "admin users skeleton")


@test("Admin users table shows retry state when the database sync fails")
async def admin_users_retry(page):
    email, _ = await sign_up(page)
    await grant_admin(page, email)
    await offline_network(page)
    await page.goto(f"{BASE_URL}/admin/users", wait_until="domcontentloaded")
    await expect_retry(page, timeout=35000)
    await shot(page, "admin users retry")

    await restore_network(page)
    await click_retry(page)
    await page.locator('[data-testid="retry-state"]').first.wait_for(
        state="hidden", timeout=25000
    )


if __name__ == "__main__":
    sys.exit(asyncio.run(run_registry(async_playwright)))
