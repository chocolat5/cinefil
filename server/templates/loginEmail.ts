export const loginEmail = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, 
  initial-scale=1.0"
    />
    <title>Login to Cinefil</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #fbfbfb;
      font-family:
        -apple-system, BlinkMacSystemFont, system-ui, monospace;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="background-color: #fbfbfb; padding: 40px 20px"
    >
      <tr>
        <td align="center">
          <!-- Main container -->
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              max-width: 600px;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            "
          >
            <!-- Header -->
            <tr>
              <td style="padding: 40px 40px 20px 40px; text-align: center">
                <h1
                  style="
                    margin: 0;
                    font-size: 28px;
                    font-weight: 500;
                    color: #326cfe;
                    font-family: monospace;
                  "
                >
                  cinefil
                </h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 0 40px 40px 40px">
                <p
                  style="
                    margin: 0 0 24px 0;
                    font-size: 16px;
                    line-height: 1.5;
                    color: #222222;
                  "
                >
                  Your verification code to log in to cinefil.me:
                </p>

                <!-- Verification code box -->
                <div
                  style="
                    background-color: #f5f8ff;
                    border-radius: 8px;
                    padding: 24px;
                    text-align: center;
                    margin-bottom: 24px;
                  "
                >
                  <div
                    style="
                      font-size: 24px;
                      font-weight: 700;
                      letter-spacing: 0.1em;
                      color: #326cfe;
                      font-family: monospace;
                    "
                  >
                    {{LOGIN_CODE}}
                  </div>
                </div>

                <p
                  style="
                    margin: 0 0 16px 0;
                    font-size: 14px;
                    line-height: 1.5;
                    color: #666666;
                    text-align: center;
                  "
                >
                  This code will expire in <strong>10 minutes</strong>.
                </p>

                <p
                  style="
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.5;
                    color: #666666;
                    text-align: center;
                  "
                >
                  If you didn't request this code, please ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  padding: 20px 40px 40px 40px;
                  border-top: 1px solid #eeeeee;
                "
              >
                <p
                  style="
                    margin: 0;
                    font-size: 12px;
                    line-height: 1.5;
                    color: #999999;
                    text-align: center;
                  "
                >
                  &copy; 2025, cinefil
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
