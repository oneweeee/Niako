import { Component } from "react";
import { apiUrl } from '../../config'

class Callback extends Component {
    render() {
        return (<div></div>)
    }

    async componentDidMount() {
        const code = new URLSearchParams(window.location.search).get('code')
        if(!code) return this.locationToOrigin()

        const response = await fetch(`${apiUrl}/private/user/auth`, {
            method: 'Post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                code, redirect_uri: `${window.location.origin}/callback`
            })
        }).then(async (res) => await res.json())

        if(!response?.ok) return this.locationToOrigin()

        const item = localStorage.getItem('app')
        if(item) {
            const json = JSON.parse(item)
            json.user = { ...response.result, lastUpdate: Date.now() }
            this.props.setUser(json.user)
            localStorage.setItem('app', JSON.stringify(json))
        }

        return this.locationToOrigin()
    }

    getImage(user, path) {
        const get = path === 'avatars' ? user.avatar : user.banner
        if(!get) return ''
        
        return `https://cdn.discordapp.com/${path}/${user.id}/${get}.${get.startsWith('a_') ? 'gif' : 'png'}?size=4096`
    }

    locationToOrigin() {
        return window.location.href = window.location.origin
    }
}

export default Callback