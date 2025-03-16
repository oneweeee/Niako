import { Component } from "react";
import { apiUrl } from '../../config'

export class Callback extends Component {
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

        if(!response?.status) return this.locationToOrigin()

        const item = localStorage.getItem('niako')
        if(item) {
            const json = JSON.parse(item)
            json.currentUser = response.answer
            localStorage.setItem('niako', JSON.stringify(json))
        }

        return this.locationToOrigin()
    }

    locationToOrigin() {
        return window.location.href = window.location.origin
    }
}