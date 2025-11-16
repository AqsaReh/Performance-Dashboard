import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import DashBoardLayoutProvider from "@/provider/dashboard.layout.provider";
import { getDictionary } from "@/app/dictionaries";

function isLikelyEncryptedToken(s: string): boolean {
  if (!s) return false;
  // allow base64/base64url/percent-encoded equals
  // long enough, mostly token-safe chars, and often ends with '=' or '%3D'
  const minLen = 40;
  if (s.length < minLen) return false;

  const safeChars = /^[A-Za-z0-9._~\-/%+=]+$/; // includes %, +, =, / (path-safe after encoding)
  if (!safeChars.test(s)) return false;

  const lower = s.toLowerCase();
  const endsLike = lower.endsWith("=") || lower.endsWith("==") || lower.endsWith("%3d") || lower.endsWith("%3d%3d");
  // not mandatory, but a strong signal
  return endsLike || s.includes("%2F") || s.includes("/");
}

function extractTokenFromPath(pathname: string, lang: string): string | null {
  // expected: /{lang}/service/action/<token...>
  const prefix = `/${lang}/capex/approval-link`;
  if (!pathname.startsWith(prefix)) return null;

  // remove the prefix and leading slash if present
  let rest = pathname.slice(prefix.length);
  if (rest.startsWith("/")) rest = rest.slice(1);

  // if nothing after /approval-link, no token present
  if (!rest) return null;

  // rest could itself contain "/" if router decoded %2F → "/"
  // we only need the "last part" per your requirement:
  const parts = rest.split("/").filter(Boolean);
  if (parts.length === 0) return null;

  const last = parts[parts.length - 1];
  return last || null;
}

const layout = async ({ children, params: { lang } }: { children: React.ReactNode; params: { lang: any } }) => {

  // Determine current pathname early so we can allowlist some public pages
  const h = headers();
  const currentPathname = h.get("x-pathname") || `/${lang}`;

  // Public allowlist: permit direct access to performance dashboard without auth
  if (currentPathname.startsWith(`/${lang}/performance-dashboard`)) {
    const trans = await getDictionary(lang);
    return (
      <DashBoardLayoutProvider trans={trans}>{children}</DashBoardLayoutProvider>
    );
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    const baseUrl = process.env.NEXTAUTH_URL;
    const pathname = currentPathname;
    const search = h.get("x-search") || "";

    // build the exact current absolute URL for callback
    const fullUrl = `${baseUrl}${pathname}${search}`;

    // detect if we’re on approvals and the last part looks like your token
    const tokenCandidate = extractTokenFromPath(pathname, lang);
    const looksLikeToken = tokenCandidate ? isLikelyEncryptedToken(tokenCandidate) : false;

    // if URL already has a callbackUrl, just preserve it
    const qs = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    const hasCallbackInUrl = qs.has("callbackUrl");

    if (looksLikeToken) {
      // only add callback when we truly have a token path
      redirect(`/${lang}/login?callbackUrl=${encodeURIComponent(fullUrl)}`);
    } else if (hasCallbackInUrl) {
      // pass through original callback if someone upstream added it
      redirect(`/${lang}/login${search.startsWith("?") ? search : `?${search}`}`);
    } else {
      // plain login
      redirect(`/${lang}/login`);
    }
  }

  const trans = await getDictionary(lang);

  return (
    <DashBoardLayoutProvider trans={trans}>{children}</DashBoardLayoutProvider>
  );
};

export default layout;
