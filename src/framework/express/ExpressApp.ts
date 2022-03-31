import { Express } from 'express';

export default class ExpressApp {
  constructor(private readonly app: Express) {}

  public launch() {
    const port = this.normalizePort(process.env.PORT || '3000');
    this.app.set('port', port);

    this.app.listen(port, () => {
      console.log(`server started at http://localhost:${port}`);
    });
  }

  private normalizePort(val: string) {
    const portNumber = parseInt(val, 10);

    if (Number.isNaN(portNumber)) {
      // named pipe
      return val;
    }

    if (portNumber >= 0) {
      // portNumber number
      return portNumber;
    }

    return false;
  }
}
