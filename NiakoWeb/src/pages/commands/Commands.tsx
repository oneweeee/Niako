import { Component } from 'react';
import { apiUrl } from '../../config';

export class Commands extends Component<{}, { commands: any[] }> {
    state = {
        commands: []
    }

    render() {
        return (<div>{this.state.commands.map((c: any) => (<div key={c.name}>{c.name}</div>))}</div>)
    }

    async componentDidMount() {
        const response = await fetch(
            `${apiUrl}/public/commands`
        ).then(async (res) => await res.json())

        if(!response?.status) return

        return this.setState({ commands: response.answer })
    }
}