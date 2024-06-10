import { StrategyCreated } from 'passport';
import { Request } from 'express';
import 'isomorphic-fetch';

interface YandexStrategyVerifyFn {
  (user: any, callback: (err: string | null, user?: any) => void): void;
}

interface YandexStrategyOptions {
  clientID: string;
  clientSecret: string;
  callbackUri?: string;
}

export class YandexStrategy {
  public name = 'yandex';

  public oauthURL = new URL(
    'https://oauth.yandex.ru/authorize?response_type=code',
  );
  public tokenURL = new URL('https://oauth.yandex.ru/token');
  public profileURL = new URL('https://login.yandex.ru/info?format=json');
  public clientID: string;
  public clientSecret: string;
  public verify: YandexStrategyVerifyFn;

  constructor(
    { clientID, clientSecret, callbackUri }: YandexStrategyOptions,
    verify: YandexStrategyVerifyFn,
  ) {
    this.clientID = clientID;
    this.clientSecret = clientSecret;
    this.verify = verify;

    this.oauthURL.searchParams.append('client_id', clientID);

    if (callbackUri) {
      this.oauthURL.searchParams.append('redirect_uri', callbackUri);
    }
  }

  async authenticate(this: StrategyCreated<this>, req: Request) {
    const code = req.query.code as string;

    if (code) {
      const response = await fetch(this.tokenURL.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          client_id: this.clientID,
          client_secret: this.clientSecret,
        }),
      });

      const { access_token } = await response.json();

      const userResponse = await fetch(this.profileURL.toString(), {
        headers: { Authorization: `OAuth ${access_token}` },
      });

      const userInfo = await userResponse.json();

      const onVerify = (err: string | null, user?: any) => {
        if (err) {
          this.fail(err);
          return;
        }

        this.success(user);
      };

      this.verify(userInfo, onVerify);
    } else {
      this.redirect(this.oauthURL.toString());
    }
  }
}
