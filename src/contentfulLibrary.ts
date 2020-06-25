import { createClient } from "contentful";
import * as Cookies from "js-cookie";

const PREVIEW_ENV = process.env.CONTENTFUL_ENVIRONMENT;
const PREVIEW_SPACE = "jscbjpd3290q";
const PREVIEW_ACCESS_TOKEN = "_EkxyeOSKhKKpWRXPF19e5UksLOe6agMDBEGuZN2HDQ";

const CDN_ENV = process.env.CONTENTFUL_ENVIRONMENT;
const CDN_SPACE = "jscbjpd3290q";
const CDN_ACCESS_TOKEN = "U42di5LwS7O4PEXMkqXdp6-LduCwf_u4bTyAdCwp0P4";

// Called from clientside
export const getContentFromContentful = <T extends object>(
  entryId: string
): Promise<T> => {
  if (!entryId) throw new Error("You need to provide entryId.");
  const isPreview = Cookies.get("contentType") === "preview";

  const environment = isPreview ? PREVIEW_ENV : CDN_ENV;
  const space = isPreview ? PREVIEW_SPACE! : CDN_SPACE!;
  const accessToken = isPreview ? PREVIEW_ACCESS_TOKEN! : CDN_ACCESS_TOKEN!;
  if (isPreview)
    console.log(
      `Getting Contentful data using Preview keys from "${environment}" environment`
    );
  else
    console.log(
      `Getting Contentful data using Live CDN keys from "${environment}" environment`
    );

  const client = createClient({
    environment,
    space,
    accessToken,
    host: isPreview ? "preview.contentful.com" : undefined,
  });

  return client.getEntry(entryId, { include: 2 }).catch((e) => {
    console.log(e);
    return { fields: null } as T;
  }) as Promise<T>;
};

// Called from clientside
export const dummySSO = (login: string, password: string) => {
  const coolOrNotCool = login.toLowerCase() === "xolvio" && password === "ftw";
  if (!coolOrNotCool) return false;

  Cookies.set("contentType", "preview");
  Cookies.set("previewSpaceId", PREVIEW_SPACE);
  Cookies.set("previewEnvironmentId", PREVIEW_ENV);
  return true;
};

// Called from clientside
export const dummyLogout = () => {
  Cookies.remove("contentType");
  Cookies.remove("previewSpaceId");
  Cookies.remove("previewEnvironmentId");
  return true;
};
