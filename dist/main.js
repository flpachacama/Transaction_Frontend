"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
require("dotenv/config");
const PORT = 3002;
// creates express app, registers all controller routes and returns you express app instance
const app = (0, routing_controllers_1.createExpressServer)({
    routePrefix: '/bp',
    controllers: [__dirname + '/controllers/*{.js,.ts}'],
    middlewares: [__dirname + '/middlewares/*{.js,.ts}'],
    defaultErrorHandler: false,
});
// run express application on port 3002
app.listen(PORT, () => {
    console.log('Servidor Iniciado');
    console.log(`Host: http://localhost:${PORT}`);
    console.log(`Fecha/Hora: ${new Date().toLocaleString()}`);
});
