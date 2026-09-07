/**
 * Small compatibility layer that exposes a react-router-dom-like API on top of
 * TanStack Router. It lets the ported pages keep using string paths,
 * `navigate(-1)`, `NavLink` render props and `useSearchParams` unchanged.
 */
import * as React from "react";
import { Link as TanstackLink, Outlet, useRouter, useRouterState } from "@tanstack/react-router";

export { Outlet };

type NavigateOptions = { replace?: boolean; state?: unknown };

export function useNavigate() {
  const router = useRouter();

  return React.useCallback(
    (to: string | number, options?: NavigateOptions) => {
      if (typeof to === "number") {
        if (to < 0) router.history.back();
        else if (to > 0) router.history.forward();
        return;
      }
      if (options?.replace) router.history.replace(to);
      else router.history.push(to);
    },
    [router],
  );
}

export function useLocation() {
  const location = useRouterState({ select: (s) => s.location });
  return {
    pathname: location.pathname,
    search: location.searchStr ?? "",
    hash: location.hash ? `#${location.hash.replace(/^#/, "")}` : "",
    state: location.state as unknown,
    key: location.href,
  };
}

type SearchParamsInit = URLSearchParams | string | Record<string, string>;

export function useSearchParams(): [URLSearchParams, (next: SearchParamsInit) => void] {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();
  const params = React.useMemo(() => new URLSearchParams(search), [search]);

  const setParams = React.useCallback(
    (next: SearchParamsInit) => {
      const str =
        typeof next === "string"
          ? next.replace(/^\?/, "")
          : new URLSearchParams(next as Record<string, string>).toString();
      navigate(str ? `${pathname}?${str}` : pathname, { replace: true });
    },
    [navigate, pathname],
  );

  return [params, setParams];
}

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  replace?: boolean;
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, replace, children, ...rest }, ref) => (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <TanstackLink ref={ref} to={to as any} replace={replace} {...(rest as any)}>
      {children}
    </TanstackLink>
  ),
);
Link.displayName = "Link";

type NavLinkRender = { isActive: boolean; isPending: boolean };

type NavLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className" | "children"
> & {
  to: string;
  end?: boolean;
  replace?: boolean;
  className?: string | ((state: NavLinkRender) => string);
  children?: React.ReactNode | ((state: NavLinkRender) => React.ReactNode);
};

export function NavLink({ to, end, className, children, replace, ...rest }: NavLinkProps) {
  const pathname = useLocation().pathname;
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
  const state: NavLinkRender = { isActive, isPending: false };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <TanstackLink
      to={to as any}
      replace={replace}
      className={typeof className === "function" ? className(state) : className}
      {...(rest as any)}
    >
      {typeof children === "function" ? children(state) : children}
    </TanstackLink>
  );
}

export function Navigate({ to, replace = true }: { to: string; replace?: boolean }) {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate(to, { replace });
  }, [navigate, to, replace]);
  return null;
}
