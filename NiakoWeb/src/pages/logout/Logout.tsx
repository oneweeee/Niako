import { Component } from "react";
import { apiUrl } from '../../config'

export class Logout extends Component {
    render() {
        return (<div></div>)
    }

    async componentDidMount() {
        const item = localStorage.getItem('niako')
        if(item) {
            const json = JSON.parse(item)

            await fetch(`${apiUrl}/private/user/token`, {
                method: 'Delete',
                headers: {
                    'Authorization': json.currentUser.token,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(json.currentUser)
            })
    
            json.currentUser = null
            localStorage.setItem('niako', JSON.stringify(json))
        }

        return this.locationToOrigin()
    }

    locationToOrigin() {
        return window.location.href = window.location.origin
    }
}