import BaseMessageCommand from "#base/BaseMessageCommand";

export default new BaseMessageCommand(
    { name: 'eval', aliases: [ 'e' ], dev: true },
    async (client, message, args) => {
        try {
            const code = eval(args.join(' '))
            return message.channel.send({ content: client.util.toCode(code) })
        } catch {
            return message.channel.send({ content: `${message.author.toString()} блять все хуево и с ошибками, брат` })
        }
    }
)