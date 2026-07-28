const ipCache = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

/**
 * Basic in-memory rate limiter.
 * @param ip The IP address of the client
 * @param limit Maximum number of requests allowed in the window
 * @param windowMs Time window in milliseconds
 */
export function rateLimit(ip: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const cached = ipCache.get(ip);
  
  // Clean up cache periodically (remove items older than resetTime)
  if (ipCache.size > 1000) {
    for (const [key, value] of ipCache.entries()) {
      if (now > value.resetTime) {
        ipCache.delete(key);
      }
    }
  }

  if (!cached || now > cached.resetTime) {
    const resetTime = now + windowMs;
    ipCache.set(ip, { count: 1, resetTime });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetTime,
    };
  }
  
  if (cached.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetTime: cached.resetTime,
    };
  }
  
  cached.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - cached.count,
    resetTime: cached.resetTime,
  };
}

export function getClientIp(req: Request): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}
