import { ReactElement } from "react";
import ReactDOM from "react-dom";
import { PluginMeta } from "../../base";

function friendlyErrorMessage(errorMessage: string) {
  if (errorMessage === "please enter your username") {
    return "Please enter your username";
  }
  if (errorMessage === "please enter your password") {
    return "Please enter your password";
  }
  if (errorMessage === "either username or password are not valid") {
    return "Invalid username or password";
  }
  return errorMessage;
}

function LoginPage({ errorMessage }: { errorMessage: string | null }) {
  return (
    <div
      style={{ minHeight: "100vh" }}
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <div className="card p-4 d-flex flex-column">
        <img
          src="https://munzee.global.ssl.fastly.net/images/munzee-logo.svg"
          style={{ maxHeight: 100, maxWidth: "90%" }}
          className="align-self-center pb-2"
        />
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {friendlyErrorMessage(errorMessage)}
          </div>
        )}
        <form className="d-flex flex-column" method="POST">
          <legend>Sign in</legend>
          <div className="mb-3">
            <label htmlFor="usernameInput" className="form-label">
              Username
            </label>
            <input type="text" className="form-control" id="usernameInput" name="username" />
          </div>
          <div className="mb-3">
            <label htmlFor="passwordInput" className="form-label">
              Password
            </label>
            <input type="password" className="form-control" id="passwordInput" name="password" />
          </div>
          <input className="align-self-end btn btn-success" type="submit" value="Login" />
        </form>
      </div>
    </div>
  );
}

function ApprovalPage({
  username,
  applicationName,
}: {
  username: string;
  applicationName: string;
}) {
  return (
    <div
      style={{ minHeight: "100vh" }}
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <div className="card m-2 px-4 py-2 d-flex flex-column" style={{ maxWidth: 400 }}>
        <img
          src={`https://server.cuppazee.app/user/avatar?username=${encodeURIComponent(username)}`}
          style={{ width: 64, height: 64, borderRadius: 32 }}
          className="align-self-center m-2"
        />
        <h4 className="text-center">{applicationName}</h4>
        <h6 className="text-center">wants to access your Munzee Account</h6>
        <small className="text-center">
          You are currently logged in as {username}.<br />
          <a href="/oauth/signout">Switch Account</a>
        </small>
        <form className="d-flex flex-column" method="POST">
          <ul className="list-group mt-2 mb-4">
            <li className="list-group-item d-flex flex-column">
              <small className="fw-bold">This will allow {applicationName} to:</small>
            </li>
            {/* TODO: Handle other scopes? */}
            <li className="list-group-item d-flex flex-column">
              <div className="fw-bold">Read Data</div>
              <small>Access data linked with your Munzee Account</small>
            </li>
          </ul>
          <div className="d-flex flex-row-reverse">
            <input
              className="btn btn-success"
              type="submit"
              name="AllowAccessButton"
              value="Allow Access"
            />
            <div className="flex-grow-1" />
            <input
              className="align-self-stretch btn btn-outline-secondary"
              type="submit"
              name="declineAccessButton"
              value="Cancel"
            />
          </div>
          <small className="pt-4 fst-italic">
            You can revoke {applicationName}'s access to your account at any time at{" "}
            <a href="https://www.munzee.com/revoke">https://www.munzee.com/revoke</a>
          </small>
        </form>
      </div>
    </div>
  );
}

export const meta: PluginMeta = {
  name: "Better API Login",
  id: "apilogin",
  urls: ["*api.munzee.com/oauth/*"],
  defaultOn: true,
};

async function injectStyles() {
  document.head.innerHTML += `
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
    <style>
      body {
        background: #00C35B url("https://server.cuppazee.app/LoginBackground.png");
      }
    </style>
  `;
}

export async function afterLoad() {
  let renderPage: ReactElement | null = null;
  if (location.href.includes("oauth/authorize")) {
    const query = document.querySelectorAll("p:nth-child(2) strong");
    const username = query[0].innerHTML;
    const applicationName = query[1].innerHTML;
    renderPage = <ApprovalPage username={username ?? "N/A"} applicationName={applicationName} />;
  } else if (location.href.includes("oauth/signin")) {
    const errorMessage =
      Array.from(document.querySelectorAll<HTMLElement>("p")).find(
        i => i.style.color === "rgb(255, 0, 0)"
      )?.innerText ?? null;
    renderPage = <LoginPage errorMessage={errorMessage} />;
  }

  if (renderPage) {
    const appDiv = document.createElement("div");
    appDiv.id = "app";
    document.body.innerHTML = "";
    document.body.appendChild(appDiv);
    ReactDOM.render(renderPage, appDiv);

    await injectStyles();
  }
}
