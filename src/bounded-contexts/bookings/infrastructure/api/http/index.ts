import app from './express';
import ExpressApp from '../../../../../framework/express/ExpressApp';

const expressApp = new ExpressApp(app);
expressApp.launch();
