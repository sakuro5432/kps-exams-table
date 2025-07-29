export const headers = (token?: string) => {
  const headerObject: Record<string, string> = {
    authority: "myapi.ku.th",
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9,th-TH;q=0.8,th;q=0.7",
    "app-key": "txCR5732xYYWDGdd49M3R19o1OVwdRFc",
    "content-type": "application/json",
    origin: "https://my.ku.th",
    referer: "https://my.ku.th/",
    "sec-ch-ua":
      '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  };

  if (token) {
    headerObject["x-access-token"] = token;
  }

  return headerObject;
};
