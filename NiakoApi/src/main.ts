console.clear()

import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { WebSocketServer } from "ws";

async function start() {
    const app = await NestFactory.create(AppModule, { cors: true })

    const swagger = new DocumentBuilder()
    .setTitle('Niako Api')
    .setDescription('Niako Api - api.niako.xyz (dev: oneheka)')
    .setVersion('2.0.0')
    .build()

    const document = SwaggerModule.createDocument(app, swagger)
    SwaggerModule.setup('documentation', app, document)
  
    await app.listen(3001)

    const wss = new WebSocketServer({ port: 3331 })
    wss.on('listening', () => console.log('listening'))
    wss.on('connection', (ws) => {
        ws.on('message', (data) => wss.clients.forEach((c) => c.send(data)))
        ws.send('connect')
    })
    wss.on('error', (err) => console.log(err))
}

start()