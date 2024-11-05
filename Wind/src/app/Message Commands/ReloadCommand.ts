import BaseMessageCommand from "#base/BaseMessageCommand";

export default new BaseMessageCommand(
    { name: 'reboot', aliases: [ 'rb' ], dev: true },
    async (client, message, args) => {
        if(args[0] === 'all') {
            return client.shard!.respawnAll()
        } else {
            return process.exit()
        }
    }
)