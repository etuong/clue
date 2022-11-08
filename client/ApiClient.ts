import * as Cookies from "js-cookie";

export class ApiClient {
  private static host = "http://localhost:8080";

  public static get = async (path: string) => ApiClient.doRequest("GET", path);

  public static post = async (path: string, body?: any) =>
    ApiClient.doRequest("POST", path, body);

  public static put = async (path: string, body: any) =>
    ApiClient.doRequest("PUT", path, body);

  public static delete = async (path: string) =>
    ApiClient.doRequest("DELETE", path);

  private static doRequest = async (
    method: string,
    path: string,
    body?: any
  ) => {
    const response = await fetch(`${ApiClient.host}/api${path}`, {
      method,
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN")!,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`${path} returned ${response.status}`);
    }
    return response.json();
  };
}
