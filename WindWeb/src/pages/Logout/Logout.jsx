import { Component } from "react";
import { apiUrl } from '../../config'

class Logout extends Component {
    render() {
        return (<div></div>)
    }

    async componentDidMount() {
        const item = localStorage.getItem('app')
        if(item) {
            const json = JSON.parse(item)

            await fetch(`${apiUrl}/private/user/token`, {
                method: 'Delete',
                headers: {
                    'Authorization': json.user.token,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(json.user)
            })
    
            json.user = null
            localStorage.setItem('app', JSON.stringify(json))
        }

        return this.locationToOrigin()
    }

    locationToOrigin() {
        return window.location.href = window.location.origin
    }
}

export default Logout